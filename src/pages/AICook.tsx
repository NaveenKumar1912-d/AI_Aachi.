import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChefHat, Image as ImageIcon, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import IngredientSelector from "@/components/IngredientSelector";
import ChatInterface from "@/components/ChatInterface";
import { getRecipeImage } from "@/utils/recipeImageMapper";

const AICook = () => {
  const navigate = useNavigate();
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [initialPrompt, setInitialPrompt] = useState<string>("");
  const [currentRecipeName, setCurrentRecipeName] = useState<string>("");
  const [currentRecipeImage, setCurrentRecipeImage] = useState<string>("");
  const [quickIngredientInput, setQuickIngredientInput] = useState<string>("");

  const handleIngredientsConfirm = (ingredients: string[]) => {
    setSelectedIngredients(ingredients);
    const prompt = `I have these ingredients: ${ingredients.join(", ")}. What Tamil recipes can I make?`;
    setInitialPrompt(prompt);
  };

  const handleRecipeGenerated = (recipeName: string, image?: string) => {
    setCurrentRecipeName(recipeName);
    if (image) {
      setCurrentRecipeImage(image);
    } else {
      // Try to get image from recipe name mapping
      const mappedImage = getRecipeImage(recipeName);
      if (mappedImage) {
        setCurrentRecipeImage(mappedImage);
      }
    }
  };

  const handleQuickIngredientSubmit = () => {
    if (quickIngredientInput.trim()) {
      const prompt = `I have ${quickIngredientInput.trim()}. What Tamil recipes can I make with this?`;
      setInitialPrompt(prompt);
      setQuickIngredientInput("");
    }
  };

  const handleQuickIngredientKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleQuickIngredientSubmit();
    }
  };

  // Update image when recipe name changes
  useEffect(() => {
    if (currentRecipeName && !currentRecipeImage) {
      const mappedImage = getRecipeImage(currentRecipeName);
      if (mappedImage) {
        setCurrentRecipeImage(mappedImage);
      }
    }
  }, [currentRecipeName, currentRecipeImage]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Aachi Kitchen
            </h1>
            <p className="text-xs text-muted-foreground">
              Vanakkam! Ungalukku enna samayal venum?
            </p>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Ingredient Selection Panel */}
          <div className="lg:sticky lg:top-24 h-fit space-y-4">
            <IngredientSelector
              selectedIngredients={selectedIngredients}
              onIngredientsChange={setSelectedIngredients}
              onConfirm={handleIngredientsConfirm}
            />
            
            {/* Quick Ingredient Input */}
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ChefHat className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium">Quick Ingredient Search</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Type an ingredient below to quickly get recipe suggestions
                  </p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., Rice, Chicken, Tomato..."
                      value={quickIngredientInput}
                      onChange={(e) => setQuickIngredientInput(e.target.value)}
                      onKeyPress={handleQuickIngredientKeyPress}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleQuickIngredientSubmit}
                      disabled={!quickIngredientInput.trim()}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface Panel */}
          <div className="space-y-6">
            <ChatInterface
              selectedIngredients={selectedIngredients}
              initialPrompt={initialPrompt}
              onRecipeGenerated={handleRecipeGenerated}
            />

            {/* Recipe Image Display Section */}
            {currentRecipeName && (
              <Card className="border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ChefHat className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {currentRecipeName}
                    </h2>
                  </div>
                  
                  {currentRecipeImage ? (
                    <div className="relative w-full rounded-lg overflow-hidden border-2 border-primary/20">
                      <img
                        src={currentRecipeImage}
                        alt={currentRecipeName}
                        className="w-full h-auto max-h-96 object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-primary/20">
                      <div className="text-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Recipe image will appear here
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Scroll up to see step-by-step cooking instructions in the chat
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICook;
