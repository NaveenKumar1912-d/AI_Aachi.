# Python Backend Setup

The backend has been converted from Node.js/Express to Python/FastAPI.

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

### Development Mode

The server can be started in two ways:

1. **Using npm (recommended for development):**
   ```bash
   npm run dev
   ```
   This will start both the Python backend and the Vite frontend.

2. **Manually:**
   ```bash
   # Terminal 1 - Backend
   python server/main.py
   
   # Terminal 2 - Frontend
   npm run frontend
   ```

### Production Mode

For production, use uvicorn directly:
```bash
uvicorn server.main:app --host 0.0.0.0 --port 3001
```

## Environment Variables

Create a `.env` file in the project root with:
```
GEMINI_API_KEY=your_api_key_here
```

## API Endpoints

- `POST /api/chat` - Chat endpoint with streaming support
- `POST /api/generate-recipe-image` - Generate recipe image descriptions
- `GET /api/health` - Health check endpoint

## Utility Scripts

### Extract Recipes Script

A Python script to extract and parse recipes from zip files:

```bash
npm run extract-recipes
# or directly:
python scripts/extract_recipes.py
```

This script:
- Extracts images from the zip file
- Parses recipe text files
- Generates a JSON file with all recipes

## Differences from Node.js Version

- Uses FastAPI instead of Express
- Uses `google-generativeai` Python SDK instead of `@google/generative-ai` npm package
- Same API endpoints and response formats for compatibility with frontend
- Recipe extraction script converted to Python (uses standard library, no external dependencies)

