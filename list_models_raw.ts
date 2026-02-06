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
    console.error("API Key not found");
    process.exit(1);
}

async function checkAvailableModels() {
    console.log("Fetching available models via raw HTTP...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("AVAILABLE MODELS:");
        if (data.models) {
            data.models.forEach((m: any) => {
                // Filter for generateContent supported models
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("No models returned in list.");
        }
    } catch (e: any) {
        console.error("Failed to list models:", e.message);
    }
}

checkAvailableModels();
