import { ParsedRecipe } from "@/utils/recipeParser";

// Tamil Nadu regions
const regions = [
  "Kongu Nadu", "Chola Nadu", "Chettinad", "Madurai", "Tanjore", 
  "Pandya Nadu", "Nanjil Nadu", "Nadu Nadu", "Thondai Nadu", "Pallava Nadu"
];

// Recipe categories
const categories = ["Vegetarian", "Non-Vegetarian", "Vegan"];

// Base recipe templates with authentic Tamil Nadu dishes
const recipeTemplates = [
  // Breakfast items
  { name: "Idli", baseRegion: "general", category: "Vegetarian" },
  { name: "Dosa", baseRegion: "general", category: "Vegetarian" },
  { name: "Pongal", baseRegion: "general", category: "Vegetarian" },
  { name: "Upma", baseRegion: "general", category: "Vegetarian" },
  { name: "Puttu", baseRegion: "Kongu Nadu", category: "Vegetarian" },
  { name: "Appam", baseRegion: "Kongu Nadu", category: "Vegetarian" },
  { name: "Rava Dosa", baseRegion: "general", category: "Vegetarian" },
  { name: "Onion Dosa", baseRegion: "general", category: "Vegetarian" },
  { name: "Masala Dosa", baseRegion: "general", category: "Vegetarian" },
  { name: "Rava Idli", baseRegion: "general", category: "Vegetarian" },
  { name: "Kanchipuram Idli", baseRegion: "Thondai Nadu", category: "Vegetarian" },
  { name: "Rava Upma", baseRegion: "general", category: "Vegetarian" },
  { name: "Ven Pongal", baseRegion: "general", category: "Vegetarian" },
  { name: "Sweet Pongal", baseRegion: "general", category: "Vegetarian" },
  { name: "Aval Upma", baseRegion: "general", category: "Vegetarian" },
  { name: "Kesari", baseRegion: "general", category: "Vegetarian" },
  { name: "Rava Kesari", baseRegion: "general", category: "Vegetarian" },
  { name: "Poha", baseRegion: "general", category: "Vegetarian" },
  { name: "Aval Poha", baseRegion: "general", category: "Vegetarian" },
  { name: "Kuzhi Paniyaram", baseRegion: "general", category: "Vegetarian" },
  
  // Sambar varieties
  { name: "Sambar", baseRegion: "general", category: "Vegetarian" },
  { name: "Kongu Nadu Sambar", baseRegion: "Kongu Nadu", category: "Vegetarian" },
  { name: "Chola Nadu Sambar", baseRegion: "Chola Nadu", category: "Vegetarian" },
  { name: "Arachuvitta Sambar", baseRegion: "Tanjore", category: "Vegetarian" },
  { name: "Kootu Sambar", baseRegion: "general", category: "Vegetarian" },
  { name: "Paruppu Sambar", baseRegion: "general", category: "Vegetarian" },
  { name: "Keerai Sambar", baseRegion: "general", category: "Vegetarian" },
  { name: "Vendakkai Sambar", baseRegion: "general", category: "Vegetarian" },
  { name: "Kathrikai Sambar", baseRegion: "general", category: "Vegetarian" },
  { name: "Murungakkai Sambar", baseRegion: "general", category: "Vegetarian" },
  
  // Rasam varieties
  { name: "Rasam", baseRegion: "general", category: "Vegetarian" },
  { name: "Tomato Rasam", baseRegion: "general", category: "Vegetarian" },
  { name: "Pineapple Rasam", baseRegion: "general", category: "Vegetarian" },
  { name: "Lemon Rasam", baseRegion: "general", category: "Vegetarian" },
  { name: "Pepper Rasam", baseRegion: "general", category: "Vegetarian" },
  { name: "Jeera Rasam", baseRegion: "general", category: "Vegetarian" },
  { name: "Garlic Rasam", baseRegion: "general", category: "Vegetarian" },
  { name: "Mysore Rasam", baseRegion: "general", category: "Vegetarian" },
  { name: "Paruppu Rasam", baseRegion: "general", category: "Vegetarian" },
  { name: "Neem Flower Rasam", baseRegion: "general", category: "Vegetarian" },
  
  // Kuzhambu varieties
  { name: "Vatha Kuzhambu", baseRegion: "general", category: "Vegetarian" },
  { name: "Puli Kuzhambu", baseRegion: "general", category: "Vegetarian" },
  { name: "Kara Kuzhambu", baseRegion: "general", category: "Vegetarian" },
  { name: "More Kuzhambu", baseRegion: "general", category: "Vegetarian" },
  { name: "Kootu Kuzhambu", baseRegion: "general", category: "Vegetarian" },
  { name: "Arachuvitta Kuzhambu", baseRegion: "Tanjore", category: "Vegetarian" },
  { name: "Kongu Nadu Kuzhambu", baseRegion: "Kongu Nadu", category: "Vegetarian" },
  { name: "Chola Nadu Kuzhambu", baseRegion: "Chola Nadu", category: "Vegetarian" },
  { name: "Kothamalli Kuzhambu", baseRegion: "general", category: "Vegetarian" },
  { name: "Manathakkali Kuzhambu", baseRegion: "general", category: "Vegetarian" },
  
  // Non-vegetarian dishes - Chicken
  { name: "Chicken Curry", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Chettinad Chicken", baseRegion: "Chettinad", category: "Non-Vegetarian" },
  { name: "Madurai Chicken", baseRegion: "Madurai", category: "Non-Vegetarian" },
  { name: "Kongu Nadu Chicken", baseRegion: "Kongu Nadu", category: "Non-Vegetarian" },
  { name: "Chola Nadu Chicken", baseRegion: "Chola Nadu", category: "Non-Vegetarian" },
  { name: "Tanjore Chicken", baseRegion: "Tanjore", category: "Non-Vegetarian" },
  { name: "Pandya Nadu Chicken", baseRegion: "Pandya Nadu", category: "Non-Vegetarian" },
  { name: "Chicken Kuzhambu", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Chicken Peratal", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Chicken Varuval", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Chicken 65", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Chicken Biryani", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Chicken Roast", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Chicken Fry", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Chicken Gravy", baseRegion: "general", category: "Non-Vegetarian" },
  
  // Non-vegetarian dishes - Mutton
  { name: "Mutton Curry", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Chettinad Mutton", baseRegion: "Chettinad", category: "Non-Vegetarian" },
  { name: "Madurai Mutton", baseRegion: "Madurai", category: "Non-Vegetarian" },
  { name: "Kongu Nadu Mutton", baseRegion: "Kongu Nadu", category: "Non-Vegetarian" },
  { name: "Chola Nadu Mutton", baseRegion: "Chola Nadu", category: "Non-Vegetarian" },
  { name: "Tanjore Mutton", baseRegion: "Tanjore", category: "Non-Vegetarian" },
  { name: "Pandya Nadu Mutton", baseRegion: "Pandya Nadu", category: "Non-Vegetarian" },
  { name: "Mutton Kuzhambu", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Mutton Peratal", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Mutton Varuval", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Mutton Biryani", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Mutton Roast", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Mutton Fry", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Mutton Gravy", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Mutton Chukka", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Mutton Keema", baseRegion: "general", category: "Non-Vegetarian" },
  
  // Non-vegetarian dishes - Beef
  { name: "Beef Curry", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Chettinad Beef", baseRegion: "Chettinad", category: "Non-Vegetarian" },
  { name: "Madurai Beef", baseRegion: "Madurai", category: "Non-Vegetarian" },
  { name: "Kongu Nadu Beef", baseRegion: "Kongu Nadu", category: "Non-Vegetarian" },
  { name: "Chola Nadu Beef", baseRegion: "Chola Nadu", category: "Non-Vegetarian" },
  { name: "Tanjore Beef", baseRegion: "Tanjore", category: "Non-Vegetarian" },
  { name: "Pandya Nadu Beef", baseRegion: "Pandya Nadu", category: "Non-Vegetarian" },
  { name: "Beef Kuzhambu", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Beef Peratal", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Beef Varuval", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Beef Biryani", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Beef Roast", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Beef Fry", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Beef Gravy", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Beef Chukka", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Beef Keema", baseRegion: "general", category: "Non-Vegetarian" },
  
  // Non-vegetarian dishes - Fish
  { name: "Fish Curry", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Fish Kuzhambu", baseRegion: "Chola Nadu", category: "Non-Vegetarian" },
  { name: "Meen Kuzhambu", baseRegion: "Chola Nadu", category: "Non-Vegetarian" },
  { name: "Fish Fry", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Fish Peratal", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Fish Varuval", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Fish Biryani", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Fish Gravy", baseRegion: "general", category: "Non-Vegetarian" },
  
  // Non-vegetarian dishes - Seafood
  { name: "Prawn Curry", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Prawn Kuzhambu", baseRegion: "Chola Nadu", category: "Non-Vegetarian" },
  { name: "Prawn Fry", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Prawn Peratal", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Prawn Biryani", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Crab Curry", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Crab Fry", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Crab Kuzhambu", baseRegion: "general", category: "Non-Vegetarian" },
  
  // Non-vegetarian dishes - Egg
  { name: "Egg Curry", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Egg Kuzhambu", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Egg Peratal", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Egg Fry", baseRegion: "general", category: "Non-Vegetarian" },
  { name: "Egg Biryani", baseRegion: "general", category: "Non-Vegetarian" },
  
  // Snacks
  { name: "Medu Vada", baseRegion: "general", category: "Vegetarian" },
  { name: "Masala Vada", baseRegion: "general", category: "Vegetarian" },
  { name: "Paruppu Vada", baseRegion: "general", category: "Vegetarian" },
  { name: "Onion Pakoda", baseRegion: "general", category: "Vegetarian" },
  { name: "Bajji", baseRegion: "general", category: "Vegetarian" },
  { name: "Kathrikai Bajji", baseRegion: "general", category: "Vegetarian" },
  { name: "Vazhakkai Bajji", baseRegion: "general", category: "Vegetarian" },
  { name: "Murungakkai Bajji", baseRegion: "general", category: "Vegetarian" },
  { name: "Bonda", baseRegion: "general", category: "Vegetarian" },
  { name: "Urad Dal Bonda", baseRegion: "general", category: "Vegetarian" },
  { name: "Potato Bonda", baseRegion: "general", category: "Vegetarian" },
  { name: "Kara Boondi", baseRegion: "general", category: "Vegetarian" },
  { name: "Mixture", baseRegion: "general", category: "Vegetarian" },
  { name: "Thattai", baseRegion: "general", category: "Vegetarian" },
  { name: "Murukku", baseRegion: "general", category: "Vegetarian" },
  { name: "Achappam", baseRegion: "Kongu Nadu", category: "Vegetarian" },
  { name: "Adhirasam", baseRegion: "general", category: "Vegetarian" },
  { name: "Kozhukattai", baseRegion: "general", category: "Vegetarian" },
  { name: "Pidi Kozhukattai", baseRegion: "general", category: "Vegetarian" },
  { name: "Thengai Kozhukattai", baseRegion: "general", category: "Vegetarian" },
  
  // Rice dishes
  { name: "Lemon Rice", baseRegion: "general", category: "Vegetarian" },
  { name: "Tamarind Rice", baseRegion: "general", category: "Vegetarian" },
  { name: "Coconut Rice", baseRegion: "general", category: "Vegetarian" },
  { name: "Curd Rice", baseRegion: "general", category: "Vegetarian" },
  { name: "Tomato Rice", baseRegion: "general", category: "Vegetarian" },
  { name: "Puli Sadam", baseRegion: "general", category: "Vegetarian" },
  { name: "Elumichai Sadam", baseRegion: "general", category: "Vegetarian" },
  { name: "Thengai Sadam", baseRegion: "general", category: "Vegetarian" },
  { name: "Thayir Sadam", baseRegion: "general", category: "Vegetarian" },
  { name: "Thakkali Sadam", baseRegion: "general", category: "Vegetarian" },
  { name: "Bisi Bele Bath", baseRegion: "general", category: "Vegetarian" },
  { name: "Ven Pongal", baseRegion: "general", category: "Vegetarian" },
  { name: "Khichdi", baseRegion: "general", category: "Vegetarian" },
  { name: "Vegetable Biryani", baseRegion: "general", category: "Vegetarian" },
  
  // Sweets
  { name: "Payasam", baseRegion: "general", category: "Vegetarian" },
  { name: "Semiya Payasam", baseRegion: "general", category: "Vegetarian" },
  { name: "Aval Payasam", baseRegion: "general", category: "Vegetarian" },
  { name: "Rice Payasam", baseRegion: "general", category: "Vegetarian" },
  { name: "Wheat Payasam", baseRegion: "general", category: "Vegetarian" },
  { name: "Badam Payasam", baseRegion: "general", category: "Vegetarian" },
  { name: "Kheer", baseRegion: "general", category: "Vegetarian" },
  { name: "Gulab Jamun", baseRegion: "general", category: "Vegetarian" },
  { name: "Jangiri", baseRegion: "general", category: "Vegetarian" },
  { name: "Mysore Pak", baseRegion: "general", category: "Vegetarian" },
  { name: "Badusha", baseRegion: "general", category: "Vegetarian" },
  { name: "Kaju Katli", baseRegion: "general", category: "Vegetarian" },
  { name: "Laddu", baseRegion: "general", category: "Vegetarian" },
  { name: "Boondi Laddu", baseRegion: "general", category: "Vegetarian" },
  { name: "Rava Laddu", baseRegion: "general", category: "Vegetarian" },
  { name: "Besan Laddu", baseRegion: "general", category: "Vegetarian" },
  { name: "Kozhukattai", baseRegion: "general", category: "Vegetarian" },
  { name: "Modak", baseRegion: "general", category: "Vegetarian" },
  { name: "Halwa", baseRegion: "general", category: "Vegetarian" },
  { name: "Carrot Halwa", baseRegion: "general", category: "Vegetarian" },
  { name: "Wheat Halwa", baseRegion: "general", category: "Vegetarian" },
  { name: "Badam Halwa", baseRegion: "general", category: "Vegetarian" },
  
  // Chutneys and sides
  { name: "Coconut Chutney", baseRegion: "general", category: "Vegetarian" },
  { name: "Tomato Chutney", baseRegion: "general", category: "Vegetarian" },
  { name: "Onion Chutney", baseRegion: "general", category: "Vegetarian" },
  { name: "Ginger Chutney", baseRegion: "general", category: "Vegetarian" },
  { name: "Coriander Chutney", baseRegion: "general", category: "Vegetarian" },
  { name: "Mint Chutney", baseRegion: "general", category: "Vegetarian" },
  { name: "Peanut Chutney", baseRegion: "general", category: "Vegetarian" },
  { name: "Garlic Chutney", baseRegion: "general", category: "Vegetarian" },
  { name: "Red Chutney", baseRegion: "general", category: "Vegetarian" },
  { name: "Green Chutney", baseRegion: "general", category: "Vegetarian" },
  { name: "Thogayal", baseRegion: "general", category: "Vegetarian" },
  { name: "Keerai Thogayal", baseRegion: "general", category: "Vegetarian" },
  { name: "Coconut Thogayal", baseRegion: "general", category: "Vegetarian" },
  { name: "Tomato Thogayal", baseRegion: "general", category: "Vegetarian" },
  
  // Kootu varieties
  { name: "Arachuvitta Kootu", baseRegion: "Tanjore", category: "Vegetarian" },
  { name: "Keerai Kootu", baseRegion: "general", category: "Vegetarian" },
  { name: "Paruppu Kootu", baseRegion: "general", category: "Vegetarian" },
  { name: "Kathrikai Kootu", baseRegion: "general", category: "Vegetarian" },
  { name: "Vendakkai Kootu", baseRegion: "general", category: "Vegetarian" },
  { name: "Beans Kootu", baseRegion: "general", category: "Vegetarian" },
  { name: "Cabbage Kootu", baseRegion: "general", category: "Vegetarian" },
  { name: "Carrot Kootu", baseRegion: "general", category: "Vegetarian" },
  { name: "Beetroot Kootu", baseRegion: "general", category: "Vegetarian" },
  { name: "Drumstick Kootu", baseRegion: "general", category: "Vegetarian" },
  
  // Poricha Kuzhambu
  { name: "Poricha Kuzhambu", baseRegion: "general", category: "Vegetarian" },
  { name: "Kathrikai Poricha Kuzhambu", baseRegion: "general", category: "Vegetarian" },
  { name: "Vendakkai Poricha Kuzhambu", baseRegion: "general", category: "Vegetarian" },
  { name: "Beans Poricha Kuzhambu", baseRegion: "general", category: "Vegetarian" },
  { name: "Drumstick Poricha Kuzhambu", baseRegion: "general", category: "Vegetarian" },
  
  // Peratal varieties
  { name: "Kathrikai Peratal", baseRegion: "general", category: "Vegetarian" },
  { name: "Vendakkai Peratal", baseRegion: "general", category: "Vegetarian" },
  { name: "Beans Peratal", baseRegion: "general", category: "Vegetarian" },
  { name: "Cabbage Peratal", baseRegion: "general", category: "Vegetarian" },
  { name: "Carrot Peratal", baseRegion: "general", category: "Vegetarian" },
  { name: "Beetroot Peratal", baseRegion: "general", category: "Vegetarian" },
  { name: "Potato Peratal", baseRegion: "general", category: "Vegetarian" },
  { name: "Onion Peratal", baseRegion: "general", category: "Vegetarian" },
  
  // Additional popular Tamil dishes (unique recipes only)
  { name: "Kothu Parotta", baseRegion: "Kongu Nadu", category: "Vegetarian" },
  { name: "Parotta", baseRegion: "Kongu Nadu", category: "Vegetarian" },
  { name: "Chicken Kothu Parotta", baseRegion: "Kongu Nadu", category: "Non-Vegetarian" },
  { name: "Mutton Kothu Parotta", baseRegion: "Kongu Nadu", category: "Non-Vegetarian" },
  { name: "Egg Kothu Parotta", baseRegion: "Kongu Nadu", category: "Non-Vegetarian" },
  { name: "Aviyal", baseRegion: "general", category: "Vegetarian" },
  { name: "Thoran", baseRegion: "general", category: "Vegetarian" },
  { name: "Mezhukupuratti", baseRegion: "general", category: "Vegetarian" },
  { name: "Paruppu Usili", baseRegion: "general", category: "Vegetarian" },
  { name: "Keerai Masiyal", baseRegion: "general", category: "Vegetarian" },
  { name: "Vathal Kuzhambu", baseRegion: "general", category: "Vegetarian" },
  { name: "Sundakkai Kuzhambu", baseRegion: "general", category: "Vegetarian" },
  { name: "Inji Curry", baseRegion: "general", category: "Vegetarian" },
  { name: "Puli Inji", baseRegion: "general", category: "Vegetarian" },
  { name: "Thayir Pachadi", baseRegion: "general", category: "Vegetarian" },
  { name: "Onion Raita", baseRegion: "general", category: "Vegetarian" },
  { name: "Cucumber Raita", baseRegion: "general", category: "Vegetarian" },
  { name: "Pachadi", baseRegion: "general", category: "Vegetarian" },
  { name: "Kichadi", baseRegion: "general", category: "Vegetarian" },
  { name: "Poriyal", baseRegion: "general", category: "Vegetarian" },
  { name: "Varuval", baseRegion: "general", category: "Vegetarian" },
  { name: "Paneer Curry", baseRegion: "general", category: "Vegetarian" },
  { name: "Paneer Butter Masala", baseRegion: "general", category: "Vegetarian" },
  { name: "Aloo Gobi", baseRegion: "general", category: "Vegetarian" },
  { name: "Baingan Bharta", baseRegion: "general", category: "Vegetarian" },
  { name: "Dal Tadka", baseRegion: "general", category: "Vegetarian" },
  { name: "Dal Fry", baseRegion: "general", category: "Vegetarian" },
  { name: "Veg Kurma", baseRegion: "general", category: "Vegetarian" },
  { name: "Gobi Manchurian", baseRegion: "general", category: "Vegetarian" },
  { name: "Paneer Manchurian", baseRegion: "general", category: "Vegetarian" },
  { name: "Pulao", baseRegion: "general", category: "Vegetarian" },
  { name: "Jeera Rice", baseRegion: "general", category: "Vegetarian" },
  { name: "Ghee Rice", baseRegion: "general", category: "Vegetarian" },
  { name: "Fried Rice", baseRegion: "general", category: "Vegetarian" },
  { name: "Adai", baseRegion: "general", category: "Vegetarian" },
  { name: "Adai Dosa", baseRegion: "general", category: "Vegetarian" },
  { name: "Pesarattu", baseRegion: "general", category: "Vegetarian" },
  { name: "Uttapam", baseRegion: "general", category: "Vegetarian" },
  { name: "Onion Uttapam", baseRegion: "general", category: "Vegetarian" },
  { name: "Tomato Uttapam", baseRegion: "general", category: "Vegetarian" },
  { name: "Rava Uttapam", baseRegion: "general", category: "Vegetarian" },
  { name: "Neer Dosa", baseRegion: "general", category: "Vegetarian" },
  { name: "Set Dosa", baseRegion: "general", category: "Vegetarian" },
  { name: "Paper Dosa", baseRegion: "general", category: "Vegetarian" },
  { name: "Ghee Roast Dosa", baseRegion: "general", category: "Vegetarian" },
  { name: "Onion Rava Dosa", baseRegion: "general", category: "Vegetarian" },
  { name: "Ribbon Pakoda", baseRegion: "general", category: "Vegetarian" },
  { name: "Omapodi", baseRegion: "general", category: "Vegetarian" },
  { name: "Pal Payasam", baseRegion: "general", category: "Vegetarian" },
  { name: "Pradhaman", baseRegion: "general", category: "Vegetarian" },
  
  // Additional Snacks (20+)
  { name: "Kara Sev", baseRegion: "general", category: "Vegetarian" },
  { name: "Thenkuzhal", baseRegion: "general", category: "Vegetarian" },
  { name: "Kai Murukku", baseRegion: "general", category: "Vegetarian" },
  { name: "Achu Murukku", baseRegion: "general", category: "Vegetarian" },
  { name: "Kadalai Mittai", baseRegion: "general", category: "Vegetarian" },
  { name: "Sweet Boondi", baseRegion: "general", category: "Vegetarian" },
  { name: "Kara Pori", baseRegion: "general", category: "Vegetarian" },
  { name: "Sweet Pori", baseRegion: "general", category: "Vegetarian" },
  { name: "Corn Bhel", baseRegion: "general", category: "Vegetarian" },
  { name: "Bhel Puri", baseRegion: "general", category: "Vegetarian" },
  { name: "Pani Puri", baseRegion: "general", category: "Vegetarian" },
  { name: "Sev Puri", baseRegion: "general", category: "Vegetarian" },
  { name: "Dahi Puri", baseRegion: "general", category: "Vegetarian" },
  { name: "Samosa", baseRegion: "general", category: "Vegetarian" },
  { name: "Aloo Samosa", baseRegion: "general", category: "Vegetarian" },
  { name: "Onion Samosa", baseRegion: "general", category: "Vegetarian" },
  { name: "Kachori", baseRegion: "general", category: "Vegetarian" },
  { name: "Dal Kachori", baseRegion: "general", category: "Vegetarian" },
  { name: "Aloo Kachori", baseRegion: "general", category: "Vegetarian" },
  { name: "Paniyaram", baseRegion: "general", category: "Vegetarian" },
  { name: "Kara Paniyaram", baseRegion: "general", category: "Vegetarian" },
  { name: "Sweet Paniyaram", baseRegion: "general", category: "Vegetarian" },
  { name: "Ragi Paniyaram", baseRegion: "general", category: "Vegetarian" },
  { name: "Poha Chivda", baseRegion: "general", category: "Vegetarian" },
  { name: "Aval Chivda", baseRegion: "general", category: "Vegetarian" },
  { name: "Cornflakes Chivda", baseRegion: "general", category: "Vegetarian" },
  { name: "Kara Vadai", baseRegion: "general", category: "Vegetarian" },
  { name: "Ulundhu Vadai", baseRegion: "general", category: "Vegetarian" },
  { name: "Aam Vadai", baseRegion: "general", category: "Vegetarian" },
  { name: "Ragi Vadai", baseRegion: "general", category: "Vegetarian" },
  { name: "Keerai Vadai", baseRegion: "general", category: "Vegetarian" },
  { name: "Onion Vadai", baseRegion: "general", category: "Vegetarian" },
  { name: "Parippu Vadai", baseRegion: "general", category: "Vegetarian" },
  { name: "Thavala Vadai", baseRegion: "general", category: "Vegetarian" },
  { name: "Kuzhi Paniyaram", baseRegion: "general", category: "Vegetarian" },
  { name: "Appalam", baseRegion: "general", category: "Vegetarian" },
  { name: "Vadam", baseRegion: "general", category: "Vegetarian" },
  { name: "Vathal", baseRegion: "general", category: "Vegetarian" },
  { name: "Sundakkai Vathal", baseRegion: "general", category: "Vegetarian" },
  { name: "Manathakkali Vathal", baseRegion: "general", category: "Vegetarian" },
  { name: "Kothamalli Vathal", baseRegion: "general", category: "Vegetarian" },
  { name: "Kara Appalam", baseRegion: "general", category: "Vegetarian" },
  { name: "Masala Appalam", baseRegion: "general", category: "Vegetarian" },
  { name: "Pappad", baseRegion: "general", category: "Vegetarian" },
  { name: "Masala Pappad", baseRegion: "general", category: "Vegetarian" },
  { name: "Kara Pappad", baseRegion: "general", category: "Vegetarian" },
  { name: "Banana Chips", baseRegion: "general", category: "Vegetarian" },
  { name: "Potato Chips", baseRegion: "general", category: "Vegetarian" },
  { name: "Tapioca Chips", baseRegion: "general", category: "Vegetarian" },
  { name: "Jackfruit Chips", baseRegion: "general", category: "Vegetarian" },
  { name: "Raw Banana Chips", baseRegion: "general", category: "Vegetarian" },
  { name: "Kothu Idli", baseRegion: "general", category: "Vegetarian" },
  { name: "Idli Upma", baseRegion: "general", category: "Vegetarian" },
  { name: "Dosa Upma", baseRegion: "general", category: "Vegetarian" },
  
  // Drinks (20+)
  { name: "Filter Coffee", baseRegion: "general", category: "Vegetarian" },
  { name: "South Indian Coffee", baseRegion: "general", category: "Vegetarian" },
  { name: "Kumbakonam Degree Coffee", baseRegion: "general", category: "Vegetarian" },
  { name: "Tea", baseRegion: "general", category: "Vegetarian" },
  { name: "Masala Tea", baseRegion: "general", category: "Vegetarian" },
  { name: "Ginger Tea", baseRegion: "general", category: "Vegetarian" },
  { name: "Cardamom Tea", baseRegion: "general", category: "Vegetarian" },
  { name: "Lemon Tea", baseRegion: "general", category: "Vegetarian" },
  { name: "Buttermilk", baseRegion: "general", category: "Vegetarian" },
  { name: "Neer Mor", baseRegion: "general", category: "Vegetarian" },
  { name: "Spiced Buttermilk", baseRegion: "general", category: "Vegetarian" },
  { name: "Curd Drink", baseRegion: "general", category: "Vegetarian" },
  { name: "Lassi", baseRegion: "general", category: "Vegetarian" },
  { name: "Sweet Lassi", baseRegion: "general", category: "Vegetarian" },
  { name: "Salt Lassi", baseRegion: "general", category: "Vegetarian" },
  { name: "Mango Lassi", baseRegion: "general", category: "Vegetarian" },
  { name: "Rose Lassi", baseRegion: "general", category: "Vegetarian" },
  { name: "Jal Jeera", baseRegion: "general", category: "Vegetarian" },
  { name: "Nimbu Pani", baseRegion: "general", category: "Vegetarian" },
  { name: "Lemon Juice", baseRegion: "general", category: "Vegetarian" },
  { name: "Lime Juice", baseRegion: "general", category: "Vegetarian" },
  { name: "Orange Juice", baseRegion: "general", category: "Vegetarian" },
  { name: "Pomegranate Juice", baseRegion: "general", category: "Vegetarian" },
  { name: "Watermelon Juice", baseRegion: "general", category: "Vegetarian" },
  { name: "Muskmelon Juice", baseRegion: "general", category: "Vegetarian" },
  { name: "Cucumber Juice", baseRegion: "general", category: "Vegetarian" },
  { name: "Coconut Water", baseRegion: "general", category: "Vegetarian" },
  { name: "Tender Coconut Water", baseRegion: "general", category: "Vegetarian" },
  { name: "Coconut Milk", baseRegion: "general", category: "Vegetarian" },
  { name: "Badam Milk", baseRegion: "general", category: "Vegetarian" },
  { name: "Almond Milk", baseRegion: "general", category: "Vegetarian" },
  { name: "Pista Milk", baseRegion: "general", category: "Vegetarian" },
  { name: "Pistachio Milk", baseRegion: "general", category: "Vegetarian" },
  { name: "Kesar Milk", baseRegion: "general", category: "Vegetarian" },
  { name: "Saffron Milk", baseRegion: "general", category: "Vegetarian" },
  { name: "Turmeric Milk", baseRegion: "general", category: "Vegetarian" },
  { name: "Haldi Doodh", baseRegion: "general", category: "Vegetarian" },
  { name: "Rose Milk", baseRegion: "general", category: "Vegetarian" },
  { name: "Elaneer Payasam", baseRegion: "general", category: "Vegetarian" },
  { name: "Tender Coconut Payasam", baseRegion: "general", category: "Vegetarian" },
  { name: "Panagam", baseRegion: "general", category: "Vegetarian" },
  { name: "Jaggery Water", baseRegion: "general", category: "Vegetarian" },
  { name: "Palm Jaggery Drink", baseRegion: "general", category: "Vegetarian" },
  { name: "Sathukudi Juice", baseRegion: "general", category: "Vegetarian" },
  { name: "Sweet Lime Juice", baseRegion: "general", category: "Vegetarian" },
  { name: "Ginger Ale", baseRegion: "general", category: "Vegetarian" },
  { name: "Ginger Lemon Drink", baseRegion: "general", category: "Vegetarian" },
  { name: "Mint Lemonade", baseRegion: "general", category: "Vegetarian" },
  { name: "Mint Juice", baseRegion: "general", category: "Vegetarian" },
  { name: "Coriander Juice", baseRegion: "general", category: "Vegetarian" },
  { name: "Amla Juice", baseRegion: "general", category: "Vegetarian" },
  { name: "Gooseberry Juice", baseRegion: "general", category: "Vegetarian" },
  { name: "Aam Panna", baseRegion: "general", category: "Vegetarian" },
  { name: "Raw Mango Drink", baseRegion: "general", category: "Vegetarian" },
  { name: "Mango Shake", baseRegion: "general", category: "Vegetarian" },
  { name: "Banana Shake", baseRegion: "general", category: "Vegetarian" },
  { name: "Papaya Shake", baseRegion: "general", category: "Vegetarian" },
  { name: "Chikoo Shake", baseRegion: "general", category: "Vegetarian" },
  { name: "Sapota Shake", baseRegion: "general", category: "Vegetarian" },
  { name: "Thandai", baseRegion: "general", category: "Vegetarian" },
  { name: "Sugarcane Juice", baseRegion: "general", category: "Vegetarian" },
  { name: "Karupatti Juice", baseRegion: "general", category: "Vegetarian" },
  { name: "Palm Sugar Drink", baseRegion: "general", category: "Vegetarian" },
  
];

// Generate ingredients based on recipe type
function generateIngredients(recipeName: string, region: string, category: string): string[] {
  const baseIngredients: string[] = [];
  const regionSpices: Record<string, string[]> = {
    "Kongu Nadu": ["Fennel seeds", "Cumin", "Coriander seeds", "Red chillies", "Curry leaves"],
    "Chola Nadu": ["Tamarind", "Turmeric", "Red chilli powder", "Coriander", "Curry leaves"],
    "Chettinad": ["Fennel seeds", "Star anise", "Black pepper", "Cinnamon", "Cloves", "Cardamom"],
    "Madurai": ["Red chillies", "Garlic", "Tamarind", "Curry leaves", "Mustard seeds"],
    "Tanjore": ["Coconut", "Cumin", "Coriander", "Turmeric", "Curry leaves"],
    "Pandya Nadu": ["Tamarind", "Turmeric", "Red chillies", "Curry leaves", "Coriander"],
    "Nanjil Nadu": ["Coconut", "Turmeric", "Green chillies", "Curry leaves", "Mustard seeds"],
    "Nadu Nadu": ["Turmeric", "Red chilli powder", "Coriander", "Curry leaves", "Cumin"],
    "Thondai Nadu": ["Cumin", "Coriander", "Turmeric", "Curry leaves", "Mustard seeds"],
    "Pallava Nadu": ["Coconut", "Turmeric", "Coriander", "Curry leaves", "Cumin"],
  };

  const spices = regionSpices[region] || ["Turmeric", "Red chilli powder", "Coriander", "Curry leaves", "Cumin"];
  
  baseIngredients.push(...spices);
  
  // Add specific ingredients based on recipe name
  const nameLower = recipeName.toLowerCase();
  if (nameLower.includes("sambar")) {
    baseIngredients.push("Toor dal", "Tamarind", "Vegetables", "Sambar powder");
  } else if (nameLower.includes("rasam")) {
    baseIngredients.push("Tamarind", "Tomatoes", "Rasam powder", "Black pepper");
  } else if (nameLower.includes("kuzhambu")) {
    baseIngredients.push("Tamarind", "Vegetables or Meat", "Kuzhambu powder");
  } else if (nameLower.includes("kootu")) {
    baseIngredients.push("Dal", "Vegetables", "Coconut");
  } else if (nameLower.includes("chicken")) {
    baseIngredients.push("Chicken", "Onions", "Tomatoes", "Ginger", "Garlic");
  } else if (nameLower.includes("mutton")) {
    baseIngredients.push("Mutton", "Onions", "Tomatoes", "Ginger", "Garlic");
  } else if (nameLower.includes("beef")) {
    baseIngredients.push("Beef", "Onions", "Tomatoes", "Ginger", "Garlic");
  } else if (nameLower.includes("fish") || nameLower.includes("meen")) {
    baseIngredients.push("Fish", "Tamarind", "Onions", "Tomatoes");
  } else if (nameLower.includes("prawn")) {
    baseIngredients.push("Prawns", "Tamarind", "Onions", "Tomatoes");
  } else if (nameLower.includes("egg")) {
    baseIngredients.push("Eggs", "Onions", "Tomatoes");
  } else if (nameLower.includes("dosa") || nameLower.includes("idli")) {
    baseIngredients.push("Rice", "Urad dal", "Fenugreek seeds", "Salt");
  } else if (nameLower.includes("pongal")) {
    baseIngredients.push("Rice", "Moong dal", "Black pepper", "Cumin", "Ghee");
  } else if (nameLower.includes("rice")) {
    baseIngredients.push("Rice", "Tamarind or Lemon", "Spices");
  } else if (nameLower.includes("payasam") || nameLower.includes("kheer")) {
    baseIngredients.push("Milk", "Sugar", "Cardamom", "Nuts");
  } else if (nameLower.includes("chutney") || nameLower.includes("thogayal")) {
    baseIngredients.push("Coconut or Vegetables", "Red chillies", "Tamarind");
  } else if (nameLower.includes("vada") || nameLower.includes("bonda")) {
    baseIngredients.push("Urad dal or Gram flour", "Onions", "Green chillies", "Curry leaves");
  } else if (nameLower.includes("murukku") || nameLower.includes("sev") || nameLower.includes("thenkuzhal")) {
    baseIngredients.push("Rice flour", "Urad dal flour", "Butter", "Sesame seeds", "Cumin seeds");
  } else if (nameLower.includes("samosa") || nameLower.includes("kachori")) {
    baseIngredients.push("All-purpose flour", "Potatoes or Dal", "Spices", "Oil for frying");
  } else if (nameLower.includes("bhel") || nameLower.includes("puri") && nameLower.includes("pani")) {
    baseIngredients.push("Puffed rice", "Sev", "Onions", "Tomatoes", "Tamarind chutney", "Mint chutney");
  } else if (nameLower.includes("chips") || nameLower.includes("vadam") || nameLower.includes("vathal")) {
    baseIngredients.push("Main vegetable or fruit", "Salt", "Turmeric", "Oil for frying");
  } else if (nameLower.includes("chivda") || nameLower.includes("pori")) {
    baseIngredients.push("Poha or Puffed rice", "Peanuts", "Curry leaves", "Mustard seeds", "Chilli powder");
  } else if (nameLower.includes("coffee") || nameLower.includes("tea")) {
    baseIngredients.push("Coffee powder or Tea leaves", "Milk", "Sugar", "Water");
  } else if (nameLower.includes("buttermilk") || nameLower.includes("neer mor") || nameLower.includes("lassi")) {
    baseIngredients.push("Curd or Yogurt", "Water", "Salt or Sugar", "Spices");
  } else if (nameLower.includes("juice") || nameLower.includes("shake")) {
    baseIngredients.push("Fruit", "Sugar or Honey", "Water or Milk", "Ice");
  } else if (nameLower.includes("milk") && !nameLower.includes("payasam")) {
    baseIngredients.push("Milk", "Sugar", "Flavoring ingredients", "Nuts");
  } else if (nameLower.includes("panagam") || nameLower.includes("jaggery water")) {
    baseIngredients.push("Jaggery", "Water", "Ginger", "Lemon", "Cardamom");
  } else {
    baseIngredients.push("Main ingredient", "Spices", "Oil");
  }

  if (category === "Vegetarian" && !nameLower.includes("chicken") && !nameLower.includes("mutton") && !nameLower.includes("beef") && !nameLower.includes("fish") && !nameLower.includes("egg")) {
    baseIngredients.push("Vegetables");
  }

  return baseIngredients;
}

// Generate steps based on recipe type
function generateSteps(recipeName: string, region: string, category: string): string[] {
  const nameLower = recipeName.toLowerCase();
  const steps: string[] = [];

  if (nameLower.includes("sambar")) {
    steps.push("Cook toor dal until soft and mushy");
    steps.push("Prepare tamarind extract and set aside");
    steps.push("Heat oil and add mustard seeds, fenugreek, and curry leaves");
    steps.push("Add vegetables and sauté for 2-3 minutes");
    steps.push("Add sambar powder, turmeric, and salt");
    steps.push("Pour tamarind extract and let it boil");
    steps.push("Add cooked dal and mix well");
    steps.push("Simmer for 5-10 minutes until flavors blend");
    steps.push("Garnish with coriander leaves and serve hot");
  } else if (nameLower.includes("rasam")) {
    steps.push("Extract tamarind juice and set aside");
    steps.push("Heat oil in a pan and add mustard seeds, cumin, and curry leaves");
    steps.push("Add chopped tomatoes and cook until soft");
    steps.push("Add rasam powder, turmeric, and salt");
    steps.push("Pour tamarind extract and add water");
    steps.push("Let it boil for 5-7 minutes");
    steps.push("Add black pepper powder and mix well");
    steps.push("Garnish with coriander leaves and serve hot");
  } else if (nameLower.includes("kuzhambu")) {
    steps.push("Soak tamarind in warm water and extract juice");
    steps.push("Heat oil and add mustard seeds, fenugreek, and curry leaves");
    if (category === "Non-Vegetarian") {
      steps.push("Add meat and cook until tender");
    } else {
      steps.push("Add vegetables and sauté");
    }
    steps.push("Add turmeric, red chilli powder, and salt");
    steps.push("Pour tamarind extract and let it boil");
    steps.push("Add kuzhambu powder and mix well");
    steps.push("Simmer until oil separates");
    steps.push("Garnish with coriander and serve");
  } else if (nameLower.includes("kootu")) {
    steps.push("Cook dal until soft");
    steps.push("Add chopped vegetables and cook until tender");
    steps.push("Grind coconut, cumin, and green chillies to a paste");
    steps.push("Add the paste to the cooked vegetables");
    steps.push("Season with salt and let it simmer");
    steps.push("Heat oil and temper with mustard seeds and curry leaves");
    steps.push("Add the tempering to kootu and mix well");
    steps.push("Serve hot with rice");
  } else if (nameLower.includes("chicken") || nameLower.includes("mutton") || nameLower.includes("beef")) {
    const meatType = nameLower.includes("chicken") ? "chicken" : nameLower.includes("mutton") ? "mutton" : "beef";
    steps.push(`Clean and cut the ${meatType} into pieces`);
    steps.push("Marinate with turmeric, red chilli powder, and salt for 30 minutes");
    steps.push("Heat oil and add whole spices");
    steps.push("Add sliced onions and sauté until golden");
    steps.push("Add ginger-garlic paste and cook until raw smell disappears");
    steps.push("Add tomatoes and cook until soft");
    steps.push("Add regional spice powder and mix well");
    steps.push(`Add marinated ${meatType} and cook on high heat`);
    steps.push("Add water, cover and cook until meat is tender");
    steps.push("Garnish with coriander leaves and serve hot");
  } else if (nameLower.includes("fish") || nameLower.includes("meen")) {
    steps.push("Clean and cut fish into pieces");
    steps.push("Marinate with turmeric and salt");
    steps.push("Soak tamarind and extract juice");
    steps.push("Heat oil and add mustard seeds, fenugreek, and curry leaves");
    steps.push("Add onions and sauté until translucent");
    steps.push("Add tomatoes and cook until soft");
    steps.push("Add fish curry powder, turmeric, and salt");
    steps.push("Pour tamarind extract and let it boil");
    steps.push("Gently add fish pieces and cook for 10-15 minutes");
    steps.push("Garnish with coriander and serve");
  } else if (nameLower.includes("dosa") || nameLower.includes("idli")) {
    steps.push("Soak rice and urad dal separately for 4-6 hours");
    steps.push("Grind urad dal to smooth batter");
    steps.push("Grind rice to slightly coarse texture");
    steps.push("Mix both batters together");
    steps.push("Add salt and fenugreek seeds");
    steps.push("Ferment overnight in warm place");
    if (nameLower.includes("dosa")) {
      steps.push("Heat tawa and spread batter in circular motion");
      steps.push("Drizzle oil and cook until golden and crispy");
      steps.push("Serve hot with chutney and sambar");
    } else {
      steps.push("Pour batter into idli moulds");
      steps.push("Steam for 10-12 minutes");
      steps.push("Serve hot with chutney and sambar");
    }
  } else if (nameLower.includes("pongal")) {
    steps.push("Wash rice and moong dal together");
    steps.push("Pressure cook with water until soft");
    steps.push("Heat ghee in a pan");
    steps.push("Add black pepper, cumin, and cashews");
    steps.push("Fry until cashews turn golden");
    steps.push("Add curry leaves and mix");
    steps.push("Add the tempering to cooked rice-dal mixture");
    steps.push("Mix well and serve hot");
  } else if (nameLower.includes("rice")) {
    steps.push("Cook rice and let it cool");
    steps.push("Heat oil and add mustard seeds, urad dal, and curry leaves");
    steps.push("Add peanuts and fry until golden");
    if (nameLower.includes("lemon")) {
      steps.push("Add lemon juice, turmeric, and salt");
    } else if (nameLower.includes("tamarind") || nameLower.includes("puli")) {
      steps.push("Add tamarind extract, turmeric, and salt");
    } else if (nameLower.includes("coconut") || nameLower.includes("thengai")) {
      steps.push("Add grated coconut, green chillies, and salt");
    }
    steps.push("Mix well with cooked rice");
    steps.push("Garnish with coriander and serve");
  } else if (nameLower.includes("payasam") || nameLower.includes("kheer")) {
    steps.push("Heat ghee in a pan");
    steps.push("Roast vermicelli or main ingredient until golden");
    steps.push("Boil milk in a heavy-bottomed pan");
    steps.push("Add roasted ingredient to boiling milk");
    steps.push("Cook until soft and milk reduces");
    steps.push("Add sugar and cardamom powder");
    steps.push("Fry cashews and raisins in ghee");
    steps.push("Garnish with fried nuts and serve warm");
  } else if (nameLower.includes("vada") || nameLower.includes("bonda")) {
    steps.push("Soak urad dal for 2-3 hours");
    steps.push("Grind to coarse paste without water");
    steps.push("Add chopped onions, green chillies, ginger, and curry leaves");
    steps.push("Add salt and mix well");
    steps.push("Heat oil for deep frying");
    steps.push("Shape into vada or bonda");
    steps.push("Deep fry until golden brown");
    steps.push("Serve hot with chutney");
  } else if (nameLower.includes("murukku") || nameLower.includes("sev") || nameLower.includes("thenkuzhal")) {
    steps.push("Mix rice flour, urad dal flour, and spices");
    steps.push("Add butter and knead into smooth dough");
    steps.push("Add water gradually to make pliable dough");
    steps.push("Heat oil for deep frying");
    steps.push("Press dough through murukku maker into hot oil");
    steps.push("Fry until golden and crispy");
    steps.push("Drain and cool completely");
    steps.push("Store in airtight container");
  } else if (nameLower.includes("samosa") || nameLower.includes("kachori")) {
    steps.push("Prepare dough with all-purpose flour and water");
    steps.push("Make filling with potatoes or dal and spices");
    steps.push("Roll dough into small circles");
    steps.push("Fill with prepared filling");
    steps.push("Seal edges properly");
    steps.push("Heat oil for deep frying");
    steps.push("Fry until golden brown and crispy");
    steps.push("Serve hot with chutney");
  } else if (nameLower.includes("bhel") || nameLower.includes("puri") && nameLower.includes("pani")) {
    steps.push("Prepare tamarind and mint chutneys");
    steps.push("Chop onions, tomatoes, and coriander");
    steps.push("Mix puffed rice with sev and chopped vegetables");
    steps.push("Add chutneys and mix well");
    steps.push("Add spices and lemon juice");
    steps.push("Garnish with coriander and serve immediately");
  } else if (nameLower.includes("chips") || nameLower.includes("vadam") || nameLower.includes("vathal")) {
    steps.push("Slice vegetables or fruits thinly");
    steps.push("Soak in salt water with turmeric");
    steps.push("Drain and dry in sun or dehydrator");
    steps.push("Heat oil for deep frying");
    steps.push("Fry until crispy and golden");
    steps.push("Drain excess oil");
    steps.push("Cool and store in airtight container");
  } else if (nameLower.includes("chivda") || nameLower.includes("pori")) {
    steps.push("Heat oil in a pan");
    steps.push("Add mustard seeds, curry leaves, and peanuts");
    steps.push("Fry until peanuts are golden");
    steps.push("Add poha or puffed rice");
    steps.push("Add salt and chilli powder");
    steps.push("Mix well and roast for 2-3 minutes");
    steps.push("Cool completely and store");
  } else if (nameLower.includes("coffee") || nameLower.includes("tea")) {
    steps.push("Boil water in a vessel");
    if (nameLower.includes("coffee")) {
      steps.push("Add coffee powder to filter");
      steps.push("Pour hot water through filter");
      steps.push("Boil milk separately");
      steps.push("Mix decoction with hot milk and sugar");
      steps.push("Serve hot");
    } else {
      steps.push("Add tea leaves to boiling water");
      steps.push("Add milk and sugar");
      steps.push("Boil for 2-3 minutes");
      steps.push("Strain and serve hot");
    }
  } else if (nameLower.includes("buttermilk") || nameLower.includes("neer mor") || nameLower.includes("lassi")) {
    steps.push("Take fresh curd or yogurt");
    steps.push("Add water and whisk well");
    if (nameLower.includes("sweet")) {
      steps.push("Add sugar and mix until dissolved");
    } else {
      steps.push("Add salt and spices");
    }
    steps.push("Add flavoring ingredients if needed");
    steps.push("Chill in refrigerator");
    steps.push("Serve cold");
  } else if (nameLower.includes("juice") || nameLower.includes("shake")) {
    steps.push("Wash and prepare fruits");
    steps.push("Extract juice or blend fruits");
    if (nameLower.includes("shake")) {
      steps.push("Add milk and blend until smooth");
    } else {
      steps.push("Strain if needed");
    }
    steps.push("Add sugar or honey to taste");
    steps.push("Add ice cubes");
    steps.push("Serve chilled");
  } else if (nameLower.includes("milk") && !nameLower.includes("payasam")) {
    steps.push("Boil milk in a heavy-bottomed pan");
    steps.push("Add sugar and flavoring ingredients");
    steps.push("Add nuts if required");
    steps.push("Simmer for 5-10 minutes");
    steps.push("Serve warm or chilled");
  } else if (nameLower.includes("panagam") || nameLower.includes("jaggery water")) {
    steps.push("Dissolve jaggery in warm water");
    steps.push("Strain to remove impurities");
    steps.push("Add ginger paste and lemon juice");
    steps.push("Add cardamom powder");
    steps.push("Mix well and chill");
    steps.push("Serve cold");
  } else {
    steps.push("Prepare all ingredients");
    steps.push("Heat oil in a pan");
    steps.push("Add tempering spices");
    steps.push("Add main ingredients");
    steps.push("Add spices and seasonings");
    steps.push("Cook until done");
    steps.push("Garnish and serve hot");
  }

  return steps;
}

// Generate 500 recipes
export function generateTamilNaduRecipes(): ParsedRecipe[] {
  const recipes: ParsedRecipe[] = [];
  const recipeNames = new Set<string>(); // Track recipe names to avoid duplicates
  let recipeId = 1;

  // Generate recipes from templates - each recipe only once
  for (const template of recipeTemplates) {
    if (recipes.length >= 500) break;
    
    // Skip if this recipe name already exists
    if (recipeNames.has(template.name)) continue;
    
    // Create base recipe
    const baseRegion = template.baseRegion === "general" 
      ? regions[recipeId % regions.length] // Use deterministic region assignment
      : template.baseRegion;
    
    const ingredients = generateIngredients(template.name, baseRegion, template.category);
    const steps = generateSteps(template.name, baseRegion, template.category);
    
    const recipeIdStr = `${template.name.toLowerCase().replace(/\s+/g, '-')}-${recipeId}`;
    
    recipes.push({
      id: recipeIdStr,
      name: template.name,
      region: baseRegion,
      category: template.category,
      ingredients,
      steps,
      // Image will be loaded dynamically in the component
    });
    
    recipeNames.add(template.name);
    recipeId++;
  }

  // Fill remaining recipes with additional dishes (ensuring no duplicates)
  const additionalDishes = [
    "Kothu Parotta", "Parotta", "Chapati", "Poori", "Bhatura",
    "Veg Kurma", "Paneer Curry", "Paneer Butter Masala", "Aloo Gobi",
    "Baingan Bharta", "Dal Tadka", "Dal Fry", "Dal Makhani",
    "Gobi Manchurian", "Paneer Manchurian", "Veg Manchurian",
    "Fried Rice", "Noodles", "Pulao", "Jeera Rice", "Ghee Rice",
    "Raita", "Pachadi", "Thayir Pachadi", "Onion Raita", "Cucumber Raita",
    "Pickle", "Mango Pickle", "Lemon Pickle", "Garlic Pickle",
    "Papad", "Appalam", "Vadam", "Vathal",
    "Aviyal", "Thoran", "Mezhukupuratti",
    "Kichadi", "Inji Curry", "Puli Inji",
    "Vathal Kuzhambu", "Sundakkai Kuzhambu", "Manathakkani Vathal",
    "Paruppu Usili", "Keerai Masiyal",
    "Poriyal", "Varuval", "Roast", "Fry",
    "Bajji", "Pakoda",
    "Halwa", "Laddu", "Barfi", "Burfi",
    "Murukku", "Thattai", "Ribbon Pakoda", "Omapodi",
    "Adhirasam", "Jangiri", "Gulab Jamun", "Rasgulla",
    "Pradhaman", "Pal Payasam",
  ];

  let dishIndex = 0;
  while (recipes.length < 500 && dishIndex < additionalDishes.length) {
    const dishName = additionalDishes[dishIndex];
    dishIndex++;
    
    // Skip if this recipe name already exists
    if (recipeNames.has(dishName)) continue;
    
    const region = regions[recipeId % regions.length]; // Deterministic region
    const category = dishIndex % 3 === 0 ? "Non-Vegetarian" : "Vegetarian"; // Mix categories
    
    const ingredients = generateIngredients(dishName, region, category);
    const steps = generateSteps(dishName, region, category);
    
    const recipeIdStr = `${dishName.toLowerCase().replace(/\s+/g, '-')}-${recipeId}`;
    
    recipes.push({
      id: recipeIdStr,
      name: dishName,
      region: region,
      category: category,
      ingredients,
      steps,
      // Image will be loaded dynamically in the component
    });
    
    recipeNames.add(dishName);
    recipeId++;
  }

  return recipes.slice(0, 500);
}

// Generate recipes with error handling
export let allTamilNaduRecipes: ParsedRecipe[] = [];
try {
  allTamilNaduRecipes = generateTamilNaduRecipes();
  console.log(`Generated ${allTamilNaduRecipes.length} recipes`);
} catch (error) {
  console.error('Error generating recipes:', error);
  // Fallback to empty array to prevent app crash
  allTamilNaduRecipes = [];
}

