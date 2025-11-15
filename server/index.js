import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT = 3001;

if (!process.env.GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY environment variable is required');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
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
    
    const result = await chat.sendMessageStream(lastMessage.content);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }

    res.write('data: {"done":true}\n\n');
    res.end();
  } catch (error) {
    console.error('Chat error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', model: 'gemini-1.5-flash' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
});
