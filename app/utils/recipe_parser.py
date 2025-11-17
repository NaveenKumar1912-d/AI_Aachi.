"""
Recipe parsing utilities
"""
import re
from typing import Optional, Dict, List


class ParsedRecipe:
    """Parsed recipe data structure"""
    def __init__(self):
        self.id: str = ""
        self.name: str = ""
        self.region: str = ""
        self.category: str = ""
        self.ingredients: List[str] = []
        self.steps: List[str] = []
        self.image: Optional[str] = None
        self.cook_time: Optional[str] = None
        self.servings: Optional[str] = None
        self.tips: List[str] = []

    def to_dict(self) -> Dict:
        """Convert to dictionary"""
        return {
            "id": self.id,
            "name": self.name,
            "region": self.region,
            "category": self.category,
            "ingredients": self.ingredients,
            "steps": self.steps,
            "image": self.image,
            "cookTime": self.cook_time,
            "servings": self.servings,
            "tips": self.tips if self.tips else None
        }


def parse_recipe_text(content: str, recipe_name: str) -> ParsedRecipe:
    """Parse recipe text content from uploaded recipe files"""
    lines = [line.strip() for line in content.split('\n') if line.strip()]
    
    recipe = ParsedRecipe()
    recipe.id = recipe_name.lower().replace(' ', '-')
    current_section = ''
    
    for line in lines:
        if line.startswith('Recipe Name:'):
            recipe.name = line.replace('Recipe Name:', '').strip()
        elif line.startswith('Region Style:'):
            recipe.region = line.replace('Region Style:', '').strip()
        elif line.startswith('Category:'):
            recipe.category = line.replace('Category:', '').strip()
        elif line == 'Ingredients:':
            current_section = 'ingredients'
        elif line == 'Steps:':
            current_section = 'steps'
        elif line.startswith('-') and current_section == 'ingredients':
            recipe.ingredients.append(line.replace('-', '', 1).strip())
        elif re.match(r'^\d+\.', line) and current_section == 'steps':
            recipe.steps.append(re.sub(r'^\d+\.\s*', '', line).strip())
    
    return recipe


def parse_recipe_from_ai_response(text: str) -> Optional[ParsedRecipe]:
    """Parse recipe from AI chat response text"""
    try:
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        if not lines:
            return None
        
        recipe = ParsedRecipe()
        
        # Extract recipe name (usually first line)
        name = lines[0] if lines else 'Recipe'
        name = re.sub(r'^(Recipe:|Recipe Name:|\[|\])', '', name, flags=re.IGNORECASE).strip()
        recipe.name = name
        recipe.id = name.lower().replace(' ', '-')
        
        # Find sections
        ingredients_start = next((i for i, line in enumerate(lines) 
                                 if re.match(r'^Ingredients:', line, re.IGNORECASE)), -1)
        steps_start = next((i for i, line in enumerate(lines) 
                           if re.match(r'^(Steps:|Instructions:|Step-by-step|Method:)', line, re.IGNORECASE)), -1)
        
        # Extract ingredients
        if ingredients_start != -1 and steps_start != -1:
            for i in range(ingredients_start + 1, steps_start):
                ingredient = re.sub(r'^[-•*]\s*', '', lines[i]).strip()
                if ingredient and not re.match(r'^(Steps|Instructions|Method):', ingredient, re.IGNORECASE):
                    recipe.ingredients.append(ingredient)
        
        # Extract steps
        if steps_start != -1:
            for i in range(steps_start + 1, len(lines)):
                line = lines[i]
                if not line:
                    continue
                
                # Stop if we hit other sections
                if re.match(r'^(Cooking Time:|Serves:|Tips:|Notes:)', line, re.IGNORECASE):
                    break
                
                # Remove step numbering and bullet points
                step = re.sub(r'^(\d+\.|[-•*])\s*', '', line).strip()
                if step and len(step) > 5:
                    recipe.steps.append(step)
        
        # Extract metadata
        cook_time_match = re.search(r'Cooking Time:\s*(.+?)(?:\n|$)', text, re.IGNORECASE)
        servings_match = re.search(r'Serves?:\s*(.+?)(?:\n|$)', text, re.IGNORECASE)
        
        if cook_time_match:
            recipe.cook_time = cook_time_match.group(1).strip()
        if servings_match:
            recipe.servings = servings_match.group(1).strip()
        
        # Extract tips
        tips_start = next((i for i, line in enumerate(lines) 
                          if re.match(r'^Tips:', line, re.IGNORECASE)), -1)
        if tips_start != -1:
            for i in range(tips_start + 1, len(lines)):
                tip = re.sub(r'^[-•*]\s*', '', lines[i]).strip()
                if tip and len(tip) > 5:
                    recipe.tips.append(tip)
        
        if not recipe.steps:
            return None
        
        return recipe
    except Exception as e:
        print(f'Error parsing recipe: {e}')
        return None

