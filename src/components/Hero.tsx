import { Button } from "@/components/ui/button";
import { Sparkles, ChefHat } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-tamil-food.jpg";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/70"></div>
      </div>
      
      <div className="container relative z-10 py-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Recipe Recommendations</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Tamil Smart Samayal
          </h1>
          
          <p className="text-2xl md:text-3xl font-medium text-accent mb-4">
            Vanakkam! Ungalukku enna samayal venum?
          </p>
          
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Enter your ingredients, and our AI aachi will tell you what to cook today! 
            Get authentic Tamil Nadu recipes tailored to what you have in your kitchen.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/ai-cook")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-warm)] text-lg px-8"
            >
              <ChefHat className="mr-2 h-5 w-5" />
              Ask AI Aachi
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/all-recipes")}
              className="text-lg px-8 border-2"
            >
              View All 500 Recipes
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
