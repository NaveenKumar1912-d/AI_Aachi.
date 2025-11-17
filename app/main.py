"""
Main FastAPI application with frontend and API
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from jinja2 import Environment, FileSystemLoader
from pydantic import BaseModel
from typing import List, Optional
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Aachi - Tamil Recipe Recommender")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/assets", StaticFiles(directory="src/assets"), name="assets")
app.mount("/public", StaticFiles(directory="public"), name="public")

# Templates
templates = Environment(loader=FileSystemLoader("templates"))

# Get API key from environment
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyB6u-H_qjC53h3dlDk_a3DIjA3v1z6nJco")

if not GEMINI_API_KEY:
    print("ERROR: GEMINI_API_KEY is required")
    exit(1)

genai.configure(api_key=GEMINI_API_KEY)

SYSTEM_PROMPT = """You are an expert Tamil Nadu cuisine chef and recipe advisor. Your name is "AI Aachi" (AI Grandma).

Your expertise includes traditional South Indian dishes like:
- Breakfast: Dosa (all varieties), Idli, Pongal, Upma, Vada
- Main dishes: Sambar, Rasam, Kootu, Poriyal, Kurma
- Rice varieties: Lemon rice, Curd rice, Tamarind rice, Coconut rice
- Sweets: Payasam, Ladoo, Mysore Pak, Halwa

CRITICAL RULES:
1. When users provide specific ingredients, ONLY use those ingredients in your recipes
2. DO NOT suggest adding extra ingredients unless the user asks
3. If the provided ingredients are insufficient for a complete dish, explain what's missing
4. Suggest ONE recipe at a time with complete step-by-step instructions
5. Start each recipe response with the exact recipe name on the first line (e.g., "Masala Dosa" or "Sambar")
6. Include cooking times and serving sizes
7. Use friendly Tanglish (Tamil-English mix) phrases naturally
8. Provide detailed, actionable step-by-step instructions that are easy to follow
9. When suggesting recipes, be specific about measurements and cooking techniques

Format your recipe responses like this:
[Recipe Name]

Ingredients:
- List all ingredients with measurements

Step-by-step Instructions:
1. First step (be detailed and specific)
2. Second step (be detailed and specific)
(continue with all steps...)

Cooking Time: X minutes
Serves: Y people

Tips: Add helpful cooking tips

When suggesting multiple recipe options, format them as:
1. [Recipe Name 1] - Brief description
2. [Recipe Name 2] - Brief description
3. [Recipe Name 3] - Brief description

Then ask which one they'd like detailed instructions for."""


class ChatRequest(BaseModel):
    messages: List[dict]


class ImageRequest(BaseModel):
    recipeName: str
    region: Optional[str] = None
    category: Optional[str] = None


