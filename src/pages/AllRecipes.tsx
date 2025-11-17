import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, ChefHat } from "lucide-react";
import { ParsedRecipe } from "@/utils/recipeParser";
import { allTamilNaduRecipes } from "@/data/tamilNaduRecipes";
import { getRecipeImage, getRecipeImageFromGemini } from "@/utils/recipeImageMapper";

// All 500 Tamil Nadu recipes from the collection
// Add error handling to prevent crashes
const sampleRecipes: ParsedRecipe[] = Array.isArray(allTamilNaduRecipes) && allTamilNaduRecipes.length > 0 
  ? allTamilNaduRecipes 
  : [];

const AllRecipes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRecipe, setSelectedRecipe] = useState<ParsedRecipe | null>(null);
  const [geminiImages, setGeminiImages] = useState<Map<string, string>>(new Map());

  const regions = ["all", ...new Set(sampleRecipes.map(r => r.region))];
  const categories = ["all", ...new Set(sampleRecipes.map(r => r.category))];

  const filteredRecipes = sampleRecipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRegion = selectedRegion === "all" || recipe.region === selectedRegion;
    const matchesCategory = selectedCategory === "all" || recipe.category === selectedCategory;
    
    return matchesSearch && matchesRegion && matchesCategory;
  });

  // Load Gemini images for visible recipes (non-blocking)
  useEffect(() => {
    // Only load Gemini images if server is available
    // This is optional and won't block page rendering
    const loadGeminiImages = async () => {
      try {
        const imageMap = new Map<string, string>();
        
        // Load images for filtered recipes (limit to first 20 to avoid too many API calls)
        const recipesToLoad = filteredRecipes.slice(0, 20);
        
        for (const recipe of recipesToLoad) {
          // Skip if already has image
          if (recipe.image) continue;
          
          // Check if we already have this image in cache
          if (geminiImages.has(recipe.id)) continue;
          
          try {
            const geminiImage = await getRecipeImageFromGemini(
              recipe.name,
              recipe.id,
              recipe.region,
              recipe.category
            );
            if (geminiImage) {
              imageMap.set(recipe.id, geminiImage);
            }
          } catch (error) {
            // Silently fail - we'll use fallback images
            // console.error(`Error loading image for ${recipe.name}:`, error);
          }
        }
        
        if (imageMap.size > 0) {
          setGeminiImages(prev => new Map([...prev, ...imageMap]));
        }
      } catch (error) {
        // Silently fail - page will still work with fallback images
        // console.error('Error loading Gemini images:', error);
      }
    };
    
    // Delay loading to not block initial render
    const timeoutId = setTimeout(() => {
      loadGeminiImages();
    }, 1000);
    
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredRecipes.length, searchQuery, selectedRegion, selectedCategory]);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex items-center gap-3">
            <ChefHat className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">Tamil Nadu Recipe Collection</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {sampleRecipes.length} Authentic Recipes from Tamil Nadu
          </p>
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

        {/* Recipe Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredRecipes.length} of {sampleRecipes.length} recipes
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.map((recipe) => {
            // Try Gemini image first, then fallback to local
            const geminiImage = geminiImages.get(recipe.id);
            const recipeImage = recipe.image || geminiImage || getRecipeImage(recipe.name, recipe.id);
            return (
            <Card 
              key={recipe.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <CardContent className="p-4">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-md mb-3 overflow-hidden relative">
                  {recipeImage ? (
                    <img 
                      src={recipeImage} 
                      alt={recipe.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ChefHat className="h-12 w-12 text-primary/40" />
                    </div>
                  )}
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
            );
          })}
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
                <CardContent className="p-0">
                  {(selectedRecipe.image || getRecipeImage(selectedRecipe.name, selectedRecipe.id)) && (
                    <div className="relative h-64 w-full overflow-hidden">
                      <img 
                        src={selectedRecipe.image || getRecipeImage(selectedRecipe.name, selectedRecipe.id) || ''} 
                        alt={selectedRecipe.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                    </div>
                  )}
                  <div className="p-6">
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
