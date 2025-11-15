import { Card, CardContent } from "@/components/ui/card";
import { Brain, Clock, Heart, Sparkles } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Smart AI Recommendations",
    description: "Get personalized recipe suggestions based on your ingredients and preferences"
  },
  {
    icon: Clock,
    title: "Time-Based Cooking",
    description: "Find recipes that fit your schedule, from quick snacks to elaborate meals"
  },
  {
    icon: Heart,
    title: "Healthy Veg Options",
    description: "Nutritious vegetarian recipes rooted in traditional Tamil cuisine"
  },
  {
    icon: Sparkles,
    title: "Mood-Based Recipes",
    description: "Tell us how you feel, and we'll suggest the perfect comfort food"
  }
];

const Features = () => {
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why Choose Tamil Smart Samayal?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your intelligent kitchen companion for authentic Tamil Nadu cuisine
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card key={idx} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
