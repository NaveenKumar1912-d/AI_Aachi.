/**
 * Script to extract and parse recipes from the uploaded zip file
 * Run this once to generate the recipes JSON file
 */

import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';

const zip = new AdmZip('./public/data/tamilnadu_recipes.zip');
const zipEntries = zip.getEntries();

const recipes = [];
const images = {};

// Extract all images first
zipEntries.forEach((entry) => {
  if (entry.entryName.includes('images/') && entry.entryName.endsWith('.png')) {
    const imageName = path.basename(entry.entryName);
    const imageData = entry.getData();
    const imagePath = `./public/images/recipes/${imageName}`;
    
    // Ensure directory exists
    fs.mkdirSync('./public/images/recipes', { recursive: true });
    fs.writeFileSync(imagePath, imageData);
    
    // Store mapping
    images[imageName] = `/images/recipes/${imageName}`;
    console.log(`Extracted image: ${imageName}`);
  }
});

// Parse all recipe text files
zipEntries.forEach((entry) => {
  if (entry.entryName.endsWith('.txt')) {
    const content = entry.getData().toString('utf8');
    const lines = content.split('\n').map(line => line.trim()).filter(Boolean);
    
    const recipe = {
      id: '',
      name: '',
      region: '',
      category: '',
      ingredients: [],
      steps: [],
      image: null
    };
    
    let currentSection = '';
    
    lines.forEach(line => {
      if (line.startsWith('Recipe Name:')) {
        recipe.name = line.replace('Recipe Name:', '').trim();
        recipe.id = recipe.name.toLowerCase().replace(/\s+/g, '-');
      } else if (line.startsWith('Region Style:')) {
        recipe.region = line.replace('Region Style:', '').trim();
      } else if (line.startsWith('Category:')) {
        recipe.category = line.replace('Category:', '').trim();
      } else if (line === 'Ingredients:') {
        currentSection = 'ingredients';
      } else if (line === 'Steps:') {
        currentSection = 'steps';
      } else if (line.startsWith('-') && currentSection === 'ingredients') {
        recipe.ingredients.push(line.replace('-', '').trim());
      } else if (line.match(/^\d+\./) && currentSection === 'steps') {
        recipe.steps.push(line.replace(/^\d+\.\s*/, '').trim());
      }
    });
    
    // Try to find matching image
    const possibleImageName = `${recipe.name}_1.png`;
    if (images[possibleImageName]) {
      recipe.image = images[possibleImageName];
    }
    
    if (recipe.name) {
      recipes.push(recipe);
    }
  }
});

// Save to JSON file
const outputPath = './src/data/tamilnadu-recipes.json';
fs.writeFileSync(outputPath, JSON.stringify(recipes, null, 2));

console.log(`\n✅ Extracted ${recipes.length} recipes`);
console.log(`✅ Extracted ${Object.keys(images).length} images`);
console.log(`✅ Saved to ${outputPath}`);
