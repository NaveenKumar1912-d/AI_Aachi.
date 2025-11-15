import { User, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseRecipeFromAIResponse } from "@/utils/recipeParser";
import RecipeStepDisplay from "./RecipeStepDisplay";

interface Message {
  role: "user" | "assistant";
  content: string;
  image?: string;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";
  
  // Try to parse recipe from assistant messages
  const parsedRecipe = !isUser ? parseRecipeFromAIResponse(message.content) : null;

  return (
    <div
      className={cn(
        "flex gap-3 animate-in fade-in-50 slide-in-from-bottom-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <ChefHat className="h-4 w-4 text-primary" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 break-words",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-muted text-foreground rounded-tl-sm"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        
        {parsedRecipe && parsedRecipe.steps.length > 0 && (
          <RecipeStepDisplay
            recipeName={parsedRecipe.name}
            steps={parsedRecipe.steps}
            image={message.image}
          />
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
          <User className="h-4 w-4 text-accent" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
