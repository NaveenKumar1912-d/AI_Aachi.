import idliImg from "@/assets/idli.jpg";
import dosaImg from "@/assets/dosa.jpg";
import sambarImg from "@/assets/sambar.jpg";
import pongalImg from "@/assets/pongal.jpg";
import chettinadChickenImg from "@/assets/chettinad-chicken.jpg";
import vadaImg from "@/assets/vada.jpg";
import payasamImg from "@/assets/payasam.jpg";
import rasamImg from "@/assets/rasam.jpg";

// Step images
import idliStep1 from "@/assets/steps/idli-step1.jpg";
import idliStep2 from "@/assets/steps/idli-step2.jpg";
import idliStep3 from "@/assets/steps/idli-step3.jpg";
import idliStep4 from "@/assets/steps/idli-step4.jpg";
import idliStep5 from "@/assets/steps/idli-step5.jpg";
import dosaStep1 from "@/assets/steps/dosa-step1.jpg";
import dosaStep2 from "@/assets/steps/dosa-step2.jpg";
import dosaStep3 from "@/assets/steps/dosa-step3.jpg";
import sambarStep1 from "@/assets/steps/sambar-step1.jpg";
import sambarStep2 from "@/assets/steps/sambar-step2.jpg";
import sambarStep3 from "@/assets/steps/sambar-step3.jpg";
import sambarStep4 from "@/assets/steps/sambar-step4.jpg";
import pongalStep1 from "@/assets/steps/pongal-step1.jpg";
import pongalStep2 from "@/assets/steps/pongal-step2.jpg";
import pongalStep3 from "@/assets/steps/pongal-step3.jpg";
import chickenStep1 from "@/assets/steps/chicken-step1.jpg";
import chickenStep2 from "@/assets/steps/chicken-step2.jpg";
import chickenStep3 from "@/assets/steps/chicken-step3.jpg";
import vadaStep1 from "@/assets/steps/vada-step1.jpg";
import vadaStep2 from "@/assets/steps/vada-step2.jpg";
import vadaStep3 from "@/assets/steps/vada-step3.jpg";
import payasamStep1 from "@/assets/steps/payasam-step1.jpg";
import payasamStep2 from "@/assets/steps/payasam-step2.jpg";
import payasamStep3 from "@/assets/steps/payasam-step3.jpg";
import rasamStep1 from "@/assets/steps/rasam-step1.jpg";
import rasamStep2 from "@/assets/steps/rasam-step2.jpg";
import rasamStep3 from "@/assets/steps/rasam-step3.jpg";

export type DietType = "veg" | "non-veg";
export type MealType = "breakfast" | "lunch" | "snacks" | "sweets" | "drinks";
export type SpiceLevel = "mild" | "medium" | "spicy";
export type Region = "chettinad" | "madurai" | "kongu" | "tanjore" | "general";

export interface Recipe {
  id: string;
  name: string;
  nameEnglish: string;
  category: MealType;
  dietType: DietType;
  spiceLevel: SpiceLevel;
  region: Region;
  image: string;
  cookTime: string;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description: string;
  ingredients: string[];
  steps: string[];
  stepImages: string[];
  tips: string[];
}

