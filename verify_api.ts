import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
const apiKey = envConfig.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ API Key NOT found in .env.local");
    process.exit(1);
}

console.log(`🔑 Testing API Key: ${apiKey.substring(0, 10)}...`);

async function verifyGemini() {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        console.log("⚡ Attempting to generate content with 'gemini-pro'...");
        const result = await model.generateContent("Say 'API is working' if you can read this.");
        const response = await result.response;
        const text = response.text();

        console.log("\n✅ SUCCESS! API Response:");
        console.log("--------------------------------------------------");
        console.log(text);
        console.log("--------------------------------------------------");
    } catch (error: any) {
        console.error("\n❌ FAILED. Error details:");
        console.error(error.message);
        if (error.message.includes("404")) {
            console.error("👉 Hint: The model 'gemini-pro' might not be available or the API key is invalid.");
        }
    }
}

verifyGemini();
