import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import IngredientSelector from "@/components/IngredientSelector";
import ChatInterface from "@/components/ChatInterface";

const AICook = () => {
  const navigate = useNavigate();
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [initialPrompt, setInitialPrompt] = useState<string>("");

  const handleIngredientsConfirm = (ingredients: string[]) => {
    setSelectedIngredients(ingredients);
    const prompt = `I have these ingredients: ${ingredients.join(", ")}. What Tamil recipes can I make?`;
    setInitialPrompt(prompt);
  };

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
          <div className="lg:sticky lg:top-24 h-fit">
            <IngredientSelector
              selectedIngredients={selectedIngredients}
              onIngredientsChange={setSelectedIngredients}
              onConfirm={handleIngredientsConfirm}
            />
          </div>

          {/* Chat Interface Panel */}
          <div>
            <ChatInterface
              selectedIngredients={selectedIngredients}
              initialPrompt={initialPrompt}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICook;
