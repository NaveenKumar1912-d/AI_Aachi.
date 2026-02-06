import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { UserDNA, Recipe, SelectedIngredient, CookingMode } from "../types";

declare var process: any;

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.API_KEY || '');

export const startChatSession = (userDNA: UserDNA) => {
  console.log("Chat Model: gemini-2.5-flash");
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `
      You are "AI Aachi", an expert in Tamil Nadu cuisine and a personal cooking coach.
      "Aachi" means grandmother or a wise elderly woman in Tamil, known for traditional, soulful cooking.
      
      The user's Cooking DNA:
      - Spice Tolerance: ${userDNA.spiceTolerance}/5
      - Oil Usage: ${userDNA.oilUsage}/5
      - Salt Tolerance: ${userDNA.saltTolerance}/5
      - Health Conditions: ${userDNA.healthConditions.join(", ") || 'None'}
      - Allergies: ${userDNA.allergies.join(", ") || 'None'}
      - Custom Notes: ${userDNA.customHealthNotes} | ${userDNA.customAllergyNotes}
      
      Your Goal:
      1. Answer questions about Tamil Nadu recipes, ingredients, and techniques.
      2. Provide substitutions based on the user's allergies and health conditions.
      3. Be encouraging, culturally knowledgeable (Tamil culture), and concise.
      4. If asked about something non-culinary, gently steer the conversation back to the kitchen.
    `
  });

  return model.startChat({});
};

export const generateAdaptedRecipe = async (
  ingredients: SelectedIngredient[],
  userDNA: UserDNA,
  mode: CookingMode,
  isNonVeg: boolean,
  grandmaModeEnabled: boolean
): Promise<Recipe> => {
  console.log("Recipe Model: gemini-2.5-flash");
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          nameTamil: { type: SchemaType.STRING },
          ingredientsUsed: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          method: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          methodTamil: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          cookingTime: { type: SchemaType.STRING },
          difficulty: { type: SchemaType.STRING },
          healthSuitability: { type: SchemaType.STRING },
          allergySafety: { type: SchemaType.STRING },
          totalCost: { type: SchemaType.NUMBER },
          costBreakdown: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                name: { type: SchemaType.STRING },
                cost: { type: SchemaType.NUMBER }
              },
              required: ["name", "cost"]
            }
          },
          budgetStatus: {
            type: SchemaType.STRING,
            enum: ['Within budget', 'Slightly over budget', 'Exceeds budget'],
            format: "enum"
          },
          savingTips: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          warnings: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          aiDecisionExplanation: { type: SchemaType.STRING }
        },
        required: ["name", "nameTamil", "ingredientsUsed", "method", "methodTamil", "cookingTime", "difficulty", "healthSuitability", "allergySafety", "totalCost", "costBreakdown", "budgetStatus", "savingTips", "warnings", "aiDecisionExplanation"]
      }
    }
  });

  const ingredientString = ingredients
    .map(ing => `${ing.name} (Quantity: ${ing.quantity})`)
    .join(", ");

  const grandmaInstruction = grandmaModeEnabled ? `
    ACTIVATE GRANDMA MODE (TRADITIONAL WISDOM):
    - Prioritize 100% authentic heirloom techniques.
    - Mention traditional utensils like 'Ammikkal' (grinding stone), 'Kal Chatti' (stone pot), or 'Eeya Chatti' where relevant.
    - Use a warm, grandmotherly tone with Tamil-influenced English.
    - Provide "Aachi's Secret Tip" in the AI Decision Explanation.
    - Avoid modern shortcuts; focus on slow, flavor-extracting processes.
  ` : "";

  const prompt = `
    You are "AI Aachi", an advanced self-learning cooking assistant specializing EXCLUSIVELY in Tamil Nadu cuisine.
    You act like a wise grandmother who knows exactly what is healthy and delicious.
    
    ${grandmaInstruction}

    CRITICAL MISSION: Create a Tamil Nadu recipe using ONLY these ingredients and their specified quantities: ${ingredientString}.
    
    User Cooking DNA Profile:
    - Spice Tolerance: ${userDNA.spiceTolerance}/5
    - Oil Usage: ${userDNA.oilUsage}/5
    - Salt Tolerance: ${userDNA.saltTolerance}/5
    - Cooking Speed: ${userDNA.cookingSpeed}
    - Health Conditions: ${userDNA.healthConditions.join(", ")}
    - Custom Health Notes: ${userDNA.customHealthNotes || "None provided"}
    - Allergy Restrictions: ${userDNA.allergies.join(", ")}
    - Custom Allergy Notes: ${userDNA.customAllergyNotes || "None provided"}
    - Maximum Budget: ₹${userDNA.budget}
    - Optimization: ${userDNA.onePotEnabled ? "One-Pot (Single Vessel)" : "Standard cooking"}
    - Past Mistakes/Feedback: ${JSON.stringify(userDNA.history)}
    - Cuisine Preference: ${isNonVeg ? "Non-Vegetarian Tamil" : "Vegetarian Tamil"}
    - Mode: ${mode}

    STRICT OPERATIONAL CONSTRAINTS:
    1. TAMIL NADU ONLY: Every dish must be a recognized Tamil Nadu recipe.
    2. INGREDIENT & QUANTITY ENFORCEMENT: Use ONLY provided ingredients. Adapt the recipe scale to match these quantities exactly.
    3. BUDGET AWARENESS: Calculate cost in INR based on local Chennai/TN market rates.
    4. MISTAKE-AWARE LEARNING: Adjust instructions based on history (e.g., lower heat if 'burnt' occurred).
    5. CUSTOM NOTES PRIORITY: If custom health or allergy notes are provided, they override standard settings.
    6. EXPLAINABLE AI: Explain how the recipe utilizes the SPECIFIC amounts provided while fitting health/budget needs.
    7. MULTILINGUAL OUTPUT: Provide the recipe name and ALL cooking steps in both English and Tamil.

    Output Language: English and Tamil for name and method.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
};
