import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Leaf, Drumstick, Clock, MapPin, Flame } from "lucide-react";
import { DietType, MealType, SpiceLevel, Region, regions } from "@/data/recipes";

interface RecipeFiltersProps {
  selectedDiet: DietType | "all";
  selectedMeal: MealType | "all";
  selectedRegion: Region | "all";
  spiceLevel: number;
  onDietChange: (diet: DietType | "all") => void;
  onMealChange: (meal: MealType | "all") => void;
  onRegionChange: (region: Region | "all") => void;
  onSpiceLevelChange: (level: number) => void;
}

const RecipeFilters = ({
  selectedDiet,
  selectedMeal,
  selectedRegion,
  spiceLevel,
  onDietChange,
  onMealChange,
  onRegionChange,
  onSpiceLevelChange,
}: RecipeFiltersProps) => {
  const spiceLevelText = ["Mild", "Medium", "Spicy"][spiceLevel];

  return (
    <div className="space-y-6 p-6 bg-card rounded-xl border shadow-[var(--shadow-card)]">
      {/* Diet Type */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-secondary" />
          <h3 className="font-semibold">Diet Type (Samayal Vaghai)</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedDiet === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => onDietChange("all")}
            className="transition-all hover:scale-105"
          >
            All
          </Button>
          <Button
            variant={selectedDiet === "veg" ? "default" : "outline"}
            size="sm"
            onClick={() => onDietChange("veg")}
            className="transition-all hover:scale-105"
          >
            <Leaf className="h-4 w-4 mr-1" />
            Vegetarian
          </Button>
          <Button
            variant={selectedDiet === "non-veg" ? "default" : "outline"}
            size="sm"
            onClick={() => onDietChange("non-veg")}
            className="transition-all hover:scale-105"
          >
            <Drumstick className="h-4 w-4 mr-1" />
            Non-Veg
          </Button>
        </div>
      </div>

      {/* Meal Type */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-accent" />
          <h3 className="font-semibold">Meal Time (Nerathukku Enna?)</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All" },
            { id: "breakfast", label: "Breakfast" },
            { id: "lunch", label: "Lunch" },
            { id: "snacks", label: "Snacks" },
            { id: "sweets", label: "Sweets" },
            { id: "drinks", label: "Drinks" },
          ].map((meal) => (
            <Button
              key={meal.id}
              variant={selectedMeal === meal.id ? "default" : "outline"}
              size="sm"
              onClick={() => onMealChange(meal.id as MealType | "all")}
              className="transition-all hover:scale-105"
            >
              {meal.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Spice Level */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-accent" />
            <h3 className="font-semibold">Spice Level (Kaaram Eppadi?)</h3>
          </div>
          <Badge variant="secondary" className="text-sm">
            {spiceLevelText}
          </Badge>
        </div>
        <Slider
          value={[spiceLevel]}
          onValueChange={(value) => onSpiceLevelChange(value[0])}
          max={2}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Mild</span>
          <span>Medium</span>
          <span>Spicy</span>
        </div>
      </div>

      {/* Region */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Region (Edathula Special?)</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {regions.map((region) => (
            <Button
              key={region.id}
              variant={selectedRegion === region.id ? "default" : "outline"}
              size="sm"
              onClick={() => onRegionChange(region.id as Region | "all")}
              className="transition-all hover:scale-105"
            >
              {region.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeFilters;
