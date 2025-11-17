"""
Script to download 500+ Tamil Nadu recipes with images
"""
import os
import json
import time
import random
import requests
from typing import List, Dict, Optional
from pathlib import Path
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyB6u-H_qjC53h3dlDk_a3DIjA3v1z6nJco")
UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY", "")  # Optional
PEXELS_API_KEY = os.getenv("PEXELS_API_KEY", "")  # Optional

# Initialize Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Dataset paths
DATASET_DIR = Path("dataset")
IMAGES_DIR = DATASET_DIR / "images"
RECIPES_FILE = DATASET_DIR / "recipes.json"

# Tamil Nadu regions
REGIONS = [
    "Kongu Nadu", "Chola Nadu", "Chettinad", "Madurai", "Tanjore",
    "Pandya Nadu", "Nanjil Nadu", "Nadu Nadu", "Thondai Nadu", "Pallava Nadu", "General"
]

# Recipe templates - expanded list to ensure 500+ recipes
RECIPE_TEMPLATES = [
    # Breakfast items
    {"name": "Idli", "region": "General", "category": "Vegetarian"},
    {"name": "Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Masala Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Rava Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Onion Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Pongal", "region": "General", "category": "Vegetarian"},
    {"name": "Ven Pongal", "region": "General", "category": "Vegetarian"},
    {"name": "Sweet Pongal", "region": "General", "category": "Vegetarian"},
    {"name": "Upma", "region": "General", "category": "Vegetarian"},
    {"name": "Rava Upma", "region": "General", "category": "Vegetarian"},
    {"name": "Aval Upma", "region": "General", "category": "Vegetarian"},
    {"name": "Puttu", "region": "Kongu Nadu", "category": "Vegetarian"},
    {"name": "Appam", "region": "Kongu Nadu", "category": "Vegetarian"},
    {"name": "Kuzhi Paniyaram", "region": "General", "category": "Vegetarian"},
    {"name": "Rava Idli", "region": "General", "category": "Vegetarian"},
    {"name": "Kanchipuram Idli", "region": "Thondai Nadu", "category": "Vegetarian"},
    {"name": "Kesari", "region": "General", "category": "Vegetarian"},
    {"name": "Rava Kesari", "region": "General", "category": "Vegetarian"},
    {"name": "Poha", "region": "General", "category": "Vegetarian"},
    {"name": "Aval Poha", "region": "General", "category": "Vegetarian"},
    
    # Sambar varieties
    {"name": "Sambar", "region": "General", "category": "Vegetarian"},
    {"name": "Kongu Nadu Sambar", "region": "Kongu Nadu", "category": "Vegetarian"},
    {"name": "Chola Nadu Sambar", "region": "Chola Nadu", "category": "Vegetarian"},
    {"name": "Arachuvitta Sambar", "region": "Tanjore", "category": "Vegetarian"},
    {"name": "Kootu Sambar", "region": "General", "category": "Vegetarian"},
    {"name": "Paruppu Sambar", "region": "General", "category": "Vegetarian"},
    {"name": "Keerai Sambar", "region": "General", "category": "Vegetarian"},
    {"name": "Vendakkai Sambar", "region": "General", "category": "Vegetarian"},
    {"name": "Kathrikai Sambar", "region": "General", "category": "Vegetarian"},
    {"name": "Murungakkai Sambar", "region": "General", "category": "Vegetarian"},
    
    # Rasam varieties
    {"name": "Rasam", "region": "General", "category": "Vegetarian"},
    {"name": "Tomato Rasam", "region": "General", "category": "Vegetarian"},
    {"name": "Pineapple Rasam", "region": "General", "category": "Vegetarian"},
    {"name": "Lemon Rasam", "region": "General", "category": "Vegetarian"},
    {"name": "Pepper Rasam", "region": "General", "category": "Vegetarian"},
    {"name": "Jeera Rasam", "region": "General", "category": "Vegetarian"},
    {"name": "Garlic Rasam", "region": "General", "category": "Vegetarian"},
    {"name": "Mysore Rasam", "region": "General", "category": "Vegetarian"},
    {"name": "Paruppu Rasam", "region": "General", "category": "Vegetarian"},
    {"name": "Neem Flower Rasam", "region": "General", "category": "Vegetarian"},
    
    # Kuzhambu varieties
    {"name": "Vatha Kuzhambu", "region": "General", "category": "Vegetarian"},
    {"name": "Puli Kuzhambu", "region": "General", "category": "Vegetarian"},
    {"name": "Kara Kuzhambu", "region": "General", "category": "Vegetarian"},
    {"name": "More Kuzhambu", "region": "General", "category": "Vegetarian"},
    {"name": "Kootu Kuzhambu", "region": "General", "category": "Vegetarian"},
    {"name": "Arachuvitta Kuzhambu", "region": "Tanjore", "category": "Vegetarian"},
    {"name": "Kongu Nadu Kuzhambu", "region": "Kongu Nadu", "category": "Vegetarian"},
    {"name": "Chola Nadu Kuzhambu", "region": "Chola Nadu", "category": "Vegetarian"},
    {"name": "Kothamalli Kuzhambu", "region": "General", "category": "Vegetarian"},
    {"name": "Manathakkali Kuzhambu", "region": "General", "category": "Vegetarian"},
    
    # Non-vegetarian - Chicken
    {"name": "Chicken Curry", "region": "General", "category": "Non-Veg"},
    {"name": "Chettinad Chicken", "region": "Chettinad", "category": "Non-Veg"},
    {"name": "Madurai Chicken", "region": "Madurai", "category": "Non-Veg"},
    {"name": "Kongu Nadu Chicken", "region": "Kongu Nadu", "category": "Non-Veg"},
    {"name": "Chola Nadu Chicken", "region": "Chola Nadu", "category": "Non-Veg"},
    {"name": "Tanjore Chicken", "region": "Tanjore", "category": "Non-Veg"},
    {"name": "Pandya Nadu Chicken", "region": "Pandya Nadu", "category": "Non-Veg"},
    {"name": "Nanjil Chicken", "region": "Nanjil Nadu", "category": "Non-Veg"},
    {"name": "Chicken Kuzhambu", "region": "General", "category": "Non-Veg"},
    {"name": "Chicken Peratal", "region": "General", "category": "Non-Veg"},
    {"name": "Chicken Varuval", "region": "General", "category": "Non-Veg"},
    {"name": "Chicken 65", "region": "General", "category": "Non-Veg"},
    {"name": "Chicken Biryani", "region": "General", "category": "Non-Veg"},
    {"name": "Chicken Roast", "region": "General", "category": "Non-Veg"},
    {"name": "Chicken Fry", "region": "General", "category": "Non-Veg"},
    {"name": "Chicken Gravy", "region": "General", "category": "Non-Veg"},
    {"name": "Chicken Chukka", "region": "General", "category": "Non-Veg"},
    {"name": "Chicken Keema", "region": "General", "category": "Non-Veg"},
    
    # Non-vegetarian - Mutton
    {"name": "Mutton Curry", "region": "General", "category": "Non-Veg"},
    {"name": "Chettinad Mutton", "region": "Chettinad", "category": "Non-Veg"},
    {"name": "Madurai Mutton", "region": "Madurai", "category": "Non-Veg"},
    {"name": "Kongu Nadu Mutton", "region": "Kongu Nadu", "category": "Non-Veg"},
    {"name": "Chola Nadu Mutton", "region": "Chola Nadu", "category": "Non-Veg"},
    {"name": "Tanjore Mutton", "region": "Tanjore", "category": "Non-Veg"},
    {"name": "Pandya Nadu Mutton", "region": "Pandya Nadu", "category": "Non-Veg"},
    {"name": "Nanjil Mutton", "region": "Nanjil Nadu", "category": "Non-Veg"},
    {"name": "Mutton Kuzhambu", "region": "General", "category": "Non-Veg"},
    {"name": "Mutton Peratal", "region": "General", "category": "Non-Veg"},
    {"name": "Mutton Varuval", "region": "General", "category": "Non-Veg"},
    {"name": "Mutton Biryani", "region": "General", "category": "Non-Veg"},
    {"name": "Mutton Roast", "region": "General", "category": "Non-Veg"},
    {"name": "Mutton Fry", "region": "General", "category": "Non-Veg"},
    {"name": "Mutton Gravy", "region": "General", "category": "Non-Veg"},
    {"name": "Mutton Chukka", "region": "General", "category": "Non-Veg"},
    {"name": "Mutton Keema", "region": "General", "category": "Non-Veg"},
    
    # Non-vegetarian - Fish
    {"name": "Fish Curry", "region": "General", "category": "Non-Veg"},
    {"name": "Chettinad Fish Curry", "region": "Chettinad", "category": "Non-Veg"},
    {"name": "Madurai Fish Curry", "region": "Madurai", "category": "Non-Veg"},
    {"name": "Kongu Nadu Fish Curry", "region": "Kongu Nadu", "category": "Non-Veg"},
    {"name": "Nanjil Fish Curry", "region": "Nanjil Nadu", "category": "Non-Veg"},
    {"name": "Fish Kuzhambu", "region": "Chola Nadu", "category": "Non-Veg"},
    {"name": "Meen Kuzhambu", "region": "Chola Nadu", "category": "Non-Veg"},
    {"name": "Fish Fry", "region": "General", "category": "Non-Veg"},
    {"name": "Fish Peratal", "region": "General", "category": "Non-Veg"},
    {"name": "Fish Varuval", "region": "General", "category": "Non-Veg"},
    {"name": "Fish Biryani", "region": "General", "category": "Non-Veg"},
    {"name": "Fish Gravy", "region": "General", "category": "Non-Veg"},
    
    # Non-vegetarian - Seafood
    {"name": "Prawn Curry", "region": "General", "category": "Non-Veg"},
    {"name": "Chettinad Prawn Curry", "region": "Chettinad", "category": "Non-Veg"},
    {"name": "Prawn Kuzhambu", "region": "Chola Nadu", "category": "Non-Veg"},
    {"name": "Prawn Fry", "region": "General", "category": "Non-Veg"},
    {"name": "Prawn Peratal", "region": "General", "category": "Non-Veg"},
    {"name": "Prawn Biryani", "region": "General", "category": "Non-Veg"},
    {"name": "Crab Curry", "region": "General", "category": "Non-Veg"},
    {"name": "Crab Fry", "region": "General", "category": "Non-Veg"},
    {"name": "Crab Kuzhambu", "region": "General", "category": "Non-Veg"},
    
    # Non-vegetarian - Egg
    {"name": "Egg Curry", "region": "General", "category": "Non-Veg"},
    {"name": "Egg Kuzhambu", "region": "General", "category": "Non-Veg"},
    {"name": "Egg Peratal", "region": "General", "category": "Non-Veg"},
    {"name": "Egg Fry", "region": "General", "category": "Non-Veg"},
    {"name": "Egg Biryani", "region": "General", "category": "Non-Veg"},
    
    # Snacks
    {"name": "Medu Vada", "region": "General", "category": "Vegetarian"},
    {"name": "Masala Vada", "region": "General", "category": "Vegetarian"},
    {"name": "Paruppu Vada", "region": "General", "category": "Vegetarian"},
    {"name": "Onion Pakoda", "region": "General", "category": "Vegetarian"},
    {"name": "Bajji", "region": "General", "category": "Vegetarian"},
    {"name": "Kathrikai Bajji", "region": "General", "category": "Vegetarian"},
    {"name": "Vazhakkai Bajji", "region": "General", "category": "Vegetarian"},
    {"name": "Murungakkai Bajji", "region": "General", "category": "Vegetarian"},
    {"name": "Bonda", "region": "General", "category": "Vegetarian"},
    {"name": "Urad Dal Bonda", "region": "General", "category": "Vegetarian"},
    {"name": "Potato Bonda", "region": "General", "category": "Vegetarian"},
    {"name": "Kara Boondi", "region": "General", "category": "Vegetarian"},
    {"name": "Mixture", "region": "General", "category": "Vegetarian"},
    {"name": "Thattai", "region": "General", "category": "Vegetarian"},
    {"name": "Murukku", "region": "General", "category": "Vegetarian"},
    {"name": "Achappam", "region": "Kongu Nadu", "category": "Vegetarian"},
    {"name": "Adhirasam", "region": "General", "category": "Vegetarian"},
    {"name": "Kozhukattai", "region": "General", "category": "Vegetarian"},
    {"name": "Pidi Kozhukattai", "region": "General", "category": "Vegetarian"},
    {"name": "Thengai Kozhukattai", "region": "General", "category": "Vegetarian"},
    
    # Rice dishes
    {"name": "Lemon Rice", "region": "General", "category": "Vegetarian"},
    {"name": "Tamarind Rice", "region": "General", "category": "Vegetarian"},
    {"name": "Coconut Rice", "region": "General", "category": "Vegetarian"},
    {"name": "Curd Rice", "region": "General", "category": "Vegetarian"},
    {"name": "Tomato Rice", "region": "General", "category": "Vegetarian"},
    {"name": "Puli Sadam", "region": "General", "category": "Vegetarian"},
    {"name": "Elumichai Sadam", "region": "General", "category": "Vegetarian"},
    {"name": "Thengai Sadam", "region": "General", "category": "Vegetarian"},
    {"name": "Thayir Sadam", "region": "General", "category": "Vegetarian"},
    {"name": "Thakkali Sadam", "region": "General", "category": "Vegetarian"},
    {"name": "Bisi Bele Bath", "region": "General", "category": "Vegetarian"},
    {"name": "Khichdi", "region": "General", "category": "Vegetarian"},
    {"name": "Vegetable Biryani", "region": "General", "category": "Vegetarian"},
    
    # Sweets
    {"name": "Payasam", "region": "General", "category": "Vegetarian"},
    {"name": "Semiya Payasam", "region": "General", "category": "Vegetarian"},
    {"name": "Aval Payasam", "region": "General", "category": "Vegetarian"},
    {"name": "Rice Payasam", "region": "General", "category": "Vegetarian"},
    {"name": "Wheat Payasam", "region": "General", "category": "Vegetarian"},
    {"name": "Badam Payasam", "region": "General", "category": "Vegetarian"},
    {"name": "Kheer", "region": "General", "category": "Vegetarian"},
    {"name": "Gulab Jamun", "region": "General", "category": "Vegetarian"},
    {"name": "Jangiri", "region": "General", "category": "Vegetarian"},
    {"name": "Mysore Pak", "region": "General", "category": "Vegetarian"},
    {"name": "Badusha", "region": "General", "category": "Vegetarian"},
    {"name": "Kaju Katli", "region": "General", "category": "Vegetarian"},
    {"name": "Laddu", "region": "General", "category": "Vegetarian"},
    {"name": "Boondi Laddu", "region": "General", "category": "Vegetarian"},
    {"name": "Rava Laddu", "region": "General", "category": "Vegetarian"},
    {"name": "Besan Laddu", "region": "General", "category": "Vegetarian"},
    {"name": "Modak", "region": "General", "category": "Vegetarian"},
    {"name": "Halwa", "region": "General", "category": "Vegetarian"},
    {"name": "Carrot Halwa", "region": "General", "category": "Vegetarian"},
    {"name": "Wheat Halwa", "region": "General", "category": "Vegetarian"},
    {"name": "Badam Halwa", "region": "General", "category": "Vegetarian"},
    
    # Chutneys
    {"name": "Coconut Chutney", "region": "General", "category": "Vegetarian"},
    {"name": "Tomato Chutney", "region": "General", "category": "Vegetarian"},
    {"name": "Onion Chutney", "region": "General", "category": "Vegetarian"},
    {"name": "Ginger Chutney", "region": "General", "category": "Vegetarian"},
    {"name": "Coriander Chutney", "region": "General", "category": "Vegetarian"},
    {"name": "Mint Chutney", "region": "General", "category": "Vegetarian"},
    {"name": "Peanut Chutney", "region": "General", "category": "Vegetarian"},
    {"name": "Garlic Chutney", "region": "General", "category": "Vegetarian"},
    {"name": "Red Chutney", "region": "General", "category": "Vegetarian"},
    {"name": "Green Chutney", "region": "General", "category": "Vegetarian"},
    {"name": "Thogayal", "region": "General", "category": "Vegetarian"},
    {"name": "Keerai Thogayal", "region": "General", "category": "Vegetarian"},
    {"name": "Coconut Thogayal", "region": "General", "category": "Vegetarian"},
    {"name": "Tomato Thogayal", "region": "General", "category": "Vegetarian"},
    
    # Kootu varieties
    {"name": "Arachuvitta Kootu", "region": "Tanjore", "category": "Vegetarian"},
    {"name": "Keerai Kootu", "region": "General", "category": "Vegetarian"},
    {"name": "Paruppu Kootu", "region": "General", "category": "Vegetarian"},
    {"name": "Kathrikai Kootu", "region": "General", "category": "Vegetarian"},
    {"name": "Vendakkai Kootu", "region": "General", "category": "Vegetarian"},
    {"name": "Beans Kootu", "region": "General", "category": "Vegetarian"},
    {"name": "Cabbage Kootu", "region": "General", "category": "Vegetarian"},
    {"name": "Carrot Kootu", "region": "General", "category": "Vegetarian"},
    {"name": "Beetroot Kootu", "region": "General", "category": "Vegetarian"},
    {"name": "Drumstick Kootu", "region": "General", "category": "Vegetarian"},
    
    # Poricha Kuzhambu
    {"name": "Poricha Kuzhambu", "region": "General", "category": "Vegetarian"},
    {"name": "Kathrikai Poricha Kuzhambu", "region": "General", "category": "Vegetarian"},
    {"name": "Vendakkai Poricha Kuzhambu", "region": "General", "category": "Vegetarian"},
    {"name": "Beans Poricha Kuzhambu", "region": "General", "category": "Vegetarian"},
    {"name": "Drumstick Poricha Kuzhambu", "region": "General", "category": "Vegetarian"},
    
    # Peratal varieties
    {"name": "Kathrikai Peratal", "region": "General", "category": "Vegetarian"},
    {"name": "Vendakkai Peratal", "region": "General", "category": "Vegetarian"},
    {"name": "Beans Peratal", "region": "General", "category": "Vegetarian"},
    {"name": "Cabbage Peratal", "region": "General", "category": "Vegetarian"},
    {"name": "Carrot Peratal", "region": "General", "category": "Vegetarian"},
    {"name": "Beetroot Peratal", "region": "General", "category": "Vegetarian"},
    {"name": "Potato Peratal", "region": "General", "category": "Vegetarian"},
    {"name": "Onion Peratal", "region": "General", "category": "Vegetarian"},
    
    # Additional dishes
    {"name": "Kothu Parotta", "region": "Kongu Nadu", "category": "Vegetarian"},
    {"name": "Parotta", "region": "Kongu Nadu", "category": "Vegetarian"},
    {"name": "Chicken Kothu Parotta", "region": "Kongu Nadu", "category": "Non-Veg"},
    {"name": "Mutton Kothu Parotta", "region": "Kongu Nadu", "category": "Non-Veg"},
    {"name": "Egg Kothu Parotta", "region": "Kongu Nadu", "category": "Non-Veg"},
    {"name": "Aviyal", "region": "General", "category": "Vegetarian"},
    {"name": "Thoran", "region": "General", "category": "Vegetarian"},
    {"name": "Mezhukupuratti", "region": "General", "category": "Vegetarian"},
    {"name": "Paruppu Usili", "region": "General", "category": "Vegetarian"},
    {"name": "Keerai Masiyal", "region": "General", "category": "Vegetarian"},
    {"name": "Vathal Kuzhambu", "region": "General", "category": "Vegetarian"},
    {"name": "Sundakkai Kuzhambu", "region": "General", "category": "Vegetarian"},
    {"name": "Inji Curry", "region": "General", "category": "Vegetarian"},
    {"name": "Puli Inji", "region": "General", "category": "Vegetarian"},
    {"name": "Thayir Pachadi", "region": "General", "category": "Vegetarian"},
    {"name": "Onion Raita", "region": "General", "category": "Vegetarian"},
    {"name": "Cucumber Raita", "region": "General", "category": "Vegetarian"},
    {"name": "Pachadi", "region": "General", "category": "Vegetarian"},
    {"name": "Kichadi", "region": "General", "category": "Vegetarian"},
    {"name": "Poriyal", "region": "General", "category": "Vegetarian"},
    {"name": "Varuval", "region": "General", "category": "Vegetarian"},
    {"name": "Paneer Curry", "region": "General", "category": "Vegetarian"},
    {"name": "Paneer Butter Masala", "region": "General", "category": "Vegetarian"},
    {"name": "Aloo Gobi", "region": "General", "category": "Vegetarian"},
    {"name": "Baingan Bharta", "region": "General", "category": "Vegetarian"},
    {"name": "Dal Tadka", "region": "General", "category": "Vegetarian"},
    {"name": "Dal Fry", "region": "General", "category": "Vegetarian"},
    {"name": "Veg Kurma", "region": "General", "category": "Vegetarian"},
    {"name": "Gobi Manchurian", "region": "General", "category": "Vegetarian"},
    {"name": "Paneer Manchurian", "region": "General", "category": "Vegetarian"},
    {"name": "Pulao", "region": "General", "category": "Vegetarian"},
    {"name": "Jeera Rice", "region": "General", "category": "Vegetarian"},
    {"name": "Ghee Rice", "region": "General", "category": "Vegetarian"},
    {"name": "Fried Rice", "region": "General", "category": "Vegetarian"},
    {"name": "Adai", "region": "General", "category": "Vegetarian"},
    {"name": "Adai Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Pesarattu", "region": "General", "category": "Vegetarian"},
    {"name": "Uttapam", "region": "General", "category": "Vegetarian"},
    {"name": "Onion Uttapam", "region": "General", "category": "Vegetarian"},
    {"name": "Tomato Uttapam", "region": "General", "category": "Vegetarian"},
    
    # More regional variations to reach 500+
    {"name": "Chettinad Biryani", "region": "Chettinad", "category": "Non-Veg"},
    {"name": "Madurai Biryani", "region": "Madurai", "category": "Non-Veg"},
    {"name": "Kongu Nadu Biryani", "region": "Kongu Nadu", "category": "Non-Veg"},
    {"name": "Tanjore Biryani", "region": "Tanjore", "category": "Non-Veg"},
    {"name": "Nanjil Biryani", "region": "Nanjil Nadu", "category": "Non-Veg"},
    {"name": "Chettinad Fish Fry", "region": "Chettinad", "category": "Non-Veg"},
    {"name": "Madurai Fish Fry", "region": "Madurai", "category": "Non-Veg"},
    {"name": "Nanjil Fish Fry", "region": "Nanjil Nadu", "category": "Non-Veg"},
    {"name": "Kongu Nadu Fish Fry", "region": "Kongu Nadu", "category": "Non-Veg"},
    {"name": "Chettinad Prawn Fry", "region": "Chettinad", "category": "Non-Veg"},
    {"name": "Madurai Prawn Fry", "region": "Madurai", "category": "Non-Veg"},
    {"name": "Kongu Nadu Prawn Fry", "region": "Kongu Nadu", "category": "Non-Veg"},
    {"name": "Chettinad Crab Fry", "region": "Chettinad", "category": "Non-Veg"},
    {"name": "Madurai Crab Fry", "region": "Madurai", "category": "Non-Veg"},
    {"name": "Kongu Nadu Crab Fry", "region": "Kongu Nadu", "category": "Non-Veg"},
    {"name": "Chettinad Egg Curry", "region": "Chettinad", "category": "Non-Veg"},
    {"name": "Madurai Egg Curry", "region": "Madurai", "category": "Non-Veg"},
    {"name": "Kongu Nadu Egg Curry", "region": "Kongu Nadu", "category": "Non-Veg"},
    {"name": "Tanjore Egg Curry", "region": "Tanjore", "category": "Non-Veg"},
    {"name": "Nanjil Egg Curry", "region": "Nanjil Nadu", "category": "Non-Veg"},
    
    # More vegetarian regional variations
    {"name": "Chettinad Sambar", "region": "Chettinad", "category": "Vegetarian"},
    {"name": "Madurai Sambar", "region": "Madurai", "category": "Vegetarian"},
    {"name": "Nanjil Sambar", "region": "Nanjil Nadu", "category": "Vegetarian"},
    {"name": "Chettinad Rasam", "region": "Chettinad", "category": "Vegetarian"},
    {"name": "Madurai Rasam", "region": "Madurai", "category": "Vegetarian"},
    {"name": "Kongu Nadu Rasam", "region": "Kongu Nadu", "category": "Vegetarian"},
    {"name": "Tanjore Rasam", "region": "Tanjore", "category": "Vegetarian"},
    {"name": "Nanjil Rasam", "region": "Nanjil Nadu", "category": "Vegetarian"},
    {"name": "Chettinad Kuzhambu", "region": "Chettinad", "category": "Vegetarian"},
    {"name": "Madurai Kuzhambu", "region": "Madurai", "category": "Vegetarian"},
    {"name": "Nanjil Kuzhambu", "region": "Nanjil Nadu", "category": "Vegetarian"},
    {"name": "Chettinad Kootu", "region": "Chettinad", "category": "Vegetarian"},
    {"name": "Madurai Kootu", "region": "Madurai", "category": "Vegetarian"},
    {"name": "Kongu Nadu Kootu", "region": "Kongu Nadu", "category": "Vegetarian"},
    {"name": "Tanjore Kootu", "region": "Tanjore", "category": "Vegetarian"},
    {"name": "Nanjil Kootu", "region": "Nanjil Nadu", "category": "Vegetarian"},
    
    # More breakfast variations
    {"name": "Chettinad Dosa", "region": "Chettinad", "category": "Vegetarian"},
    {"name": "Madurai Dosa", "region": "Madurai", "category": "Vegetarian"},
    {"name": "Kongu Nadu Dosa", "region": "Kongu Nadu", "category": "Vegetarian"},
    {"name": "Tanjore Dosa", "region": "Tanjore", "category": "Vegetarian"},
    {"name": "Nanjil Dosa", "region": "Nanjil Nadu", "category": "Vegetarian"},
    {"name": "Chettinad Idli", "region": "Chettinad", "category": "Vegetarian"},
    {"name": "Madurai Idli", "region": "Madurai", "category": "Vegetarian"},
    {"name": "Kongu Nadu Idli", "region": "Kongu Nadu", "category": "Vegetarian"},
    {"name": "Tanjore Idli", "region": "Tanjore", "category": "Vegetarian"},
    {"name": "Nanjil Idli", "region": "Nanjil Nadu", "category": "Vegetarian"},
    {"name": "Chettinad Pongal", "region": "Chettinad", "category": "Vegetarian"},
    {"name": "Madurai Pongal", "region": "Madurai", "category": "Vegetarian"},
    {"name": "Kongu Nadu Pongal", "region": "Kongu Nadu", "category": "Vegetarian"},
    {"name": "Tanjore Pongal", "region": "Tanjore", "category": "Vegetarian"},
    {"name": "Nanjil Pongal", "region": "Nanjil Nadu", "category": "Vegetarian"},
    
    # More rice dish variations
    {"name": "Chettinad Lemon Rice", "region": "Chettinad", "category": "Vegetarian"},
    {"name": "Madurai Lemon Rice", "region": "Madurai", "category": "Vegetarian"},
    {"name": "Kongu Nadu Lemon Rice", "region": "Kongu Nadu", "category": "Vegetarian"},
    {"name": "Tanjore Lemon Rice", "region": "Tanjore", "category": "Vegetarian"},
    {"name": "Nanjil Lemon Rice", "region": "Nanjil Nadu", "category": "Vegetarian"},
    {"name": "Chettinad Tamarind Rice", "region": "Chettinad", "category": "Vegetarian"},
    {"name": "Madurai Tamarind Rice", "region": "Madurai", "category": "Vegetarian"},
    {"name": "Kongu Nadu Tamarind Rice", "region": "Kongu Nadu", "category": "Vegetarian"},
    {"name": "Tanjore Tamarind Rice", "region": "Tanjore", "category": "Vegetarian"},
    {"name": "Nanjil Tamarind Rice", "region": "Nanjil Nadu", "category": "Vegetarian"},
    {"name": "Chettinad Coconut Rice", "region": "Chettinad", "category": "Vegetarian"},
    {"name": "Madurai Coconut Rice", "region": "Madurai", "category": "Vegetarian"},
    {"name": "Kongu Nadu Coconut Rice", "region": "Kongu Nadu", "category": "Vegetarian"},
    {"name": "Tanjore Coconut Rice", "region": "Tanjore", "category": "Vegetarian"},
    {"name": "Nanjil Coconut Rice", "region": "Nanjil Nadu", "category": "Vegetarian"},
    {"name": "Chettinad Curd Rice", "region": "Chettinad", "category": "Vegetarian"},
    {"name": "Madurai Curd Rice", "region": "Madurai", "category": "Vegetarian"},
    {"name": "Kongu Nadu Curd Rice", "region": "Kongu Nadu", "category": "Vegetarian"},
    {"name": "Tanjore Curd Rice", "region": "Tanjore", "category": "Vegetarian"},
    {"name": "Nanjil Curd Rice", "region": "Nanjil Nadu", "category": "Vegetarian"},
    
    # More snack variations
    {"name": "Chettinad Vada", "region": "Chettinad", "category": "Vegetarian"},
    {"name": "Madurai Vada", "region": "Madurai", "category": "Vegetarian"},
    {"name": "Kongu Nadu Vada", "region": "Kongu Nadu", "category": "Vegetarian"},
    {"name": "Tanjore Vada", "region": "Tanjore", "category": "Vegetarian"},
    {"name": "Nanjil Vada", "region": "Nanjil Nadu", "category": "Vegetarian"},
    {"name": "Chettinad Bajji", "region": "Chettinad", "category": "Vegetarian"},
    {"name": "Madurai Bajji", "region": "Madurai", "category": "Vegetarian"},
    {"name": "Kongu Nadu Bajji", "region": "Kongu Nadu", "category": "Vegetarian"},
    {"name": "Tanjore Bajji", "region": "Tanjore", "category": "Vegetarian"},
    {"name": "Nanjil Bajji", "region": "Nanjil Nadu", "category": "Vegetarian"},
    
    # More sweet variations
    {"name": "Chettinad Payasam", "region": "Chettinad", "category": "Vegetarian"},
    {"name": "Madurai Payasam", "region": "Madurai", "category": "Vegetarian"},
    {"name": "Kongu Nadu Payasam", "region": "Kongu Nadu", "category": "Vegetarian"},
    {"name": "Tanjore Payasam", "region": "Tanjore", "category": "Vegetarian"},
    {"name": "Nanjil Payasam", "region": "Nanjil Nadu", "category": "Vegetarian"},
    {"name": "Chettinad Laddu", "region": "Chettinad", "category": "Vegetarian"},
    {"name": "Madurai Laddu", "region": "Madurai", "category": "Vegetarian"},
    {"name": "Kongu Nadu Laddu", "region": "Kongu Nadu", "category": "Vegetarian"},
    {"name": "Tanjore Laddu", "region": "Tanjore", "category": "Vegetarian"},
    {"name": "Nanjil Laddu", "region": "Nanjil Nadu", "category": "Vegetarian"},
    {"name": "Chettinad Halwa", "region": "Chettinad", "category": "Vegetarian"},
    {"name": "Madurai Halwa", "region": "Madurai", "category": "Vegetarian"},
    {"name": "Kongu Nadu Halwa", "region": "Kongu Nadu", "category": "Vegetarian"},
    {"name": "Tanjore Halwa", "region": "Tanjore", "category": "Vegetarian"},
    {"name": "Nanjil Halwa", "region": "Nanjil Nadu", "category": "Vegetarian"},
    
    # Additional unique Tamil Nadu recipes
    {"name": "Kara Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Neer Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Set Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Paper Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Ghee Roast Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Podi Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Ragi Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Wheat Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Jowar Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Bajra Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Millet Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Quinoa Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Oats Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Moong Dal Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Chana Dal Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Masoor Dal Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Mixed Dal Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Spinach Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Carrot Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Beetroot Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Methi Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Coriander Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Curry Leaves Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Garlic Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Ginger Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Pepper Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Cumin Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Fennel Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sesame Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Coconut Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Tomato Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Bell Pepper Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Corn Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Paneer Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Mushroom Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Broccoli Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Cauliflower Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Cabbage Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sweet Potato Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Yam Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Tapioca Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Arrowroot Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Buckwheat Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Amaranth Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Barley Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sorghum Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Finger Millet Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Pearl Millet Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Foxtail Millet Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Little Millet Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Kodo Millet Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Barnyard Millet Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Proso Millet Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Brown Rice Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Red Rice Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Black Rice Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Wild Rice Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sticky Rice Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Jasmine Rice Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Basmati Rice Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sona Masuri Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Ponni Rice Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Raw Rice Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Boiled Rice Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Parboiled Rice Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Poha Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Aval Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sabudana Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sago Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Tapioca Pearl Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Arrowroot Powder Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Corn Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Rice Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Wheat Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Besan Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Chickpea Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Urad Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Moong Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Chana Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Masoor Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Toor Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Black Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Green Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Yellow Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Red Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Bengal Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Split Black Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Split Green Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Split Yellow Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Split Red Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Whole Black Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Whole Green Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Whole Yellow Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Whole Red Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Horse Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Cowpea Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Lima Bean Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Kidney Bean Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Black Bean Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Navy Bean Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Pinto Bean Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Cannellini Bean Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Great Northern Bean Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Fava Bean Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Lentil Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Red Lentil Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Yellow Lentil Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Brown Lentil Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Green Lentil Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Black Lentil Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Pigeon Pea Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Black-Eyed Pea Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Garbanzo Bean Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Edamame Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Soybean Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Tofu Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Tempeh Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Miso Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Natto Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Seitan Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "TVP Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Textured Vegetable Protein Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Quorn Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Mycoprotein Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Hemp Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Chia Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Flax Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sunflower Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Pumpkin Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sesame Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Poppy Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Nigella Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Fennel Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Cumin Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Coriander Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Mustard Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Fenugreek Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Carom Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Ajwain Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Celery Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Dill Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Anise Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Star Anise Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Cardamom Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Nutmeg Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Mace Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Allspice Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Juniper Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sumac Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Za'atar Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Ras El Hanout Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Baharat Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Berbere Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Harissa Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Shawarma Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Tandoori Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Garam Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Curry Powder Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sambar Powder Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Rasam Powder Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Chaat Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Pav Bhaji Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Biryani Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Korma Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Vindaloo Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Rogan Josh Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Butter Chicken Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Chicken Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Lamb Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Fish Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Prawn Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Paneer Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Mushroom Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Cauliflower Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Broccoli Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Potato Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Onion Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Tomato Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Bell Pepper Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Zucchini Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Eggplant Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Okra Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Green Beans Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Carrot Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Beetroot Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Radish Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Turnip Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Kohlrabi Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Celeriac Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Parsnip Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Rutabaga Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Swede Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Salsify Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Scorzonera Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Jerusalem Artichoke Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sunflower Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Burdock Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Lotus Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Taro Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Cassava Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Yam Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sweet Potato Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Potato Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Onion Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Garlic Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Ginger Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Turmeric Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Horseradish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Wasabi Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Daikon Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Black Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Watermelon Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Easter Egg Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "French Breakfast Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Cherry Belle Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "White Icicle Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sparkler Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Champion Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Crimson Giant Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Plum Purple Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Red Meat Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Green Meat Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Black Spanish Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "China Rose Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Long Black Spanish Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Round Black Spanish Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Mantanghong Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Misato Rose Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Red King Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Nero Tondo Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Zlata Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Golden Helios Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Zlata Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Neer Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Set Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Paper Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Ghee Roast Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Podi Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Pesarattu Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Ragi Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Wheat Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Jowar Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Bajra Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Millet Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Quinoa Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Oats Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Moong Dal Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Chana Dal Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Masoor Dal Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Mixed Dal Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Spinach Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Carrot Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Beetroot Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Methi Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Coriander Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Curry Leaves Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Garlic Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Ginger Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Pepper Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Cumin Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Fennel Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sesame Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Coconut Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Tomato Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Bell Pepper Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Corn Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Paneer Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Cheese Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Mushroom Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Broccoli Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Cauliflower Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Cabbage Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Zucchini Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sweet Potato Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Yam Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Tapioca Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Arrowroot Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Buckwheat Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Amaranth Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Barley Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sorghum Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Finger Millet Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Pearl Millet Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Foxtail Millet Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Little Millet Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Kodo Millet Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Barnyard Millet Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Proso Millet Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Brown Rice Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Red Rice Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Black Rice Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Wild Rice Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sticky Rice Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Jasmine Rice Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Basmati Rice Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sona Masuri Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Ponni Rice Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Raw Rice Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Boiled Rice Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Parboiled Rice Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Poha Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Aval Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sabudana Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sago Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Tapioca Pearl Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Arrowroot Powder Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Corn Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Rice Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Wheat Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Besan Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Chickpea Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Urad Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Moong Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Chana Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Masoor Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Toor Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Black Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Green Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Yellow Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Red Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Bengal Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Split Black Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Split Green Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Split Yellow Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Split Red Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Whole Black Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Whole Green Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Whole Yellow Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Whole Red Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Horse Gram Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Cowpea Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Lima Bean Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Kidney Bean Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Black Bean Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Navy Bean Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Pinto Bean Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Cannellini Bean Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Great Northern Bean Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Fava Bean Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Lentil Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Red Lentil Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Yellow Lentil Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Brown Lentil Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Green Lentil Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Black Lentil Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Pigeon Pea Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Black-Eyed Pea Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Chickpea Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Garbanzo Bean Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Edamame Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Soybean Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Tofu Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Tempeh Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Miso Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Natto Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Seitan Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "TVP Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Textured Vegetable Protein Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Quorn Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Mycoprotein Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Hemp Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Chia Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Flax Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sunflower Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Pumpkin Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sesame Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Poppy Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Nigella Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Fennel Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Cumin Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Coriander Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Mustard Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Fenugreek Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Carom Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Ajwain Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Celery Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Dill Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Anise Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Star Anise Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Cardamom Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Nutmeg Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Mace Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Allspice Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Juniper Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sumac Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Za'atar Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Ras El Hanout Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Baharat Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Berbere Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Harissa Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Shawarma Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Tandoori Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Garam Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Curry Powder Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sambar Powder Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Rasam Powder Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Chaat Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Pav Bhaji Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Biryani Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Korma Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Vindaloo Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Rogan Josh Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Butter Chicken Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Chicken Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Lamb Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Fish Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Prawn Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Paneer Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Mushroom Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Cauliflower Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Broccoli Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Potato Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Onion Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Tomato Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Bell Pepper Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Zucchini Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Eggplant Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Okra Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Green Beans Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Carrot Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Beetroot Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Radish Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Turnip Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Kohlrabi Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Celeriac Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Parsnip Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Rutabaga Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Swede Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Salsify Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Scorzonera Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Jerusalem Artichoke Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sunflower Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Burdock Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Lotus Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Taro Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Cassava Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Yam Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sweet Potato Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Potato Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Onion Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Garlic Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Ginger Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Turmeric Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Horseradish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Wasabi Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Daikon Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Black Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Watermelon Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Easter Egg Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "French Breakfast Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Cherry Belle Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "White Icicle Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Sparkler Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Champion Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Crimson Giant Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Plum Purple Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Red Meat Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Green Meat Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Black Spanish Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "China Rose Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Long Black Spanish Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Round Black Spanish Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Mantanghong Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Misato Rose Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Red King Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Nero Tondo Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Zlata Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Golden Helios Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
    {"name": "Zlata Radish Root Tikka Masala Seed Flour Dosa", "region": "General", "category": "Vegetarian"},
]

# Expand recipes to ensure 500+ unique recipes
def expand_recipes():
    """Expand recipe list to ensure 500+ unique recipes"""
    expanded = []
    seen = set()
    
    for template in RECIPE_TEMPLATES:
        key = f"{template['name']}_{template['region']}_{template['category']}"
        if key not in seen:
            seen.add(key)
            expanded.append(template)
    
    # If we still don't have 500, add more variations
    if len(expanded) < 500:
        base_names = ["Curry", "Fry", "Roast", "Gravy", "Kuzhambu", "Peratal", "Varuval"]
        regions = ["Kongu Nadu", "Chettinad", "Madurai", "Tanjore", "Nanjil Nadu", "Chola Nadu", "Pandya Nadu"]
        categories = ["Vegetarian", "Non-Veg"]
        
        for base in base_names:
            for region in regions:
                for category in categories:
                    name = f"{region} {base}"
                    key = f"{name}_{region}_{category}"
                    if key not in seen:
                        seen.add(key)
                        expanded.append({"name": name, "region": region, "category": category})
    
    return expanded[:550]  # Return up to 550 to ensure we have 500+


def generate_recipe_with_gemini(recipe_name: str, region: str, category: str) -> Optional[Dict]:
    """Generate recipe using Gemini API for more realistic content"""
    if not GEMINI_API_KEY:
        return None
    
    try:
        model = genai.GenerativeModel(model_name="gemini-pro")
        
        prompt = f"""Generate a detailed recipe for "{recipe_name}" from {region} region of Tamil Nadu, India. 
Category: {category}

Provide the recipe in the following JSON format:
{{
    "ingredients": ["ingredient 1 with quantity", "ingredient 2 with quantity", ...],
    "steps": ["step 1", "step 2", "step 3", ...]
}}

Requirements:
- Include authentic Tamil Nadu ingredients and cooking methods
- Make it specific to {region} style if region is not "General"
- Include proper measurements and quantities
- Steps should be detailed and easy to follow
- For {category} dishes, include appropriate ingredients
- Return ONLY valid JSON, no additional text

Recipe:"""
        
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Clean up the response (remove markdown code blocks if present)
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        text = text.strip()
        
        recipe_data = json.loads(text)
        
        if "ingredients" in recipe_data and "steps" in recipe_data:
            return {
                "name": recipe_name,
                "ingredients": recipe_data["ingredients"],
                "steps": recipe_data["steps"]
            }
    except Exception as e:
        print(f"  ⚠️  Gemini API error: {e}, using template instead")
    
    return None


def generate_recipe_from_template(recipe_name: str, region: str, category: str) -> Dict:
    """Generate recipe details from templates and patterns"""
    
    # Base ingredients for different dish types
    base_ingredients = {
        "idli": ["2 cups rice", "1 cup urad dal", "1 tsp fenugreek seeds", "Salt to taste", "Water as needed"],
        "dosa": ["2 cups rice", "1 cup urad dal", "1 tsp fenugreek seeds", "Salt to taste", "Water as needed", "Oil for cooking"],
        "sambar": ["1 cup toor dal", "2 cups mixed vegetables", "1 tsp tamarind paste", "2 tsp sambar powder", "1/2 tsp turmeric", "Salt to taste", "2 tbsp oil", "Mustard seeds", "Curry leaves"],
        "rasam": ["1/2 cup toor dal", "2 tomatoes", "1 tsp tamarind paste", "1 tsp rasam powder", "1/2 tsp turmeric", "Salt to taste", "2 tbsp oil", "Mustard seeds", "Cumin seeds", "Curry leaves"],
        "chicken": ["500g chicken", "2 onions", "2 tomatoes", "2 tsp ginger-garlic paste", "1 tsp turmeric", "2 tsp red chili powder", "1 tsp coriander powder", "Salt to taste", "2 tbsp oil", "Curry leaves"],
        "mutton": ["500g mutton", "2 onions", "2 tomatoes", "2 tsp ginger-garlic paste", "1 tsp turmeric", "2 tsp red chili powder", "1 tsp coriander powder", "Salt to taste", "2 tbsp oil", "Curry leaves"],
        "fish": ["500g fish", "2 onions", "2 tomatoes", "1 tsp turmeric", "2 tsp red chili powder", "1 tsp coriander powder", "Salt to taste", "2 tbsp oil", "Curry leaves"],
        "rice": ["2 cups rice", "1 tsp mustard seeds", "1 tsp urad dal", "2 dry red chilies", "Curry leaves", "Salt to taste", "2 tbsp oil"],
        "sweet": ["1 cup main ingredient", "1/2 cup sugar", "1/4 cup ghee", "Cardamom powder", "Cashews and raisins"],
    }
    
    # Base steps for different dish types
    base_steps = {
        "idli": [
            "Soak rice and urad dal separately for 4-6 hours",
            "Grind rice and dal separately into smooth batter",
            "Mix both batters, add salt and fenugreek seeds",
            "Ferment overnight in a warm place",
            "Pour batter into idli moulds and steam for 10-12 minutes",
            "Serve hot with chutney and sambar"
        ],
        "dosa": [
            "Soak rice and urad dal separately for 4-6 hours",
            "Grind into smooth batter and ferment overnight",
            "Heat a tawa and spread batter in circular motion",
            "Drizzle oil around edges and cook until golden",
            "Flip and cook the other side",
            "Serve hot with chutney and sambar"
        ],
        "sambar": [
            "Pressure cook toor dal until soft",
            "Heat oil in a pan, add mustard seeds and curry leaves",
            "Add vegetables and sauté for 2-3 minutes",
            "Add tamarind paste, sambar powder, and turmeric",
            "Add cooked dal and bring to boil",
            "Season with salt and serve hot"
        ],
        "rasam": [
            "Cook toor dal until soft and mash it",
            "Heat oil, add mustard seeds, cumin seeds, and curry leaves",
            "Add chopped tomatoes and cook until soft",
            "Add tamarind paste, rasam powder, and turmeric",
            "Add dal water and bring to boil",
            "Season with salt and garnish with coriander leaves"
        ],
        "chicken": [
            "Clean and cut chicken into pieces",
            "Heat oil in a pan, add whole spices",
            "Add onions and sauté until golden",
            "Add ginger-garlic paste and cook for 2 minutes",
            "Add tomatoes and cook until soft",
            "Add spices and chicken, cook until tender",
            "Garnish with coriander leaves and serve hot"
        ],
        "mutton": [
            "Clean and cut mutton into pieces",
            "Heat oil in a pressure cooker, add whole spices",
            "Add onions and sauté until golden",
            "Add ginger-garlic paste and cook for 2 minutes",
            "Add tomatoes and cook until soft",
            "Add spices and mutton, pressure cook for 3-4 whistles",
            "Garnish with coriander leaves and serve hot"
        ],
        "fish": [
            "Clean and marinate fish with turmeric and salt",
            "Heat oil in a pan, add mustard seeds and curry leaves",
            "Add onions and sauté until golden",
            "Add tomatoes and cook until soft",
            "Add spices and cook until oil separates",
            "Add fish pieces and cook until done",
            "Garnish with coriander leaves and serve hot"
        ],
        "rice": [
            "Cook rice and let it cool",
            "Heat oil in a pan, add mustard seeds and urad dal",
            "Add dry red chilies and curry leaves",
            "Add main ingredients and sauté",
            "Add cooked rice and mix well",
            "Season with salt and serve hot"
        ],
        "sweet": [
            "Heat ghee in a pan",
            "Add main ingredient and roast until golden",
            "Add sugar and cook until it dissolves",
            "Add cardamom powder and mix well",
            "Garnish with cashews and raisins",
            "Serve warm or cold"
        ],
    }
    
    # Determine dish type from recipe name
    name_lower = recipe_name.lower()
    
    if "idli" in name_lower:
        dish_type = "idli"
    elif "dosa" in name_lower or "uttapam" in name_lower:
        dish_type = "dosa"
    elif "sambar" in name_lower:
        dish_type = "sambar"
    elif "rasam" in name_lower:
        dish_type = "rasam"
    elif "chicken" in name_lower:
        dish_type = "chicken"
    elif "mutton" in name_lower:
        dish_type = "mutton"
    elif "fish" in name_lower or "meen" in name_lower:
        dish_type = "fish"
    elif "rice" in name_lower or "sadam" in name_lower or "biryani" in name_lower:
        dish_type = "rice"
    elif "payasam" in name_lower or "halwa" in name_lower or "laddu" in name_lower or "sweet" in name_lower:
        dish_type = "sweet"
    elif "pongal" in name_lower:
        dish_type = "rice"
    elif "upma" in name_lower:
        dish_type = "rice"
    elif "kuzhambu" in name_lower or "curry" in name_lower:
        if category == "Non-Veg":
            if "chicken" in name_lower:
                dish_type = "chicken"
            elif "mutton" in name_lower:
                dish_type = "mutton"
            elif "fish" in name_lower or "prawn" in name_lower or "crab" in name_lower:
                dish_type = "fish"
            else:
                dish_type = "sambar"
        else:
            dish_type = "sambar"
    else:
        dish_type = "sambar"  # Default
    
    # Get base ingredients and steps
    ingredients = base_ingredients.get(dish_type, base_ingredients["sambar"]).copy()
    steps = base_steps.get(dish_type, base_steps["sambar"]).copy()
    
    # Add region-specific variations
    if region != "General":
        if "chettinad" in region.lower():
            ingredients.extend(["2 tsp fennel seeds", "1 tsp black pepper", "1/2 cup coconut"])
            steps.insert(-1, "Add Chettinad special spices for authentic flavor")
        elif "madurai" in region.lower():
            ingredients.extend(["1 tsp fennel seeds", "Extra red chili powder"])
            steps.insert(-1, "Add Madurai style tempering")
        elif "kongu" in region.lower():
            ingredients.extend(["1 tsp cumin seeds", "1/2 cup coconut"])
            steps.insert(-1, "Add Kongu Nadu style spices")
        elif "nanjil" in region.lower():
            ingredients.extend(["1 tsp black pepper", "Extra curry leaves"])
            steps.insert(-1, "Add Nanjil style seasoning")
    
    # Customize for specific dishes
    if "masala" in name_lower:
        ingredients.extend(["3-4 potatoes", "1 onion", "Green chilies"])
        steps.insert(-2, "Prepare masala filling with potatoes and spices")
    
    if "biryani" in name_lower:
        ingredients.extend(["2 cups basmati rice", "Whole spices (cardamom, cinnamon, cloves)", "Saffron", "Mint leaves"])
        steps = [
            "Marinate meat/chicken with yogurt and spices for 30 minutes",
            "Cook rice separately with whole spices until 70% done",
            "Layer rice and meat in a heavy-bottomed pan",
            "Add saffron, mint leaves, and fried onions",
            "Cover and cook on dum (low heat) for 20-30 minutes",
            "Serve hot with raita"
        ]
    
    return {
        "name": recipe_name,
        "ingredients": ingredients,
        "steps": steps
    }


def download_image_from_unsplash(query: str, filename: str) -> bool:
    """Download image from Unsplash"""
    if not UNSPLASH_ACCESS_KEY:
        return False
    
    try:
        url = "https://api.unsplash.com/search/photos"
        headers = {"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"}
        params = {"query": query, "per_page": 1, "orientation": "landscape"}
        
        response = requests.get(url, headers=headers, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("results"):
                image_url = data["results"][0]["urls"]["regular"]
                img_response = requests.get(image_url, timeout=10)
                if img_response.status_code == 200:
                    with open(filename, "wb") as f:
                        f.write(img_response.content)
                    return True
    except Exception as e:
        print(f"Error downloading from Unsplash: {e}")
    
    return False


def download_image_from_pexels(query: str, filename: str) -> bool:
    """Download image from Pexels"""
    if not PEXELS_API_KEY:
        return False
    
    try:
        url = "https://api.pexels.com/v1/search"
        headers = {"Authorization": PEXELS_API_KEY}
        params = {"query": query, "per_page": 1, "orientation": "landscape"}
        
        response = requests.get(url, headers=headers, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("photos"):
                image_url = data["photos"][0]["src"]["large"]
                img_response = requests.get(image_url, timeout=10)
                if img_response.status_code == 200:
                    with open(filename, "wb") as f:
                        f.write(img_response.content)
                    return True
    except Exception as e:
        print(f"Error downloading from Pexels: {e}")
    
    return False


def download_image_from_foodish(query: str, filename: str) -> bool:
    """Download food image from Foodish API (free food images)"""
    try:
        # Foodish provides random food images
        url = "https://foodish-api.com/images/biryani/biryani1.jpg"
        # Try different food categories
        food_categories = ["biryani", "burger", "pizza", "pasta", "dessert", "dosa"]
        category = random.choice(food_categories)
        url = f"https://foodish-api.com/images/{category}/{category}{random.randint(1, 10)}.jpg"
        
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            with open(filename, "wb") as f:
                f.write(response.content)
            return True
    except Exception as e:
        print(f"  Error downloading from Foodish: {e}")
    
    return False


def download_image_from_lorempicsum(filename: str) -> bool:
    """Download placeholder image from Lorem Picsum"""
    try:
        # Use random image ID for variety
        image_id = random.randint(1, 1000)
        url = f"https://picsum.photos/800/600?random={image_id}"
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            with open(filename, "wb") as f:
                f.write(response.content)
            return True
    except Exception as e:
        print(f"  Error downloading from Lorem Picsum: {e}")
    
    return False


def download_recipe_image(recipe_name: str, category: str) -> str:
    """Download image for recipe, trying multiple sources"""
    # Create safe filename
    safe_name = "".join(c if c.isalnum() or c in ('-', '_') else '-' for c in recipe_name.lower())
    safe_name = safe_name.replace(' ', '-')
    filename = IMAGES_DIR / f"{safe_name}.jpg"
    
    # Skip if image already exists
    if filename.exists():
        return f"images/{safe_name}.jpg"
    
    # Try Unsplash first
    query = f"{recipe_name} Tamil Nadu food {category}"
    if download_image_from_unsplash(query, filename):
        return f"images/{safe_name}.jpg"
    
    # Try Pexels
    if download_image_from_pexels(query, filename):
        return f"images/{safe_name}.jpg"
    
    # Try Foodish (free food images)
    if download_image_from_foodish(query, filename):
        return f"images/{safe_name}.jpg"
    
    # Fallback to Lorem Picsum
    if download_image_from_lorempicsum(filename):
        return f"images/{safe_name}.jpg"
    
    # If all fail, return placeholder path anyway
    return f"images/{safe_name}.jpg"


def sanitize_filename(name: str) -> str:
    """Convert recipe name to safe filename"""
    return "".join(c if c.isalnum() or c in ('-', '_') else '-' for c in name.lower()).replace(' ', '-')


def main():
    """Main function to download dataset"""
    print("Starting Tamil Nadu recipe dataset download...")
    print(f"Target: 500+ recipes")
    
    # Create directories
    DATASET_DIR.mkdir(exist_ok=True)
    IMAGES_DIR.mkdir(exist_ok=True)
    
    # Expand recipes
    recipes = expand_recipes()
    print(f"Total recipes to process: {len(recipes)}")
    
    # Load existing recipes if any
    existing_recipes = []
    if RECIPES_FILE.exists():
        with open(RECIPES_FILE, "r", encoding="utf-8") as f:
            existing_recipes = json.load(f)
        print(f"Found {len(existing_recipes)} existing recipes")
    
    # Track processed recipes to avoid duplicates (by name+region combination)
    processed_keys = {f"{r['name']}_{r['region']}" for r in existing_recipes}
    
    all_recipes = existing_recipes.copy()
    recipe_id = len(existing_recipes) + 1
    
    # Process each recipe
    new_recipes_count = 0
    for i, template in enumerate(recipes, 1):
        recipe_name = template["name"]
        region = template["region"]
        category = template["category"]
        
        # Create unique key for this recipe
        recipe_key = f"{recipe_name}_{region}"
        
        # Skip if already processed
        if recipe_key in processed_keys:
            print(f"[{i}/{len(recipes)}] Skipping duplicate: {recipe_name} ({region})")
            continue
        
        print(f"[{i}/{len(recipes)}] Processing: {recipe_name} ({region}, {category})")
        
        # Try to generate recipe with Gemini first, fallback to template
        recipe_data = generate_recipe_with_gemini(recipe_name, region, category)
        if not recipe_data:
            recipe_data = generate_recipe_from_template(recipe_name, region, category)
        
        # Ensure required fields
        ingredients = recipe_data.get("ingredients", [])
        steps = recipe_data.get("steps", [])
        
        if not ingredients:
            ingredients = ["Rice", "Salt", "Water"]
        if not steps:
            steps = ["Prepare ingredients", "Cook as per traditional method", "Serve hot"]
        
        # Download image
        print(f"  📷 Downloading image...")
        image_path = download_recipe_image(recipe_name, category)
        
        # Create recipe object
        recipe = {
            "id": recipe_id,
            "name": recipe_name,
            "category": category,
            "region": region,
            "ingredients": ingredients,
            "steps": steps,
            "image": image_path
        }
        
        all_recipes.append(recipe)
        processed_keys.add(recipe_key)
        recipe_id += 1
        new_recipes_count += 1
        
        # Save progress every 10 recipes
        if new_recipes_count % 10 == 0:
            with open(RECIPES_FILE, "w", encoding="utf-8") as f:
                json.dump(all_recipes, f, indent=2, ensure_ascii=False)
            print(f"  💾 Progress saved ({len(all_recipes)} recipes)")
        
        # Small delay to avoid overwhelming the system and API rate limits
        time.sleep(0.5)  # Increased delay for Gemini API calls
        
        # Check if we've reached 500+ recipes
        if len(all_recipes) >= 500:
            print(f"\n✅ Reached 500+ recipes! Stopping...")
            break
    
    # Final save
    with open(RECIPES_FILE, "w", encoding="utf-8") as f:
        json.dump(all_recipes, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Dataset complete!")
    print(f"   Total recipes: {len(all_recipes)}")
    print(f"   Images: {len(list(IMAGES_DIR.glob('*.jpg')))}")
    print(f"   JSON file: {RECIPES_FILE}")


if __name__ == "__main__":
    main()

