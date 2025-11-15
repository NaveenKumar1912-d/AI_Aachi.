import { useState, useEffect } from "react";
import { ChefHat, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RecipeStep {
  step: number;
  instruction: string;
  completed: boolean;
}

interface RecipeStepDisplayProps {
  steps: string[];
  recipeName: string;
  image?: string;
}

const RecipeStepDisplay = ({ steps, recipeName, image }: RecipeStepDisplayProps) => {
  const [recipeSteps, setRecipeSteps] = useState<RecipeStep[]>(
    steps.map((instruction, index) => ({
      step: index + 1,
      instruction,
      completed: false,
    }))
  );
  const [currentStep, setCurrentStep] = useState(0);

  // Update steps when props change (handles streaming updates)
  useEffect(() => {
    setRecipeSteps((prevSteps) => {
      // Check if steps have changed (length or content)
      const hasChanged = 
        steps.length !== prevSteps.length ||
        steps.some((instruction, idx) => instruction !== prevSteps[idx]?.instruction);
      
      if (hasChanged) {
        const newSteps = steps.map((instruction, index) => ({
          step: index + 1,
          instruction,
          completed: prevSteps[index]?.completed || false,
        }));
        
        // Advance currentStep to the first incomplete step when steps are added
        if (steps.length > prevSteps.length) {
          const firstIncompleteIndex = newSteps.findIndex(s => !s.completed);
          if (firstIncompleteIndex !== -1) {
            setCurrentStep(firstIncompleteIndex);
          }
        }
        
        return newSteps;
      }
      return prevSteps;
    });
  }, [steps]);

  const toggleStepCompletion = (stepIndex: number) => {
    setRecipeSteps((prev) =>
      prev.map((step, idx) =>
        idx === stepIndex ? { ...step, completed: !step.completed } : step
      )
    );
    if (stepIndex === currentStep && stepIndex < steps.length - 1) {
      setCurrentStep(stepIndex + 1);
    }
  };

  const completedCount = recipeSteps.filter((s) => s.completed).length;

  return (
    <Card className="mt-4 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <ChefHat className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">{recipeName}</h3>
        </div>

        {image && (
          <img
            src={image}
            alt={recipeName}
            className="w-full rounded-lg mb-4 max-h-64 object-cover"
          />
        )}

        <div className="mb-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>
              {completedCount} of {steps.length} steps
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {recipeSteps.map((step, index) => (
            <div
              key={index}
              className={cn(
                "flex gap-3 p-3 rounded-lg border transition-all",
                step.completed
                  ? "bg-primary/5 border-primary/30"
                  : index === currentStep
                  ? "bg-accent/5 border-accent/50"
                  : "bg-background border-border"
              )}
            >
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 h-6 w-6 rounded-full p-0"
                onClick={() => toggleStepCompletion(index)}
              >
                {step.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    Step {step.step}
                  </span>
                  {index === currentStep && !step.completed && (
                    <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <p
                  className={cn(
                    "text-sm",
                    step.completed && "line-through text-muted-foreground"
                  )}
                >
                  {step.instruction}
                </p>
              </div>
            </div>
          ))}
        </div>

        {completedCount === steps.length && (
          <div className="mt-4 p-4 bg-primary/10 rounded-lg text-center">
            <p className="text-sm font-medium text-primary">
              🎉 Recipe Complete! Enjoy your {recipeName}!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecipeStepDisplay;
