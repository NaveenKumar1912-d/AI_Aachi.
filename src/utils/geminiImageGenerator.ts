/**
 * Utility to generate recipe images using Gemini API
 */

interface GeminiImageResponse {
  success: boolean;
  imageUrl?: string | null;
  description?: string;
  recipeName: string;
  error?: string;
  fallback?: boolean;
}

// Cache for generated images to avoid repeated API calls
const imageCache = new Map<string, string>();

/**
 * Generate recipe image using Gemini API
 */
export async function generateRecipeImage(
  recipeName: string,
  region?: string,
  category?: string
): Promise<string | null> {
  // Check cache first
  const cacheKey = `${recipeName}-${region || ''}-${category || ''}`;
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey) || null;
  }

  try {
    const response = await fetch('/api/generate-recipe-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipeName,
        region,
        category,
      }),
    });

    if (!response.ok) {
      console.error('Failed to generate image:', response.statusText);
      return null;
    }

    const data: GeminiImageResponse = await response.json();

    if (data.success && data.imageUrl) {
      // Cache the image URL
      imageCache.set(cacheKey, data.imageUrl);
      return data.imageUrl;
    }

    // If image generation is in progress or failed, return null
    // The fallback image mapper will handle it
    return null;
  } catch (error) {
    console.error('Error generating recipe image:', error);
    return null;
  }
}

/**
 * Batch generate images for multiple recipes
 */
export async function generateRecipeImages(
  recipes: Array<{ name: string; region?: string; category?: string }>
): Promise<Map<string, string>> {
  const imageMap = new Map<string, string>();
  
  // Generate images in batches to avoid overwhelming the API
  const batchSize = 5;
  for (let i = 0; i < recipes.length; i += batchSize) {
    const batch = recipes.slice(i, i + batchSize);
    
    await Promise.all(
      batch.map(async (recipe) => {
        const imageUrl = await generateRecipeImage(
          recipe.name,
          recipe.region,
          recipe.category
        );
        if (imageUrl) {
          imageMap.set(recipe.name, imageUrl);
        }
      })
    );
    
    // Small delay between batches to respect rate limits
    if (i + batchSize < recipes.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  
  return imageMap;
}

/**
 * Clear the image cache
 */
export function clearImageCache(): void {
  imageCache.clear();
}

