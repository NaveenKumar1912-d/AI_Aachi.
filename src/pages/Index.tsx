import Hero from "@/components/Hero";
import PopularRecipes from "@/components/PopularRecipes";
import Features from "@/components/Features";
import RegionalMap from "@/components/RegionalMap";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Hero />
      <Features />
      <PopularRecipes />
      <RegionalMap />
      
      <footer className="py-12 border-t mt-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container">
          <div className="text-center space-y-4">
            <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Tamil Smart Samayal
            </p>
            <p className="text-lg text-muted-foreground">
              Made with ❤️ and masala in Tamil Nadu
            </p>
            <p className="text-sm text-muted-foreground">
              © 2025 Tamil Smart Samayal | AI-powered recipe recommendations
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <span className="text-muted-foreground">Tamil recipes</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">South Indian cooking</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">AI recipe recommender</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