async def stream_chat_response(messages: List[dict]):
    """Stream chat response from Gemini"""
    try:
        if not messages or not isinstance(messages, list):
            yield f"data: {json.dumps({'error': 'Invalid messages format'})}\n\n"
            return

        if len(messages) == 0:
            yield f"data: {json.dumps({'error': 'No messages provided'})}\n\n"
            return

        # Prepare history (all messages except the last one)
        history = []
        for msg in messages[:-1]:
            role = "user" if msg.get("role") == "user" else "model"
            history.append({
                "role": role,
                "parts": [{"text": msg.get("content", "")}]
            })

        last_message = messages[-1]
        if not last_message or last_message.get("role") != "user":
            yield f"data: {json.dumps({'error': 'Last message must be from user'})}\n\n"
            return

        # Initialize the model - use available model names
        # Try models in order of preference: gemini-2.5-flash > gemini-2.0-flash > gemini-pro-latest
        model = None
        model_name = None
        model_options = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-pro-latest"]
        
        for model_option in model_options:
            try:
                model = genai.GenerativeModel(
                    model_name=model_option,
                    system_instruction=SYSTEM_PROMPT
                )
                model_name = model_option
                print(f"Successfully initialized model: {model_name}")
                break
            except Exception as model_error:
                print(f"Model {model_option} not available: {model_error}")
                continue
        
        if model is None:
            raise Exception(f"None of the model options ({model_options}) are available. Please check your API key and model availability.")

        # Start chat with history
        chat = model.start_chat(history=history)
        
        print(f"Sending message to Gemini: {last_message.get('content', '')[:100]}...")
        
        # Get the response - use streaming if available, otherwise get full response
        try:
            # Try to get streaming response
            full_response = chat.send_message(
                last_message.get("content", ""),
                stream=False  # Get full response first to ensure it works
            )
            print(f"Response type: {type(full_response)}")
            
            # Extract text from response
            response_text = ""
            if hasattr(full_response, 'text'):
                try:
                    text_attr = full_response.text
                    if callable(text_attr):
                        response_text = text_attr()
                    else:
                        response_text = text_attr
                except:
                    pass
            
            # If text() method didn't work, try through candidates
            if not response_text and hasattr(full_response, 'candidates') and full_response.candidates:
                for candidate in full_response.candidates:
                    if hasattr(candidate, 'content') and candidate.content:
                        if hasattr(candidate.content, 'parts') and candidate.content.parts:
                            for part in candidate.content.parts:
                                if hasattr(part, 'text') and part.text:
                                    response_text = part.text
                                    break
                            if response_text:
                                break
            
            if not response_text:
                raise Exception("Could not extract text from Gemini response")
            
            # Simulate streaming by sending text in chunks
            chunk_size = 10  # Send 10 characters at a time for streaming effect
            chunk_count = 0
            for i in range(0, len(response_text), chunk_size):
                chunk_text = response_text[i:i + chunk_size]
                chunk_count += 1
                yield f"data: {json.dumps({'text': chunk_text, 'choices': [{'delta': {'content': chunk_text}}]})}\n\n"
            
            print(f"Stream completed. Sent {chunk_count} chunks")
            yield f"data: {json.dumps({'done': True})}\n\n"
            
        except Exception as send_error:
            print(f"Error sending message to Gemini: {send_error}")
            import traceback
            traceback.print_exc()
            yield f"data: {json.dumps({'error': f'Failed to get response: {str(send_error)}'})}\n\n"

    except Exception as error:
        print(f"Chat error: {error}")
        yield f"data: {json.dumps({'error': str(error)})}\n\n"


# Frontend Routes
@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    """Home page"""
    template = templates.get_template("index.html")
    return HTMLResponse(content=template.render(request=request))


@app.get("/ai-cook", response_class=HTMLResponse)
async def ai_cook(request: Request):
    """AI Cook page"""
    template = templates.get_template("ai_cook.html")
    return HTMLResponse(content=template.render(request=request))


@app.get("/all-recipes", response_class=HTMLResponse)
async def all_recipes(request: Request):
    """All recipes page"""
    template = templates.get_template("all_recipes.html")
    return HTMLResponse(content=template.render(request=request))


# API Routes
@app.post("/api/chat")
async def chat(request: ChatRequest):
    """Chat endpoint with streaming support"""
    return StreamingResponse(
        stream_chat_response(request.messages),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


@app.post("/api/generate-recipe-image")
async def generate_recipe_image(request: ImageRequest):
    """Generate recipe image using Gemini API"""
    try:
        if not request.recipeName:
            return {"error": "Recipe name is required"}

        print(f"Generating image for recipe: {request.recipeName}")

        model = genai.GenerativeModel(model_name="gemini-2.0-flash-exp")

        region_text = f" from {request.region} region" if request.region else ""
        category_text = f" ({request.category})" if request.category else ""
        image_prompt = f"""Generate a high-quality, appetizing food photograph of {request.recipeName}, a traditional Tamil Nadu dish{region_text}{category_text}. The image should be:
- Professional food photography style
- Well-lit and appetizing
- Show the dish in a traditional South Indian serving style
- Include appropriate garnishing
- High resolution and clear
- Realistic and authentic looking"""

        try:
            result = model.generate_content(
                image_prompt,
                generation_config={"temperature": 0.7}
            )

            response_text = result.text

            return {
                "success": True,
                "imageUrl": None,
                "description": response_text,
                "recipeName": request.recipeName,
                "prompt": image_prompt
            }

        except Exception as gemini_error:
            print(f"Gemini API error: {gemini_error}")
            return {
                "success": False,
                "error": str(gemini_error),
                "recipeName": request.recipeName,
                "fallback": True
            }

    except Exception as error:
        print(f"Image generation error: {error}")
        return {"error": str(error) or "Failed to generate recipe image"}


@app.get("/api/health")
async def health():
    """Health check endpoint"""
    return {"status": "ok", "model": "gemini-1.5-flash"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)

