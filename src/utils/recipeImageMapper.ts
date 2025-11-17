// Import recipe images
import dosaImg from "@/assets/dosa.jpg";
import idliImg from "@/assets/idli.jpg";
import sambarImg from "@/assets/sambar.jpg";
import rasamImg from "@/assets/rasam.jpg";
import pongalImg from "@/assets/pongal.jpg";
import payasamImg from "@/assets/payasam.jpg";
import vadaImg from "@/assets/vada.jpg";
import chettinadChickenImg from "@/assets/chettinad-chicken.jpg";
import { generateRecipeImage } from "./geminiImageGenerator";

// Import step images
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

/**
 * Maps recipe names to available images in the assets folder
 */
const recipeImageMap: Record<string, string> = {
  // Dosa variations
  'dosa': dosaImg,
  'masala dosa': dosaImg,
  'rava dosa': dosaImg,
  'onion dosa': dosaImg,
  
  // Idli variations
  'idli': idliImg,
  'rava idli': idliImg,
  'kanchipuram idli': idliImg,
  
  // Sambar variations
  'sambar': sambarImg,
  'kongu nadu sambar': sambarImg,
  'chola nadu sambar': sambarImg,
  'arachuvitta sambar': sambarImg,
  'kootu sambar': sambarImg,
  'paruppu sambar': sambarImg,
  'keerai sambar': sambarImg,
  'vendakkai sambar': sambarImg,
  'kathrikai sambar': sambarImg,
  'murungakkai sambar': sambarImg,
  
  // Rasam variations
  'rasam': rasamImg,
  'tomato rasam': rasamImg,
  'pepper rasam': rasamImg,
  'lemon rasam': rasamImg,
  'pineapple rasam': rasamImg,
  'jeera rasam': rasamImg,
  'garlic rasam': rasamImg,
  'mysore rasam': rasamImg,
  'paruppu rasam': rasamImg,
  
  // Pongal variations
  'pongal': pongalImg,
  'ven pongal': pongalImg,
  'sweet pongal': pongalImg,
  
  // Payasam/Kheer variations
  'payasam': payasamImg,
  'semiya payasam': payasamImg,
  'aval payasam': payasamImg,
  'rice payasam': payasamImg,
  'wheat payasam': payasamImg,
  'badam payasam': payasamImg,
  'kheer': payasamImg,
  'pal payasam': payasamImg,
  'pradhaman': payasamImg,
  
  // Vada variations
  'vada': vadaImg,
  'medu vada': vadaImg,
  'masala vada': vadaImg,
  'paruppu vada': vadaImg,
  'bonda': vadaImg,
  'urad dal bonda': vadaImg,
  'potato bonda': vadaImg,
  
  // Chicken variations
  'chicken': chettinadChickenImg,
  'chettinad chicken': chettinadChickenImg,
  'madurai chicken': chettinadChickenImg,
  'kongu nadu chicken': chettinadChickenImg,
  'chola nadu chicken': chettinadChickenImg,
  'tanjore chicken': chettinadChickenImg,
  'pandya nadu chicken': chettinadChickenImg,
  'nadu nadu chicken': chettinadChickenImg,
  'chicken curry': chettinadChickenImg,
  'chicken kuzhambu': chettinadChickenImg,
  'chicken peratal': chettinadChickenImg,
  'chicken varuval': chettinadChickenImg,
  'chicken 65': chettinadChickenImg,
  'chicken biryani': chettinadChickenImg,
  
  // Mutton variations (use chicken image as fallback)
  'mutton': chettinadChickenImg,
  'chettinad mutton': chettinadChickenImg,
  'mutton curry': chettinadChickenImg,
  'mutton kuzhambu': chettinadChickenImg,
  'mutton peratal': chettinadChickenImg,
  'mutton biryani': chettinadChickenImg,
  
  // Fish variations (use chicken image as fallback)
  'fish': chettinadChickenImg,
  'fish curry': chettinadChickenImg,
  'fish kuzhambu': chettinadChickenImg,
  'meen kuzhambu': chettinadChickenImg,
  'fish fry': chettinadChickenImg,
  'fish peratal': chettinadChickenImg,
};

/**
 * Simple hash function to convert string to number
 * This ensures consistent image assignment for the same recipe
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * All available recipe images
 * Each recipe will get a different image based on hash of its ID/name
 */
const allRecipeImages = [
  dosaImg,
  idliImg,
  sambarImg,
  rasamImg,
  pongalImg,
  payasamImg,
  vadaImg,
  chettinadChickenImg,
];

/**
 * Get image index based on recipe identifier
 * This ensures each recipe gets a unique, consistent image
 */
