
import fs from 'fs';
import path from 'path';
import https from 'https';

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

console.log("Using Key ending in:", apiKey.slice(-4));

if (!apiKey) {
    console.error("No API key found");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            try {
                const json = JSON.parse(data);
                console.log("Available Models:");
                json.models.forEach(m => {
                    console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods.join(', ')})`);
                });
            } catch (e) {
                console.error("Error parsing JSON:", e.message);
                console.log("Raw Data:", data);
            }
        } else {
            console.error(`Request failed with status ${res.statusCode}`);
            console.error("Response:", data);
        }
    });

}).on('error', (err) => {
    console.error("Network Error:", err.message);
});
