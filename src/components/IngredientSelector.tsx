import { useState } from "react";
import { Plus, X, ChefHat } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const commonIngredients = [
  "Rice", "Lentils", "Coconut", "Tamarind", "Curry Leaves",
  "Mustard Seeds", "Cumin", "Turmeric", "Coriander", "Chili",
  "Onion", "Tomato", "Garlic", "Ginger", "Oil",
  "Potato", "Carrot", "Beans", "Drumstick", "Brinjal",
  "Lady Finger", "Pumpkin", "Spinach", "Banana", "Yogurt"
];

interface IngredientSelectorProps {
  selectedIngredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
  onConfirm: (ingredients: string[]) => void;
}

const IngredientSelector = ({
  selectedIngredients,
  onIngredientsChange,
  onConfirm,
}: IngredientSelectorProps) => {
  const [customIngredient, setCustomIngredient] = useState("");

  const toggleIngredient = (ingredient: string) => {
    if (selectedIngredients.includes(ingredient)) {
      onIngredientsChange(selectedIngredients.filter((i) => i !== ingredient));
    } else {
      onIngredientsChange([...selectedIngredients, ingredient]);
    }
  };

  const addCustomIngredient = () => {
    if (customIngredient.trim() && !selectedIngredients.includes(customIngredient.trim())) {
      onIngredientsChange([...selectedIngredients, customIngredient.trim()]);
      setCustomIngredient("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addCustomIngredient();
    }
  };

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-primary" />
          Select Your Ingredients
        </CardTitle>
        <CardDescription>
          Pick what you have in your kitchen or add custom ingredients
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Ingredients Display */}
        {selectedIngredients.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Selected ({selectedIngredients.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedIngredients.map((ingredient) => (
                <Badge
                  key={ingredient}
                  variant="default"
                  className="px-3 py-1.5 cursor-pointer hover:bg-destructive transition-colors"
                  onClick={() => toggleIngredient(ingredient)}
                >
                  {ingredient}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Custom Ingredient Input */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Add Custom Ingredient
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Type ingredient name..."
              value={customIngredient}
              onChange={(e) => setCustomIngredient(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button
              size="icon"
              onClick={addCustomIngredient}
              disabled={!customIngredient.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Common Ingredients Grid */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Common Ingredients
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {commonIngredients.map((ingredient) => (
              <Button
                key={ingredient}
                variant={selectedIngredients.includes(ingredient) ? "default" : "outline"}
                className="h-auto py-3 text-sm"
                onClick={() => toggleIngredient(ingredient)}
              >
                {ingredient}
              </Button>
            ))}
          </div>
        </div>

        {/* Confirm Button */}
        <Button
          className="w-full"
          size="lg"
          onClick={() => onConfirm(selectedIngredients)}
          disabled={selectedIngredients.length === 0}
        >
          Get Recipe Suggestions ({selectedIngredients.length} ingredients)
        </Button>
      </CardContent>
    </Card>
  );
};

export default IngredientSelector;
