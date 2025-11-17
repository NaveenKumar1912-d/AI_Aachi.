import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2, Sparkles, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import ChatMessage from "@/components/ChatMessage";

const QUICK_SUGGESTIONS = [
  "What can I make for breakfast?",
  "Show me a quick lunch recipe",
  "I want to make something spicy",
  "Suggest a sweet dish",
  "What's a good vegetarian recipe?",
  "Give me a traditional Chettinad recipe",
  "Show me step-by-step Dosa recipe",
  "How to make Sambar?",
  "Idli recipe with instructions",
  "Traditional Pongal recipe",
];

interface Message {
  role: "user" | "assistant";
  content: string;
  image?: string;
  recipeName?: string;
}

interface ChatInterfaceProps {
  selectedIngredients: string[];
  initialPrompt?: string;
  onRecipeGenerated?: (recipeName: string, image?: string) => void;
}

const ChatInterface = ({ selectedIngredients, initialPrompt, onRecipeGenerated }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Vanakkam! 🙏 I'm your AI Aachi (AI Grandma). Tell me what ingredients you have or what kind of Tamil dish you're craving, and I'll guide you through the perfect recipe! நீங்கள் என்ன சமைக்க விரும்புகிறீர்கள்?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentRecipeImage, setCurrentRecipeImage] = useState<string>("");
  const [currentRecipeName, setCurrentRecipeName] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialPromptSentRef = useRef<string>("");
  const { toast } = useToast();

  // Check server connectivity on mount
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch("/api/health", { 
          method: "GET",
          signal: AbortSignal.timeout(3000) // 3 second timeout
        });
        if (!response.ok) {
          console.warn("Server health check failed:", response.status);
        }
      } catch (error) {
        console.warn("Server may not be running. Make sure to start the backend server with 'npm run dev' or 'python app/main.py'");
      }
    };
    checkServer();
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle initial prompt from ingredient selection
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() && initialPrompt !== initialPromptSentRef.current) {
      // Check if we're already loading to avoid duplicate requests
      if (isLoading) {
        return;
      }
      initialPromptSentRef.current = initialPrompt;
      // Directly call handleSend with the prompt
      const userMessage = initialPrompt.trim();
      if (userMessage) {
        // Use setTimeout to ensure state is ready
        setTimeout(() => {
          handleSend(userMessage);
        }, 100);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  const handleSend = async (messageText?: string) => {
    const userMessage = messageText || input.trim();
    if (!userMessage || isLoading) return;

    const newUserMessage: Message = { role: "user", content: userMessage };
    
    // Update messages state and get the updated array for the API call
    let updatedMessages: Message[] = [];
    setMessages((prev) => {
      updatedMessages = [...prev, newUserMessage];
      return updatedMessages;
    });
    setInput("");
    setIsLoading(true);

    // Add empty assistant message placeholder for streaming
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", image: undefined, recipeName: undefined },
    ]);

    try {
      const response = await fetch(
        "/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: updatedMessages,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        console.error("API error response:", response.status, errorText);
        throw new Error(`Failed to get response from AI (${response.status}): ${errorText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available - response body is null");
      }

      let assistantMessage = "";
      let assistantImage = "";
      let hasStartedAssistantMessage = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]" || data.trim() === "") continue;
            
            try {
              const parsed = JSON.parse(data);
              
              // Handle done signal
              if (parsed.done) {
                break;
              }
              
              // Handle error
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              
              // Support both formats: { text: ... } and { choices: [{ delta: { content: ... } }] }
              const content = parsed.text || parsed.choices?.[0]?.delta?.content;
              const image = parsed.choices?.[0]?.delta?.image;

              if (image) {
                assistantImage = image;
                setCurrentRecipeImage(image);
                // Update existing message with image
                setMessages((prev) => {
                  const newMessages = [...prev];
                  if (newMessages[newMessages.length - 1]?.role === "assistant") {
                    newMessages[newMessages.length - 1].image = image;
                  }
                  return newMessages;
                });
                if (onRecipeGenerated && currentRecipeName) {
                  onRecipeGenerated(currentRecipeName, image);
                }
              }

              if (content && typeof content === 'string') {
                assistantMessage += content;

                // Extract recipe name from the response (first line or after recipe name marker)
                const lines = assistantMessage.split('\n');
                let extractedName = '';
                
                // Try to find recipe name in first few lines
                for (let i = 0; i < Math.min(5, lines.length); i++) {
                  const line = lines[i]?.trim();
                  if (!line) continue;
                  
                  // Skip if it's a section header
                  if (/^(Ingredients|Steps|Instructions|Method|Cooking Time|Serves|Tips):/i.test(line)) {
                    continue;
                  }
                  
                  // Check if it looks like a recipe name (short, no colons, not a step)
                  if (line.length > 0 && line.length < 80 && !line.includes(':') && !/^\d+\./.test(line)) {
                    const cleaned = line.replace(/^\[|\]$/g, '').trim();
                    if (cleaned && cleaned.length > 2 && cleaned.length < 60) {
                      extractedName = cleaned;
                      break;
                    }
                  }
                }
                
                if (extractedName && extractedName !== currentRecipeName) {
                  setCurrentRecipeName(extractedName);
                  if (onRecipeGenerated) {
                    onRecipeGenerated(extractedName, assistantImage);
                  }
                }

                // Update the existing assistant message (we already added a placeholder)
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage && lastMessage.role === "assistant") {
                    lastMessage.content = assistantMessage;
                    if (assistantImage) {
                      lastMessage.image = assistantImage;
                    }
                    if (currentRecipeName) {
                      lastMessage.recipeName = currentRecipeName;
                    }
                  } else {
                    // If for some reason the placeholder wasn't added, add the message now
                    newMessages.push({
                      role: "assistant",
                      content: assistantMessage,
                      image: assistantImage,
                      recipeName: currentRecipeName,
                    });
                  }
                  return newMessages;
                });
                hasStartedAssistantMessage = true;
              }
            } catch (e) {
              // Log parsing errors for debugging, but continue processing
              if (data && data.length > 0 && !data.includes('{')) {
                // Only log if it looks like it might be an error, not just incomplete JSON
                console.warn("Failed to parse chunk:", data.substring(0, 100));
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error calling recipe chat:", error);
      
      // Remove the empty assistant message if it was added
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === "assistant" && !lastMessage.content) {
          return prev.slice(0, -1);
        }
        return prev;
      });
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: errorMessage.includes("Failed to get response") 
          ? errorMessage 
          : `Failed to get recipe suggestion: ${errorMessage}. Please check if the server is running.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-[calc(100vh-12rem)] flex flex-col">
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Recipe Assistant
        </CardTitle>
        {selectedIngredients.length > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            Selected: {selectedIngredients.join(", ")}
          </p>
        )}
        
        {(messages.length === 1 || (messages.length > 1 && !isLoading)) && (
          <div className="mt-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Lightbulb className="h-3 w-3" />
              <span>Quick Suggestions:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_SUGGESTIONS.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSend(suggestion)}
                  className="text-xs h-7 hover:bg-primary hover:text-primary-foreground transition-colors"
                  disabled={isLoading}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">AI Aachi is cooking up a response...</span>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-background">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Tamil recipes..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