function getImageIndex(recipeId: string, recipeName: string): number {
  // Combine ID and name for better distribution
  const combined = `${recipeId}-${recipeName}`;
  const hash = hashString(combined);
  return hash % allRecipeImages.length;
}

/**
 * Get image path for a recipe name (synchronous - uses local assets)
 * Uses intelligent matching first, then hash-based assignment for unique images
 */
export function getRecipeImage(recipeName: string, recipeId?: string): string | null {
  if (!recipeName) return null;
  
  const normalizedName = recipeName.toLowerCase().trim();
  
  // Direct match - try exact match first
  if (recipeImageMap[normalizedName]) {
    return recipeImageMap[normalizedName];
  }
  
  // Remove region prefixes for better matching
  const nameWithoutRegion = normalizedName
    .replace(/^(kongu nadu|chola nadu|chettinad|madurai|tanjore|pandya nadu|nanjil nadu|nadu nadu|thondai nadu|pallava nadu)\s+/i, '')
    .trim();
  
  // Try match without region prefix
  if (nameWithoutRegion !== normalizedName && recipeImageMap[nameWithoutRegion]) {
    return recipeImageMap[nameWithoutRegion];
  }
  
  // Partial match - check if recipe name contains any key
  for (const [key, imagePath] of Object.entries(recipeImageMap)) {
    // Check if the key is contained in the recipe name or vice versa
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return imagePath;
    }
    // Also check without region prefix
    if (nameWithoutRegion.includes(key) || key.includes(nameWithoutRegion)) {
      return imagePath;
    }
  }
  
  // Category-based fallback matching
  const categoryKeywords: Record<string, string> = {
    'dosa': dosaImg,
    'idli': idliImg,
    'sambar': sambarImg,
    'rasam': rasamImg,
    'pongal': pongalImg,
    'payasam': payasamImg,
    'kheer': payasamImg,
    'vada': vadaImg,
    'bonda': vadaImg,
    'chicken': chettinadChickenImg,
    'mutton': chettinadChickenImg,
    'beef': chettinadChickenImg,
    'fish': chettinadChickenImg,
    'meen': chettinadChickenImg,
    'prawn': chettinadChickenImg,
    'crab': chettinadChickenImg,
    'egg': chettinadChickenImg,
  };
  
  for (const [keyword, imagePath] of Object.entries(categoryKeywords)) {
    if (normalizedName.includes(keyword) || nameWithoutRegion.includes(keyword)) {
      return imagePath;
    }
  }
  
  // Hash-based assignment for unique images per recipe
  // This ensures each recipe gets a different, consistent image
  // Use recipeId if provided for better uniqueness
  const imageIndex = getImageIndex(recipeId || recipeName, recipeName);
  
  return allRecipeImages[imageIndex];
}

/**
 * Get image path for a recipe using Gemini API (async)
 * Falls back to local assets if Gemini generation fails
 */
export async function getRecipeImageFromGemini(
  recipeName: string,
  recipeId?: string,
  region?: string,
  category?: string
): Promise<string | null> {
  if (!recipeName) return null;
  
  // Try to generate image from Gemini API
  try {
    const geminiImage = await generateRecipeImage(recipeName, region, category);
    if (geminiImage) {
      return geminiImage;
    }
  } catch (error) {
    console.error('Error fetching Gemini image:', error);
  }
  
  // Fallback to local image mapping
  return getRecipeImage(recipeName, recipeId);
}

/**
 * Get step images for a recipe
 */
export function getRecipeStepImages(recipeName: string, stepNumber: number): string | null {
  if (!recipeName) return null;
  
  const normalizedName = recipeName.toLowerCase().trim();
  const stepImageMap: Record<string, string[]> = {
    'dosa': [dosaStep1, dosaStep2, dosaStep3],
    'idli': [idliStep1, idliStep2, idliStep3, idliStep4, idliStep5],
    'sambar': [sambarStep1, sambarStep2, sambarStep3, sambarStep4],
    'rasam': [rasamStep1, rasamStep2, rasamStep3],
    'pongal': [pongalStep1, pongalStep2, pongalStep3],
    'payasam': [payasamStep1, payasamStep2, payasamStep3],
    'vada': [vadaStep1, vadaStep2, vadaStep3],
    'chicken': [chickenStep1, chickenStep2, chickenStep3],
  };
  
  // Find matching recipe
  for (const [key, images] of Object.entries(stepImageMap)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      const stepIndex = stepNumber - 1;
      if (stepIndex >= 0 && stepIndex < images.length) {
        return images[stepIndex];
      }
    }
  }
  
  return null;
}

