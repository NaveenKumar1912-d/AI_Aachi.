import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT = 3001;

// Use provided API key or environment variable
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyB6u-H_qjC53h3dlDk_a3DIjA3v1z6nJco';

if (!GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY is required');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

app.use(cors());
app.use(express.json());

const systemPrompt = `You are an expert Tamil Nadu cuisine chef and recipe advisor. Your name is "AI Aachi" (AI Grandma).

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

Then ask which one they'd like detailed instructions for.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    console.log('Received chat request with', messages?.length || 0, 'messages');

    if (!messages || !Array.isArray(messages)) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.write(`data: ${JSON.stringify({ error: 'Invalid messages format' })}\n\n`);
      res.end();
      return;
    }

    if (messages.length === 0) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.write(`data: ${JSON.stringify({ error: 'No messages provided' })}\n\n`);
      res.end();
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt
    });

    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({ history });
    const lastMessage = messages[messages.length - 1];
    
    if (!lastMessage || lastMessage.role !== 'user') {
      res.write(`data: ${JSON.stringify({ error: 'Last message must be from user' })}\n\n`);
      res.end();
      return;
    }
    
    console.log('Sending message to Gemini:', lastMessage.content.substring(0, 100) + '...');
    const result = await chat.sendMessageStream(lastMessage.content);

    let chunkCount = 0;
    for await (const chunk of result.stream) {
      try {
        const text = chunk.text();
        if (text && text.trim()) {
          chunkCount++;
          res.write(`data: ${JSON.stringify({ 
            text: text,
            choices: [{ 
              delta: { 
                content: text 
              } 
            }] 
          })}\n\n`);
        }
      } catch (chunkError) {
        console.error('Error processing chunk:', chunkError);
        // Continue processing other chunks
      }
    }
    
    console.log('Stream completed. Sent', chunkCount, 'chunks');

    res.write('data: ' + JSON.stringify({ done: true }) + '\n\n');
    res.end();
  } catch (error) {
    console.error('Chat error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// Generate recipe image using Gemini API
app.post('/api/generate-recipe-image', async (req, res) => {
  try {
    const { recipeName, region, category } = req.body;
    
    if (!recipeName) {
      return res.status(400).json({ error: 'Recipe name is required' });
    }

    console.log(`Generating image for recipe: ${recipeName}`);

    // Use Gemini to generate image
    // Note: Gemini 2.0 Flash supports image generation
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
    });

    // Create a detailed prompt for image generation
    const imagePrompt = `Generate a high-quality, appetizing food photograph of ${recipeName}, a traditional Tamil Nadu dish${region ? ` from ${region} region` : ''}${category ? ` (${category})` : ''}. The image should be:
- Professional food photography style
- Well-lit and appetizing
- Show the dish in a traditional South Indian serving style
- Include appropriate garnishing
- High resolution and clear
- Realistic and authentic looking`;

    try {
      // Generate image using Gemini
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: imagePrompt }] }],
        generationConfig: {
          temperature: 0.7,
        }
      });

      const response = await result.response;
      
      // Check if response contains image data
      // Note: Gemini's image generation might return base64 or URL
      // Adjust based on actual API response format
      const imageData = response.candidates?.[0]?.content?.parts?.[0];
      
      if (imageData && imageData.inlineData) {
        // If image is returned as base64
        return res.json({
          success: true,
          imageUrl: `data:${imageData.inlineData.mimeType};base64,${imageData.inlineData.data}`,
          recipeName: recipeName
        });
      } else if (imageData && imageData.text) {
        // If Gemini returns a description or URL, we might need to use a different approach
        // For now, return a placeholder or use text-to-image service
        return res.json({
          success: true,
          imageUrl: null,
          description: imageData.text,
          recipeName: recipeName,
          note: 'Image generation in progress'
        });
      } else {
        // Fallback: Use Gemini to create a detailed image description
        // Then we can use that with an image generation service
        const descriptionResult = await model.generateContent({
          contents: [{ 
            role: 'user', 
            parts: [{ 
              text: `Describe in detail how ${recipeName} looks when served, including colors, presentation, and garnishing. Be very specific about the visual appearance.` 
            }] 
          }],
        });
        
        const description = await descriptionResult.response;
        const descriptionText = description.text();
        
        return res.json({
          success: true,
          imageUrl: null,
          description: descriptionText,
          recipeName: recipeName,
          prompt: imagePrompt
        });
      }
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      // Fallback: Return a description that can be used for image generation
      return res.json({
        success: false,
        error: geminiError.message,
        recipeName: recipeName,
        fallback: true
      });
    }
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate recipe image' 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', model: 'gemini-1.5-flash' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
});
