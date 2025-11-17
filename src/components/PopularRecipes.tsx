import { useState, useMemo } from "react";
import RecipeCard from "./RecipeCard";
import RecipeFilters from "./RecipeFilters";
import { allTamilNaduRecipes } from "@/data/tamilNaduRecipes";
import { getRecipeImage } from "@/utils/recipeImageMapper";
import type { DietType, MealType, SpiceLevel, Region } from "@/data/recipes";
import type { Recipe } from "@/data/recipes";

// Convert ParsedRecipe to Recipe format
function convertToRecipe(parsedRecipe: typeof allTamilNaduRecipes[0]): Recipe {
  const nameLower = parsedRecipe.name.toLowerCase();
  
  // Determine diet type
  const dietType: DietType = parsedRecipe.category === "Vegetarian" ? "veg" : "non-veg";
  
  // Determine meal type based on recipe name
  let mealType: MealType = "lunch";
  if (nameLower.includes("dosa") || nameLower.includes("idli") || nameLower.includes("pongal") || 
      nameLower.includes("upma") || nameLower.includes("poha") || nameLower.includes("appam") ||
      nameLower.includes("puttu") || nameLower.includes("uttapam") || nameLower.includes("adai")) {
    mealType = "breakfast";
  } else if (nameLower.includes("vada") || nameLower.includes("bonda") || nameLower.includes("bajji") ||
             nameLower.includes("pakoda") || nameLower.includes("murukku") || nameLower.includes("mixture") ||
             nameLower.includes("kothu") || nameLower.includes("parotta") || nameLower.includes("samosa") ||
             nameLower.includes("kachori") || nameLower.includes("bhel") || nameLower.includes("chips") ||
             nameLower.includes("chivda") || nameLower.includes("sev") || nameLower.includes("thenkuzhal") ||
             nameLower.includes("appalam") || nameLower.includes("vadam") || nameLower.includes("vathal") ||
             nameLower.includes("paniyaram") || nameLower.includes("sevpuri") || nameLower.includes("panipuri")) {
    mealType = "snacks";
  } else if (nameLower.includes("payasam") || nameLower.includes("kheer") || nameLower.includes("halwa") ||
             nameLower.includes("laddu") || nameLower.includes("jamun") || nameLower.includes("barfi") ||
             nameLower.includes("mysore pak") || nameLower.includes("badusha") || nameLower.includes("jangiri") ||
             nameLower.includes("adhirasam") || nameLower.includes("kesari")) {
    mealType = "sweets";
  } else if (nameLower.includes("coffee") || nameLower.includes("tea") || nameLower.includes("buttermilk") ||
             nameLower.includes("neer mor") || nameLower.includes("lassi") || nameLower.includes("juice") ||
             nameLower.includes("shake") || nameLower.includes("milk") && !nameLower.includes("payasam") ||
             nameLower.includes("panagam") || nameLower.includes("jaggery water") || nameLower.includes("coconut water") ||
             nameLower.includes("nimbu pani") || nameLower.includes("jal jeera") || nameLower.includes("thandai") ||
             nameLower.includes("sugarcane") || nameLower.includes("karupatti")) {
    mealType = "drinks";
  }
  
  // Determine spice level
  let spiceLevel: SpiceLevel = "medium";
  if (nameLower.includes("chettinad") || nameLower.includes("madurai") || nameLower.includes("pepper") ||
      nameLower.includes("chilli") || nameLower.includes("kara")) {
    spiceLevel = "spicy";
  } else if (nameLower.includes("sweet") || nameLower.includes("payasam") || nameLower.includes("kheer") ||
             nameLower.includes("halwa") || nameLower.includes("pongal") && nameLower.includes("sweet")) {
    spiceLevel = "mild";
  }
  
  // Map region
  const regionMap: Record<string, Region> = {
    "chettinad": "chettinad",
    "madurai": "madurai",
    "kongu nadu": "kongu",
    "tanjore": "tanjore",
  };
  
  let region: Region = "general";
  const recipeRegion = parsedRecipe.region.toLowerCase();
  for (const [key, value] of Object.entries(regionMap)) {
    if (recipeRegion.includes(key)) {
      region = value;
      break;
    }
  }
  
  // Generate description
  const description = `Authentic ${parsedRecipe.region} style ${parsedRecipe.name.toLowerCase()} - ${parsedRecipe.category}`;
  
  // Estimate cook time and servings
  const cookTime = parsedRecipe.cookTime || (parsedRecipe.steps.length * 5 + 10) + " mins";
  const servings = parsedRecipe.servings ? parseInt(parsedRecipe.servings) : 4;
  
  // Estimate calories (rough calculation)
  const baseCalories = dietType === "veg" ? 200 : 350;
  const calories = baseCalories + (parsedRecipe.ingredients.length * 10);
  
  // Get image
  const image = parsedRecipe.image || getRecipeImage(parsedRecipe.name, parsedRecipe.id) || "";
  
  return {
    id: parsedRecipe.id,
    name: parsedRecipe.name,
    nameEnglish: parsedRecipe.name, // Use same name for now
    category: mealType,
    dietType,
    spiceLevel,
    region,
    image,
    cookTime,
    servings,
    calories,
    protein: dietType === "veg" ? 5 : 25,
    carbs: 30,
    fat: dietType === "veg" ? 8 : 15,
    description,
    ingredients: parsedRecipe.ingredients,
    steps: parsedRecipe.steps,
    stepImages: [], // Will be populated dynamically if needed
    tips: parsedRecipe.tips || [],
  };
}

const PopularRecipes = () => {
  const [selectedDiet, setSelectedDiet] = useState<DietType | "all">("all");
  const [selectedMeal, setSelectedMeal] = useState<MealType | "all">("all");
  const [selectedRegion, setSelectedRegion] = useState<Region | "all">("all");
  const [spiceLevel, setSpiceLevel] = useState(1); // 0: mild, 1: medium, 2: spicy

  const spiceLevelMap: SpiceLevel[] = ["mild", "medium", "spicy"];

  // Convert Tamil Nadu recipes to Recipe format - show all available recipes (50+)
  const convertedRecipes = useMemo(() => {
    return allTamilNaduRecipes.map(convertToRecipe);
  }, []);

  const filteredRecipes = convertedRecipes.filter((recipe) => {
    const dietMatch = selectedDiet === "all" || recipe.dietType === selectedDiet;
    const mealMatch = selectedMeal === "all" || recipe.category === selectedMeal;
    const regionMatch = selectedRegion === "all" || recipe.region === selectedRegion;
    const spiceMatch = recipe.spiceLevel === spiceLevelMap[spiceLevel];
    
    return dietMatch && mealMatch && regionMatch && spiceMatch;
  });

  return (
    <section id="popular-recipes" className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Tamil Samayal Collection
          </h2>
          <p className="text-xl text-muted-foreground">
            Ungalukku piditha samayal thedungal! 
            <br />
            <span className="text-sm">(Find the recipes you love!)</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-1">
            <RecipeFilters
              selectedDiet={selectedDiet}
              selectedMeal={selectedMeal}
              selectedRegion={selectedRegion}
              spiceLevel={spiceLevel}
              onDietChange={setSelectedDiet}
              onMealChange={setSelectedMeal}
              onRegionChange={setSelectedRegion}
              onSpiceLevelChange={setSpiceLevel}
            />
          </div>

          <div className="lg:col-span-3">
            {filteredRecipes.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-2xl font-semibold mb-2">Ippo recipes illai!</p>
                <p className="text-muted-foreground">
                  No recipes match your filters. Try adjusting your selections!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularRecipes;
