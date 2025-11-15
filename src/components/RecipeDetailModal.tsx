import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Clock, Users, Flame, MapPin, ChefHat, Lightbulb } from "lucide-react";
import { Recipe } from "@/data/recipes";

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RecipeDetailModal = ({ recipe, open, onOpenChange }: RecipeDetailModalProps) => {
  if (!recipe) return null;

  const spiceColors = {
    mild: "bg-secondary/20 text-secondary",
    medium: "bg-primary/20 text-primary",
    spicy: "bg-accent/20 text-accent"
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="relative h-64 w-full overflow-hidden">
            <img 
              src={recipe.image} 
              alt={recipe.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold text-foreground">
                  {recipe.name}
                </DialogTitle>
                <p className="text-lg text-muted-foreground">{recipe.nameEnglish}</p>
              </DialogHeader>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <Badge className={spiceColors[recipe.spiceLevel]}>
                <Flame className="h-3 w-3 mr-1" />
                {recipe.spiceLevel}
              </Badge>
              <Badge variant={recipe.dietType === "veg" ? "secondary" : "destructive"}>
                {recipe.dietType === "veg" ? "Veg" : "Non-Veg"}
              </Badge>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span>{recipe.cookTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-primary" />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="capitalize">{recipe.region}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ChefHat className="h-4 w-4 text-primary" />
                <span className="capitalize">{recipe.category}</span>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">{recipe.description}</p>

            <Separator />

            {/* Nutrition Info */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Flame className="h-5 w-5 text-primary" />
                Nutrition Per Serving
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{recipe.calories}</p>
                  <p className="text-xs text-muted-foreground">Calories</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{recipe.protein}g</p>
                  <p className="text-xs text-muted-foreground">Protein</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{recipe.carbs}g</p>
                  <p className="text-xs text-muted-foreground">Carbs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{recipe.fat}g</p>
                  <p className="text-xs text-muted-foreground">Fat</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Ingredients */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li 
                    key={index} 
                    className="flex items-center gap-2 text-sm p-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Cooking Steps */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Cooking Instructions</h3>
              <div className="space-y-6">
                {recipe.steps.map((step, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col md:flex-row gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex gap-4 flex-1">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-relaxed pt-1">{step}</p>
                    </div>
                    {recipe.stepImages[index] && (
                      <div className="w-full md:w-48 h-36 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={recipe.stepImages[index]} 
                          alt={`Step ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Cooking Tips */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Aachi's Tips
              </h3>
              <div className="space-y-3">
                {recipe.tips.map((tip, index) => (
                  <div 
                    key={index} 
                    className="flex gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Lightbulb className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDetailModal;
