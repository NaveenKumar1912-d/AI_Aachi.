
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// Read .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
let apiKey = '';
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    const match = content.match(/GEMINI_API_KEY=(.*)/);
    if (match) {
        apiKey = match[1].trim();
    }
}

const genAI = new GoogleGenerativeAI(apiKey);
// Based on list_models output, trying the available version
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function run() {
    try {
        const prompt = "Explain how to make Idli in one sentence.";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Success! Response:", text);
    } catch (error) {
        console.error("Error connecting to Gemini:", error.message);
    }
}

run();
