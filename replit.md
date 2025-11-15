# Tamil Smart Samayal - AI-Powered Recipe Recommender

## Overview

Tamil Smart Samayal is an AI-powered recipe recommendation system focused on authentic Tamil Nadu cuisine. The application helps users discover traditional South Indian recipes based on available ingredients, dietary preferences, regional styles, and spice levels. It features an interactive AI chatbot ("AI Aachi") powered by Google's Gemini AI that provides personalized cooking guidance and recipe suggestions.

**Key Features:**
- AI-powered recipe recommendations based on user ingredients
- Interactive chat interface with AI cooking assistant
- Curated collection of Tamil Nadu recipes with regional variations
- Advanced filtering by diet type, meal category, region, and spice level
- Step-by-step cooking instructions with visual guides
- Responsive design optimized for all devices

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework:** React 18 with TypeScript using Vite as the build tool

**Routing:** React Router v6 for client-side navigation with three main routes:
- `/` - Home page with featured recipes and filters
- `/ai-cook` - AI chatbot interface for ingredient-based recommendations
- `/all-recipes` - Complete recipe catalog browser

**UI Component System:** Shadcn/ui built on Radix UI primitives with Tailwind CSS for styling
- Custom design system using HSL color variables for Tamil Nadu culinary theme (turmeric yellow primary, leaf green secondary, red spice accent)
- Responsive components with mobile-first approach
- Pre-built components for dialogs, cards, forms, and data display

**State Management:** 
- React Query (TanStack Query) for server state and API calls
- Local React state (useState/useRef) for UI interactions
- No global state management library (Redux/Zustand) used

**Key Design Patterns:**
- Component composition with separate presentational and container components
- Custom hooks for reusable logic (use-toast, use-mobile)
- Controlled form inputs with React Hook Form integration
- Modal-based recipe detail views for better UX

### Backend Architecture

**Server:** Express.js running on Node.js (port 3001)

**API Structure:**
- RESTful `/api/chat` endpoint for AI recipe recommendations
- Proxy configuration in Vite dev server forwards `/api/*` requests to backend
- CORS enabled for cross-origin requests

**AI Integration:** Google Generative AI (Gemini)
- Custom system prompt defining AI personality as "AI Aachi" (AI Grandma)
- Context-aware recipe generation using user ingredients
- Streaming responses for real-time chat experience
- Recipe formatting with strict ingredient usage rules

**Database Layer:** Drizzle ORM configured for PostgreSQL
- Schema includes recipes table with comprehensive metadata (nutrition, region, spice level)
- Chat history table for conversation persistence
- Enum types for diet, meal type, spice level, and regional categorization

**Recipe Data Model:**
```typescript
- Recipe metadata: name (Tamil + English), category, region, diet type, spice level
- Cooking details: time, servings, nutrition (calories, protein, carbs, fat)
- Instructions: ingredients array, step-by-step instructions, step images, tips
- Visual assets: main image, step-by-step progress images
```

### Data Storage

**Database:** PostgreSQL via Neon serverless
- WebSocket connection pooling for serverless environments
- Connection managed through environment variable `DATABASE_URL`
- Schema migrations managed via Drizzle Kit

**Static Assets:** 
- Recipe images stored in `/public/images/recipes/`
- Step-by-step instruction images in `/public/assets/steps/`
- Regional map and hero images in `/public/assets/`

**Data Structure Decisions:**
- Arrays used for ingredients, steps, and tips to maintain order
- Enums for constrained values (diet type, spice level) ensure data consistency
- Image URLs stored as text rather than binary for CDN compatibility

### External Dependencies

**AI Services:**
- Google Generative AI (Gemini API) - Recipe generation and conversational AI
  - Requires `GEMINI_API_KEY` environment variable
  - Streaming API used for real-time chat responses

**Database:**
- Neon Serverless PostgreSQL - Primary data storage
  - WebSocket connection via `@neondatabase/serverless`
  - Requires `DATABASE_URL` environment variable

**Third-Party Libraries:**
- Radix UI primitives for accessible component foundation
- TanStack React Query for server state management
- React Router for client-side routing
- Tailwind CSS for utility-first styling
- Drizzle ORM for type-safe database queries
- AdmZip for recipe data extraction (scripts)

**Development Tools:**
- Vite for fast development and optimized builds
- TypeScript for type safety
- ESLint for code quality
- Lovable Tagger plugin for development mode component identification

**Deployment Considerations:**
- Frontend and backend run as separate processes (concurrently in dev)
- Environment variables required: `GEMINI_API_KEY`, `DATABASE_URL`
- Build artifacts generated to `/dist` directory
- Production server configuration needed for backend API hosting