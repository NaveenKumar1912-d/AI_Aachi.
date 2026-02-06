
export enum HealthCondition {
  Diabetes = 'Diabetes',
  BP = 'High BP',
  PCOS = 'PCOS',
  Obesity = 'Obesity',
  HeartIssues = 'Heart Issues',
  Thyroid = 'Thyroid',
  AcidReflux = 'Acid Reflux',
  Cholesterol = 'High Cholesterol',
  CKD = 'Kidney Issues (CKD)',
  Gout = 'Gout',
  None = 'None'
}

export enum Allergy {
  Nuts = 'Nuts',
  Lactose = 'Lactose',
  Gluten = 'Gluten',
  Egg = 'Egg',
  Seafood = 'Seafood',
  Soy = 'Soy',
  Sesame = 'Sesame',
  Mustard = 'Mustard',
  Sulfites = 'Sulfites'
}

export enum CookingMode {
  Balanced = 'Balanced Mode',
  Quick = 'Quick Fix',
  Traditional = 'Traditional Slow',
  Healthy = 'Healthy Choice'
}

export interface Feedback {
  recipeName: string;
  issue: 'burnt' | 'too spicy' | 'watery' | 'undercooked' | 'too oily' | 'perfect';
  comment?: string;
  timestamp: number;
}

export interface UserDNA {
  name: string;
  email: string;
  spiceTolerance: number; // 1-5
  oilUsage: number; // 1-5
  saltTolerance: number; // 1-5
  cookingSpeed: 'slow' | 'medium' | 'fast';
  healthConditions: HealthCondition[];
  allergies: Allergy[];
  customHealthNotes?: string;
  customAllergyNotes?: string;
  budget: number;
  onePotEnabled: boolean;
  history: Feedback[];
}

export interface SelectedIngredient {
  name: string;
  quantity: number;
}

export interface CostItem {
  name: string;
  cost: number;
}

export interface Recipe {
  name: string;
  nameTamil: string;
  ingredientsUsed: string[];
  method: string[];
  methodTamil: string[];
  cookingTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  healthSuitability: string;
  allergySafety: string;
  totalCost: number;
  costBreakdown: CostItem[];
  budgetStatus: 'Within budget' | 'Slightly over budget' | 'Exceeds budget';
  savingTips: string[];
  warnings: string[];
  aiDecisionExplanation: string;
}
