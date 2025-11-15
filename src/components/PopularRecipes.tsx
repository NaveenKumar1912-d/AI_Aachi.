import { useState } from "react";
import RecipeCard from "./RecipeCard";
import RecipeFilters from "./RecipeFilters";
import { recipes } from "@/data/recipes";
import type { DietType, MealType, SpiceLevel, Region } from "@/data/recipes";

const PopularRecipes = () => {
  const [selectedDiet, setSelectedDiet] = useState<DietType | "all">("all");
  const [selectedMeal, setSelectedMeal] = useState<MealType | "all">("all");
  const [selectedRegion, setSelectedRegion] = useState<Region | "all">("all");
  const [spiceLevel, setSpiceLevel] = useState(1); // 0: mild, 1: medium, 2: spicy

  const spiceLevelMap: SpiceLevel[] = ["mild", "medium", "spicy"];

  const filteredRecipes = recipes.filter((recipe) => {
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
