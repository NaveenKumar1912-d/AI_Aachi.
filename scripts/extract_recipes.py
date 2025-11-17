"""
Script to extract and parse recipes from the uploaded zip file
Run this once to generate the recipes JSON file
"""

import zipfile
import json
import os
import re

def extract_recipes():
    """Extract recipes from zip file and generate JSON output"""
    zip_path = './public/data/tamilnadu_recipes.zip'
    output_path = './src/data/tamilnadu-recipes.json'
    images_dir = './public/images/recipes'
    
    # Ensure images directory exists
    os.makedirs(images_dir, exist_ok=True)
    
    recipes = []
    images = {}
    
    # Open and process the zip file
    with zipfile.ZipFile(zip_path, 'r') as zip_file:
        # Extract all images first
        for entry_name in zip_file.namelist():
            if 'images/' in entry_name and entry_name.endswith('.png'):
                image_name = os.path.basename(entry_name)
                image_data = zip_file.read(entry_name)
                image_path = os.path.join(images_dir, image_name)
                
                # Write image file
                with open(image_path, 'wb') as img_file:
                    img_file.write(image_data)
                
                # Store mapping
                images[image_name] = f'/images/recipes/{image_name}'
                print(f'Extracted image: {image_name}')
        
        # Parse all recipe text files
        for entry_name in zip_file.namelist():
            if entry_name.endswith('.txt'):
                content = zip_file.read(entry_name).decode('utf-8')
                lines = [line.strip() for line in content.split('\n') if line.strip()]
                
                recipe = {
                    'id': '',
                    'name': '',
                    'region': '',
                    'category': '',
                    'ingredients': [],
                    'steps': [],
                    'image': None
                }
                
                current_section = ''
                
                for line in lines:
                    if line.startswith('Recipe Name:'):
                        recipe['name'] = line.replace('Recipe Name:', '').strip()
                        recipe['id'] = recipe['name'].lower().replace(' ', '-')
                    elif line.startswith('Region Style:'):
                        recipe['region'] = line.replace('Region Style:', '').strip()
                    elif line.startswith('Category:'):
                        recipe['category'] = line.replace('Category:', '').strip()
                    elif line == 'Ingredients:':
                        current_section = 'ingredients'
                    elif line == 'Steps:':
                        current_section = 'steps'
                    elif line.startswith('-') and current_section == 'ingredients':
                        recipe['ingredients'].append(line.replace('-', '', 1).strip())
                    elif re.match(r'^\d+\.', line) and current_section == 'steps':
                        recipe['steps'].append(re.sub(r'^\d+\.\s*', '', line).strip())
                
                # Try to find matching image
                possible_image_name = f"{recipe['name']}_1.png"
                if possible_image_name in images:
                    recipe['image'] = images[possible_image_name]
                
                if recipe['name']:
                    recipes.append(recipe)
    
    # Save to JSON file
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(recipes, f, indent=2, ensure_ascii=False)
    
    print(f'\n✅ Extracted {len(recipes)} recipes')
    print(f'✅ Extracted {len(images)} images')
    print(f'✅ Saved to {output_path}')

if __name__ == '__main__':
    extract_recipes()

