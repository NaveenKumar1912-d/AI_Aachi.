# Complete Python Conversion Guide

## Overview

The entire application has been converted from Node.js/React to a pure Python stack using FastAPI with Jinja2 templates.

## New Structure

```
app/
├── __init__.py
├── main.py              # Main FastAPI application
└── utils/
    ├── recipe_parser.py      # Recipe parsing utilities
    └── recipe_image_mapper.py # Image mapping utilities

templates/
├── base.html           # Base template
├── index.html          # Home page
├── ai_cook.html        # AI Cook page
└── all_recipes.html    # All recipes page

scripts/
└── extract_recipes.py  # Recipe extraction script (Python)
```

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

### Development Mode

```bash
python app/main.py
```

The server will run on `http://localhost:3001`

### Production Mode

```bash
uvicorn app.main:app --host 0.0.0.0 --port 3001
```

## Features

### Frontend (Python/Jinja2)
- Server-side rendered HTML pages
- Jinja2 templates for dynamic content
- Static file serving for assets
- JavaScript for interactive features (chat interface)

### Backend (Python/FastAPI)
- FastAPI REST API
- Streaming chat responses
- Recipe image generation
- Health check endpoint

### Utilities (Python)
- Recipe parsing from text
- Recipe image mapping
- Recipe extraction from zip files

## API Endpoints

- `GET /` - Home page
- `GET /ai-cook` - AI Cook page
- `GET /all-recipes` - All recipes page
- `POST /api/chat` - Chat endpoint (streaming)
- `POST /api/generate-recipe-image` - Image generation
- `GET /api/health` - Health check

## Static Files

- `/assets/*` - Served from `src/assets/`
- `/public/*` - Served from `public/`

## Differences from React Version

1. **Server-side rendering** instead of client-side React
2. **Jinja2 templates** instead of JSX
3. **Python utilities** instead of TypeScript
4. **Simpler deployment** - single Python server
5. **No build step** required for frontend

## Migration Notes

- All React components converted to HTML templates
- TypeScript utilities converted to Python modules
- State management handled server-side
- API endpoints remain the same for compatibility

## Next Steps

1. Add more recipe data loading
2. Enhance templates with more features
3. Add database integration if needed
4. Deploy to production server

