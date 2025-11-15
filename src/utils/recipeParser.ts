export interface ParsedRecipe {
  id: string;
  name: string;
  region: string;
  category: string;
  ingredients: string[];
  steps: string[];
  image?: string;
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
