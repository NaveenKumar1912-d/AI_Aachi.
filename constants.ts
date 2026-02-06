
export interface IngredientCategory {
  name: string;
  items: string[];
  unit: string;
  isNonVeg?: boolean;
}

export const INGREDIENT_CATEGORIES: IngredientCategory[] = [
  {
    name: "Grains & Millets",
    unit: "Cups",
    items: ["Rice (Ponni/Sona)", "Idli Rice", "Thinai (Foxtail Millet)", "Varagu (Kodo Millet)", "Ragi (Finger Millet)", "Wheat Flour (Atta)"]
  },
  {
    name: "Dals & Legumes",
    unit: "Cups",
    items: ["Toor Dal", "Urad Dal", "Moong Dal", "Chana Dal", "Fried Gram (Pottukadalai)", "Black Chickpeas (Karuppu Kadalai)"]
  },
  {
    name: "Nattu Kaigari (Country Veg)",
    unit: "Pcs",
    items: ["Small Onion (Shallots)", "Big Onion", "Tomato", "Drumstick", "Brinjal", "Lady's Finger", "Potato", "Raw Banana (Vazhaikkai)", "Snake Gourd (Pudalangai)", "Ridge Gourd (Peerkangai)", "Ash Gourd (Pooshnikai)", "Colocasia (Seppankizhangu)", "Ivy Gourd (Kovakkai)", "Carrot", "Beans"]
  },
  {
    name: "Spices & Masala",
    unit: "Tsp",
    items: ["Mustard Seeds", "Cumin Seeds", "Fennel Seeds (Sombu)", "Poppy Seeds (Khus Khus)", "Dried Red Chilies", "Green Chilies", "Turmeric Powder", "Sambar Powder", "Rasam Powder", "Chili Powder", "Coriander Powder", "Cardamom", "Cloves", "Cinnamon", "Pepper", "Salt", "Asafoetida (Hing)"]
  },
  {
    name: "Aromatics & Herbs",
    unit: "Bunch/Pcs",
    items: ["Garlic", "Ginger", "Curry Leaves", "Coriander Leaves", "Mint Leaves (Pudina)", "Lemon", "Tamarind"]
  },
  {
    name: "Oils & Dairy",
    unit: "Tbsp",
    items: ["Gingelly Oil (Nalla Ennai)", "Coconut Oil", "Sunflower Oil", "Ghee", "Curd"]
  },
  {
    name: "Proteins",
    unit: "Grams",
    isNonVeg: true,
    items: ["Egg", "Chicken", "Mutton", "Fish", "Prawns (Iral)", "Dry Fish (Karuvadu)"]
  },
  {
    name: "Aachi's Pantry Extras",
    unit: "Units",
    items: ["Coconut", "Peanuts", "Jaggery", "Appalam", "Mor Milagai (Curd Chili)", "Dried Mango"]
  }
];

export const TAMIL_INGREDIENTS = INGREDIENT_CATEGORIES.flatMap(cat => cat.items);

export const INGREDIENT_PRICES: Record<string, number> = {
  "Rice (Ponni/Sona)": 15,
  "Idli Rice": 18,
  "Thinai (Foxtail Millet)": 25,
  "Varagu (Kodo Millet)": 25,
  "Ragi (Finger Millet)": 20,
  "Wheat Flour (Atta)": 15,
  "Toor Dal": 20,
  "Urad Dal": 15,
  "Moong Dal": 15,
  "Chana Dal": 12,
  "Fried Gram (Pottukadalai)": 10,
  "Black Chickpeas (Karuppu Kadalai)": 12,
  "Tamarind": 5,
  "Coconut": 25,
  "Small Onion (Shallots)": 15,
  "Big Onion": 8,
  "Tomato": 10,
  "Curry Leaves": 2,
  "Mustard Seeds": 1,
  "Cumin Seeds": 1,
  "Fennel Seeds (Sombu)": 2,
  "Poppy Seeds (Khus Khus)": 5,
  "Dried Red Chilies": 2,
  "Green Chilies": 2,
  "Garlic": 5,
  "Ginger": 5,
  "Turmeric Powder": 1,
  "Sambar Powder": 5,
  "Rasam Powder": 5,
  "Chili Powder": 4,
  "Coriander Powder": 4,
  "Cardamom": 5,
  "Cloves": 3,
  "Cinnamon": 3,
  "Pepper": 2,
  "Salt": 1,
  "Gingelly Oil (Nalla Ennai)": 18,
  "Coconut Oil": 18,
  "Sunflower Oil": 10,
  "Ghee": 30,
  "Drumstick": 15,
  "Brinjal": 10,
  "Lady's Finger": 10,
  "Potato": 10,
  "Raw Banana (Vazhaikkai)": 12,
  "Snake Gourd (Pudalangai)": 15,
  "Ridge Gourd (Peerkangai)": 15,
  "Ash Gourd (Pooshnikai)": 20,
  "Colocasia (Seppankizhangu)": 15,
  "Ivy Gourd (Kovakkai)": 12,
  "Carrot": 10,
  "Beans": 10,
  "Curd": 20,
  "Coriander Leaves": 5,
  "Mint Leaves (Pudina)": 5,
  "Asafoetida (Hing)": 2,
  "Lemon": 5,
  "Peanuts": 10,
  "Jaggery": 5,
  "Appalam": 2,
  "Mor Milagai (Curd Chili)": 3,
  "Dried Mango": 10,
  "Egg": 7,
  "Chicken": 0.5,
  "Mutton": 1.2,
  "Fish": 0.8,
  "Prawns (Iral)": 1.0,
  "Dry Fish (Karuvadu)": 1.5
};