export const recipes: Recipe[] = [
  {
    id: "1",
    name: "Idli",
    nameEnglish: "Steamed Rice Cakes",
    category: "breakfast",
    dietType: "veg",
    spiceLevel: "mild",
    region: "general",
    image: idliImg,
    cookTime: "30 mins",
    servings: 4,
    calories: 150,
    protein: 4,
    carbs: 28,
    fat: 2,
    description: "Soft, fluffy steamed rice cakes - a Tamil Nadu breakfast staple!",
    ingredients: ["Rice", "Urad dal", "Fenugreek seeds", "Salt"],
    steps: [
      "Soak rice and urad dal separately for 4-6 hours",
      "Grind into smooth batter",
      "Ferment overnight",
      "Pour into idli moulds and steam for 10-12 minutes"
    ],
    stepImages: [idliStep1, idliStep2, idliStep3, idliStep4, idliStep5],
    tips: [
      "Use the right rice-to-dal ratio (4:1) for best texture",
      "Fermentation is key - keep batter in warm place for 8-12 hours",
      "Add a pinch of fenugreek seeds for better fermentation"
    ]
  },
  {
    id: "2",
    name: "Masala Dosa",
    nameEnglish: "Crispy Rice Crepe with Potato Filling",
    category: "breakfast",
    dietType: "veg",
    spiceLevel: "medium",
    region: "general",
    image: dosaImg,
    cookTime: "25 mins",
    servings: 2,
    calories: 220,
    protein: 6,
    carbs: 38,
    fat: 5,
    description: "Crispy golden dosa with spiced potato masala - irresistible!",
    ingredients: ["Dosa batter", "Potatoes", "Onions", "Green chillies", "Curry leaves", "Mustard seeds"],
    steps: [
      "Prepare potato masala with spices",
      "Heat tawa and spread dosa batter thin",
      "Add masala filling",
      "Fold and serve hot with chutney and sambar"
    ],
    stepImages: [dosaStep1, dosaStep2, dosaStep3],
    tips: [
      "Use a well-seasoned iron tawa for the crispiest dosa",
      "Spread the batter in circular motion from center outward",
      "Keep the flame medium-high for perfect golden color"
    ]
  },
  {
    id: "3",
    name: "Sambar",
    nameEnglish: "Tangy Lentil Vegetable Stew",
    category: "lunch",
    dietType: "veg",
    spiceLevel: "medium",
    region: "general",
    image: sambarImg,
    cookTime: "40 mins",
    servings: 6,
    calories: 180,
    protein: 8,
    carbs: 24,
    fat: 6,
    description: "Aromatic lentil stew with vegetables - soul food!",
    ingredients: ["Toor dal", "Drumsticks", "Tomatoes", "Sambar powder", "Tamarind", "Curry leaves"],
    steps: [
      "Cook toor dal until soft",
      "Boil vegetables separately",
      "Make sambar with tamarind extract and spices",
      "Add dal and vegetables, simmer"
    ],
    stepImages: [sambarStep1, sambarStep2, sambarStep3, sambarStep4],
    tips: [
      "Don't overcook the dal - it should be soft but not mushy",
      "Add tamarind extract at the end to retain tanginess",
      "Fresh curry leaves make all the difference in flavor"
    ]
  },
  {
    id: "4",
    name: "Pongal",
    nameEnglish: "Savory Rice & Lentil Porridge",
    category: "breakfast",
    dietType: "veg",
    spiceLevel: "mild",
    region: "general",
    image: pongalImg,
    cookTime: "35 mins",
    servings: 4,
    calories: 280,
    protein: 9,
    carbs: 42,
    fat: 8,
    description: "Comforting rice-lentil dish with ghee, pepper, and cashews!",
    ingredients: ["Rice", "Moong dal", "Black pepper", "Cumin", "Cashews", "Ghee", "Curry leaves"],
    steps: [
      "Pressure cook rice and moong dal together",
      "Temper with ghee, pepper, cumin, and cashews",
      "Mix well and serve hot"
    ],
    stepImages: [pongalStep1, pongalStep2, pongalStep3],
    tips: [
      "Roast moong dal lightly before cooking for nutty flavor",
      "Use plenty of ghee for authentic taste",
      "Serve hot with coconut chutney and sambar"
    ]
  },
  {
    id: "5",
    name: "Chettinad Chicken",
    nameEnglish: "Spicy Chettinad Style Chicken Curry",
    category: "lunch",
    dietType: "non-veg",
    spiceLevel: "spicy",
    region: "chettinad",
    image: chettinadChickenImg,
    cookTime: "50 mins",
    servings: 4,
    calories: 380,
    protein: 32,
    carbs: 12,
    fat: 24,
    description: "Fiery Chettinad masala with tender chicken - full of flavor!",
    ingredients: ["Chicken", "Chettinad masala", "Onions", "Tomatoes", "Curry leaves", "Fennel seeds"],
    steps: [
      "Marinate chicken with spices",
      "Sauté onions and tomatoes",
      "Add Chettinad masala paste",
      "Cook chicken until tender"
    ],
    stepImages: [chickenStep1, chickenStep2, chickenStep3],
    tips: [
      "Toast the spices before grinding for deeper flavor",
      "Marinate chicken for at least 30 minutes",
      "Cook on low heat for tender, juicy chicken"
    ]
  },
  {
    id: "6",
    name: "Medu Vada",
    nameEnglish: "Savory Lentil Donuts",
    category: "snacks",
    dietType: "veg",
    spiceLevel: "medium",
    region: "general",
    image: vadaImg,
    cookTime: "30 mins",
    servings: 6,
    calories: 200,
    protein: 7,
    carbs: 18,
    fat: 12,
    description: "Crispy on outside, soft inside - perfect evening snack!",
    ingredients: ["Urad dal", "Green chillies", "Ginger", "Curry leaves", "Asafoetida", "Oil for frying"],
    steps: [
      "Soak and grind urad dal coarsely",
      "Add spices and mix well",
      "Shape into donuts",
      "Deep fry until golden brown"
    ],
    stepImages: [vadaStep1, vadaStep2, vadaStep3],
    tips: [
      "Grind dal to a coarse texture, not too smooth",
      "Make a hole in center to ensure even frying",
      "Oil temperature is crucial - too hot will burn outside"
    ]
  },
  {
    id: "7",
    name: "Payasam",
    nameEnglish: "Sweet Milk Pudding",
    category: "sweets",
    dietType: "veg",
    spiceLevel: "mild",
    region: "general",
    image: payasamImg,
    cookTime: "45 mins",
    servings: 6,
    calories: 320,
    protein: 8,
    carbs: 52,
    fat: 10,
    description: "Creamy, sweet milk pudding with nuts - festival favorite!",
    ingredients: ["Vermicelli", "Milk", "Sugar", "Cardamom", "Cashews", "Raisins", "Ghee"],
    steps: [
      "Roast vermicelli in ghee",
      "Boil milk and add vermicelli",
      "Add sugar and cardamom",
      "Garnish with fried nuts and raisins"
    ],
    stepImages: [payasamStep1, payasamStep2, payasamStep3],
    tips: [
      "Use full-fat milk for richest flavor",
      "Roast vermicelli until golden for better taste",
      "Payasam thickens as it cools, adjust milk accordingly"
    ]
  },
  {
    id: "8",
    name: "Rasam",
    nameEnglish: "Tangy Tamarind Soup",
    category: "lunch",
    dietType: "veg",
    spiceLevel: "medium",
    region: "general",
    image: rasamImg,
    cookTime: "25 mins",
    servings: 4,
    calories: 90,
    protein: 3,
    carbs: 15,
    fat: 3,
    description: "Tangy, peppery soup - perfect comfort food!",
    ingredients: ["Tamarind", "Tomatoes", "Rasam powder", "Black pepper", "Cumin", "Curry leaves"],
    steps: [
      "Extract tamarind juice",
      "Boil with tomatoes and spices",
      "Add rasam powder",
      "Temper with mustard, cumin, and curry leaves"
    ],
    stepImages: [rasamStep1, rasamStep2, rasamStep3],
    tips: [
      "Don't boil rasam too long - it loses flavor",
      "Freshly ground pepper gives best taste",
      "Serve hot with rice or drink as soup"
    ]
  }
];

export const regions = [
  { id: "all", name: "All Tamil Nadu" },
  { id: "chettinad", name: "Chettinad - Spice Heaven" },
  { id: "madurai", name: "Madurai - Temple City" },
  { id: "kongu", name: "Kongu - Western Flavors" },
  { id: "tanjore", name: "Tanjore - Royal Cuisine" },
  { id: "general", name: "Traditional Tamil" }
];
