import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Flame, MapPin } from "lucide-react";
import { Recipe } from "@/data/recipes";
import RecipeDetailModal from "./RecipeDetailModal";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  
  const spiceColors = {
    mild: "bg-secondary/20 text-secondary",
    medium: "bg-primary/20 text-primary",
    spicy: "bg-accent/20 text-accent"
  };

  return (
    <>
      <Card 
        className="overflow-hidden hover:shadow-xl transition-all duration-300 group hover:scale-105 animate-fade-in cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        <div className="relative h-56 overflow-hidden">
          <img 
            src={recipe.image} 
            alt={recipe.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Badge className={spiceColors[recipe.spiceLevel]}>
              <Flame className="h-3 w-3 mr-1" />
              {recipe.spiceLevel}
            </Badge>
          </div>
          <div className="absolute top-2 left-2">
            <Badge variant={recipe.dietType === "veg" ? "secondary" : "destructive"}>
              {recipe.dietType === "veg" ? "Veg" : "Non-Veg"}
            </Badge>
          </div>
        </div>
        <CardContent className="p-5">
          <h3 className="font-bold text-xl mb-1">{recipe.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">{recipe.nameEnglish}</p>
          <p className="text-sm mb-4 line-clamp-2">{recipe.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{recipe.cookTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{recipe.servings}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="capitalize">{recipe.region}</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              {recipe.calories} calories per serving
            </p>
          </div>
        </CardContent>
      </Card>
      
      <RecipeDetailModal 
        recipe={recipe}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
};

export default RecipeCard;
