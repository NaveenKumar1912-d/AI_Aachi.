import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, ChefHat } from "lucide-react";
import { ParsedRecipe } from "@/utils/recipeParser";

// Sample of recipes from the uploaded collection
// In a real implementation, you would load all 500 from a JSON file or API
const sampleRecipes: ParsedRecipe[] = [
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

const AllRecipes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRecipe, setSelectedRecipe] = useState<ParsedRecipe | null>(null);

  const regions = ["all", ...new Set(sampleRecipes.map(r => r.region))];
  const categories = ["all", ...new Set(sampleRecipes.map(r => r.category))];

  const filteredRecipes = sampleRecipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRegion = selectedRegion === "all" || recipe.region === selectedRegion;
    const matchesCategory = selectedCategory === "all" || recipe.category === selectedCategory;
    
    return matchesSearch && matchesRegion && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <ChefHat className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold">Tamil Nadu Recipe Collection</h1>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recipes or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground self-center">Region:</span>
              {regions.map(region => (
                <Button
                  key={region}
                  variant={selectedRegion === region ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRegion(region)}
                >
                  {region}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground self-center">Category:</span>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.map((recipe) => (
            <Card 
              key={recipe.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <CardContent className="p-4">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-md mb-3 flex items-center justify-center">
                  <ChefHat className="h-12 w-12 text-primary/40" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{recipe.name}</h3>
                <div className="flex gap-2 mb-2">
                  <Badge variant="secondary">{recipe.region}</Badge>
                  <Badge variant={recipe.category === "Vegetarian" ? "default" : "destructive"}>
                    {recipe.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {recipe.ingredients.length} ingredients • {recipe.steps.length} steps
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No recipes found. Try adjusting your filters.</p>
          </div>
        )}

        {/* Recipe Detail Modal */}
        {selectedRecipe && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedRecipe(null)}
          >
            <Card 
              className="max-w-2xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <ScrollArea className="h-full max-h-[90vh]">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-2xl font-bold">{selectedRecipe.name}</h2>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedRecipe(null)}>
                        ✕
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{selectedRecipe.region}</Badge>
                      <Badge variant={selectedRecipe.category === "Vegetarian" ? "default" : "destructive"}>
                        {selectedRecipe.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Ingredients:</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedRecipe.ingredients.map((ingredient, idx) => (
                          <li key={idx} className="text-sm">{ingredient}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Steps:</h3>
                      <ol className="list-decimal list-inside space-y-2">
                        {selectedRecipe.steps.map((step, idx) => (
                          <li key={idx} className="text-sm">{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRecipes;
