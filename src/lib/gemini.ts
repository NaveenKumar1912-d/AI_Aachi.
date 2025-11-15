import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface ChatMessage {
  role: "user" | "model";
  parts: string;
}

export interface StreamChunk {
  text?: string;
  image?: string;
  done?: boolean;
}

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

Format your recipe responses like this:
[Recipe Name]

Ingredients:
- List all ingredients with measurements

Step-by-step Instructions:
1. First step
2. Second step
(continue...)

Cooking Time: X minutes
Serves: Y people

Tips: Add helpful cooking tips`;

export async function streamGeminiChat(
  messages: ChatMessage[],
  onChunk: (chunk: StreamChunk) => void
): Promise<void> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt
    });

    const chat = model.startChat({
      history: messages.slice(0, -1).map(msg => ({
        role: msg.role,
        parts: [{ text: msg.parts }]
      }))
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessageStream(lastMessage.parts);

    let fullResponse = "";
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      onChunk({ text: chunkText });
    }

    onChunk({ done: true });
  } catch (error) {
    console.error("Gemini chat error:", error);
    throw error;
  }
}


export async function suggestRecipeFromIngredients(ingredients: string[]): Promise<string> {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: systemPrompt
  });

  const prompt = `I have these ingredients: ${ingredients.join(', ')}. What Tamil Nadu recipe can I make? Please suggest ONE recipe with complete instructions.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
