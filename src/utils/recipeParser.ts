export interface ParsedRecipe {
  id: string;
  name: string;
  region: string;
  category: string;
  ingredients: string[];
  steps: string[];
  image?: string;
  cookTime?: string;
  servings?: string;
  tips?: string[];
}

/**
 * Parse recipe text content from the uploaded recipe files
 */
export function parseRecipeText(content: string, recipeName: string): ParsedRecipe {
  const lines = content.split('\n').map(line => line.trim()).filter(Boolean);
  
  const recipe: ParsedRecipe = {
    id: recipeName.toLowerCase().replace(/\s+/g, '-'),
    name: '',
    region: '',
    category: '',
    ingredients: [],
    steps: []
  };
  
  let currentSection = '';
  
  lines.forEach(line => {
    if (line.startsWith('Recipe Name:')) {
      recipe.name = line.replace('Recipe Name:', '').trim();
    } else if (line.startsWith('Region Style:')) {
      recipe.region = line.replace('Region Style:', '').trim();
    } else if (line.startsWith('Category:')) {
      recipe.category = line.replace('Category:', '').trim();
    } else if (line === 'Ingredients:') {
      currentSection = 'ingredients';
    } else if (line === 'Steps:') {
      currentSection = 'steps';
    } else if (line.startsWith('-') && currentSection === 'ingredients') {
      recipe.ingredients.push(line.replace('-', '').trim());
    } else if (line.match(/^\d+\./) && currentSection === 'steps') {
      recipe.steps.push(line.replace(/^\d+\.\s*/, '').trim());
    }
  });
  
  return recipe;
}

/**
 * Sample recipes extracted from the Tamil Nadu recipe collection
 * These represent different regions and categories
 */
export const tamilNaduRecipes: ParsedRecipe[] = [
  {
    id: "kongu-nadu-sambar",
    name: "Sambar",
    region: "Kongu Nadu",
    category: "Vegetarian",
    ingredients: [
      "Traditional Kongu Nadu spices and ingredients",
      "Turmeric, chilli, coriander, curry leaves",
      "Dal, vegetables"
    ],
    steps: [
      "Prepare fresh ingredients",
      "Start with regional-style tempering",
      "Add main ingredient and spices",
      "Cook until aroma develops",
      "Add water or coconut milk as needed",
      "Simmer and garnish with coriander"
    ]
  },
  {
    id: "chola-nadu-fish-kuzhambu",
    name: "Fish Kuzhambu",
    region: "Chola Nadu",
    category: "Non-Vegetarian",
    ingredients: [
      "Traditional Chola Nadu spices and ingredients",
      "Turmeric, chilli, coriander, curry leaves",
      "Fresh fish, tamarind"
    ],
    steps: [
      "Prepare fresh ingredients",
      "Start with regional-style tempering",
      "Add main ingredient and spices",
      "Cook until aroma develops",
      "Add water or coconut milk as needed",
      "Simmer and garnish with coriander"
    ]
  }
];

/**
 * Parse recipe from AI chat response text
 */
export function parseRecipeFromAIResponse(text: string): ParsedRecipe | null {
  try {
    const lines = text.split('\n').filter(line => line.trim());
    
    // Extract recipe name (usually first line or after a heading)
    let name = lines[0]?.trim() || 'Recipe';
    
    // Remove common prefixes
    name = name.replace(/^(Recipe:|Recipe Name:|\[|\])/gi, '').trim();
    
    // Extract ingredients
    const ingredientsStart = lines.findIndex(line => 
      /^Ingredients:/i.test(line.trim())
    );
    const stepsStart = lines.findIndex(line => 
      /^(Steps:|Instructions:|Step-by-step|Method:)/i.test(line.trim())
    );
    
    const ingredients: string[] = [];
    if (ingredientsStart !== -1 && stepsStart !== -1) {
      for (let i = ingredientsStart + 1; i < stepsStart; i++) {
        const ingredient = lines[i]?.trim().replace(/^[-•*]\s*/, '');
        if (ingredient && !ingredient.match(/^(Steps|Instructions|Method):/i)) {
          ingredients.push(ingredient);
        }
      }
    }
    
    // Extract steps
    const steps: string[] = [];
    if (stepsStart !== -1) {
      for (let i = stepsStart + 1; i < lines.length; i++) {
        const line = lines[i]?.trim();
        if (!line) continue;
        
        // Stop if we hit other sections
        if (/^(Cooking Time:|Serves:|Tips:|Notes:)/i.test(line)) break;
        
        // Remove step numbering and bullet points
        const step = line.replace(/^(\d+\.|[-•*])\s*/, '').trim();
        if (step && step.length > 5) {
          steps.push(step);
        }
      }
    }
    
    // Extract metadata
    const cookTimeMatch = text.match(/Cooking Time:\s*(.+?)(?:\n|$)/i);
    const servingsMatch = text.match(/Serves?:\s*(.+?)(?:\n|$)/i);
    
    // Extract tips
    const tipsStart = lines.findIndex(line => /^Tips:/i.test(line.trim()));
    const tips: string[] = [];
    if (tipsStart !== -1) {
      for (let i = tipsStart + 1; i < lines.length; i++) {
        const tip = lines[i]?.trim().replace(/^[-•*]\s*/, '');
        if (tip && tip.length > 5) tips.push(tip);
      }
    }
    
    if (steps.length === 0) {
      return null;
    }
    
    return {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      region: '',
      category: '',
      ingredients,
      steps,
      cookTime: cookTimeMatch?.[1]?.trim(),
      servings: servingsMatch?.[1]?.trim(),
      tips: tips.length > 0 ? tips : undefined,
    };
  } catch (error) {
    console.error('Error parsing recipe:', error);
    return null;
  }
}
