import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Manually load env since we are running with ts-node/node directly
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
const apiKey = envConfig.GEMINI_API_KEY;

if (!apiKey) {
    console.error("API Key not found in .env.local");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        const modelResponse = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // The SDK doesn't have a direct listModels on the client instance in some versions, 
        // but usually we can try to just run a dummy generation or find a list method if available.
        // Actually, checking docs/types, there isn't a simple listModels on the main class in the Node SDK easily exposed 
        // without using the model manager or similar.

        // However, the error message literally suggested: "Call ListModels to see the list of available models".
        // We can try to make a raw REST call if the SDK doesn't make it easy, or just try to generate with a few variants.

        console.log("Checking gemini-1.5-flash...");
        const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const resultFlash = await modelFlash.generateContent("Test");
        console.log("gemini-1.5-flash works!");
    } catch (error) {
        console.error("gemini-1.5-flash failed:", error.message);
    }

    try {
        console.log("Checking gemini-pro...");
        const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
        const resultPro = await modelPro.generateContent("Test");
        console.log("gemini-pro works!");
    } catch (error) {
        console.error("gemini-pro failed:", error.message);
    }
}

listModels();
