"""
Recipe image mapping utilities
"""
import re

# Recipe image mappings
RECIPE_IMAGE_MAP = {
    # Dosa variations
    'dosa': '/assets/dosa.jpg',
    'masala dosa': '/assets/dosa.jpg',
    'rava dosa': '/assets/dosa.jpg',
    'onion dosa': '/assets/dosa.jpg',
    
    # Idli variations
    'idli': '/assets/idli.jpg',
    'rava idli': '/assets/idli.jpg',
    'kanchipuram idli': '/assets/idli.jpg',
    
    # Sambar variations
    'sambar': '/assets/sambar.jpg',
    'kongu nadu sambar': '/assets/sambar.jpg',
    'chola nadu sambar': '/assets/sambar.jpg',
    'arachuvitta sambar': '/assets/sambar.jpg',
    'kootu sambar': '/assets/sambar.jpg',
    'paruppu sambar': '/assets/sambar.jpg',
    'keerai sambar': '/assets/sambar.jpg',
    'vendakkai sambar': '/assets/sambar.jpg',
    'kathrikai sambar': '/assets/sambar.jpg',
    'murungakkai sambar': '/assets/sambar.jpg',
    
    # Rasam variations
    'rasam': '/assets/rasam.jpg',
    'tomato rasam': '/assets/rasam.jpg',
    'pepper rasam': '/assets/rasam.jpg',
    'lemon rasam': '/assets/rasam.jpg',
    'pineapple rasam': '/assets/rasam.jpg',
    'jeera rasam': '/assets/rasam.jpg',
    'garlic rasam': '/assets/rasam.jpg',
    'mysore rasam': '/assets/rasam.jpg',
    'paruppu rasam': '/assets/rasam.jpg',
    
    # Pongal variations
    'pongal': '/assets/pongal.jpg',
    'ven pongal': '/assets/pongal.jpg',
    'sweet pongal': '/assets/pongal.jpg',
    
    # Payasam/Kheer variations
    'payasam': '/assets/payasam.jpg',
    'semiya payasam': '/assets/payasam.jpg',
    'aval payasam': '/assets/payasam.jpg',
    'rice payasam': '/assets/payasam.jpg',
    'wheat payasam': '/assets/payasam.jpg',
    'badam payasam': '/assets/payasam.jpg',
    'kheer': '/assets/payasam.jpg',
    'pal payasam': '/assets/payasam.jpg',
    'pradhaman': '/assets/payasam.jpg',
    
    # Vada variations
    'vada': '/assets/vada.jpg',
    'medu vada': '/assets/vada.jpg',
    'masala vada': '/assets/vada.jpg',
    'paruppu vada': '/assets/vada.jpg',
    'bonda': '/assets/vada.jpg',
    'urad dal bonda': '/assets/vada.jpg',
    'potato bonda': '/assets/vada.jpg',
    
    # Chicken variations
    'chicken': '/assets/chettinad-chicken.jpg',
    'chettinad chicken': '/assets/chettinad-chicken.jpg',
    'madurai chicken': '/assets/chettinad-chicken.jpg',
    'kongu nadu chicken': '/assets/chettinad-chicken.jpg',
    'chola nadu chicken': '/assets/chettinad-chicken.jpg',
    'tanjore chicken': '/assets/chettinad-chicken.jpg',
    'pandya nadu chicken': '/assets/chettinad-chicken.jpg',
    'nadu nadu chicken': '/assets/chettinad-chicken.jpg',
    'chicken curry': '/assets/chettinad-chicken.jpg',
    'chicken kuzhambu': '/assets/chettinad-chicken.jpg',
    'chicken peratal': '/assets/chettinad-chicken.jpg',
    'chicken varuval': '/assets/chettinad-chicken.jpg',
    'chicken 65': '/assets/chettinad-chicken.jpg',
    'chicken biryani': '/assets/chettinad-chicken.jpg',
    
    # Mutton variations
    'mutton': '/assets/chettinad-chicken.jpg',
    'chettinad mutton': '/assets/chettinad-chicken.jpg',
    'mutton curry': '/assets/chettinad-chicken.jpg',
    'mutton kuzhambu': '/assets/chettinad-chicken.jpg',
    'mutton peratal': '/assets/chettinad-chicken.jpg',
    'mutton biryani': '/assets/chettinad-chicken.jpg',
    
    # Fish variations
    'fish': '/assets/chettinad-chicken.jpg',
    'fish curry': '/assets/chettinad-chicken.jpg',
    'fish kuzhambu': '/assets/chettinad-chicken.jpg',
    'meen kuzhambu': '/assets/chettinad-chicken.jpg',
    'fish fry': '/assets/chettinad-chicken.jpg',
    'fish peratal': '/assets/chettinad-chicken.jpg',
}

ALL_RECIPE_IMAGES = [
    '/assets/dosa.jpg',
    '/assets/idli.jpg',
    '/assets/sambar.jpg',
    '/assets/rasam.jpg',
    '/assets/pongal.jpg',
    '/assets/payasam.jpg',
    '/assets/vada.jpg',
    '/assets/chettinad-chicken.jpg',
]

STEP_IMAGE_MAP = {
    'dosa': ['/assets/steps/dosa-step1.jpg', '/assets/steps/dosa-step2.jpg', '/assets/steps/dosa-step3.jpg'],
    'idli': ['/assets/steps/idli-step1.jpg', '/assets/steps/idli-step2.jpg', '/assets/steps/idli-step3.jpg', 
             '/assets/steps/idli-step4.jpg', '/assets/steps/idli-step5.jpg'],
    'sambar': ['/assets/steps/sambar-step1.jpg', '/assets/steps/sambar-step2.jpg', '/assets/steps/sambar-step3.jpg', 
               '/assets/steps/sambar-step4.jpg'],
    'rasam': ['/assets/steps/rasam-step1.jpg', '/assets/steps/rasam-step2.jpg', '/assets/steps/rasam-step3.jpg'],
    'pongal': ['/assets/steps/pongal-step1.jpg', '/assets/steps/pongal-step2.jpg', '/assets/steps/pongal-step3.jpg'],
    'payasam': ['/assets/steps/payasam-step1.jpg', '/assets/steps/payasam-step2.jpg', '/assets/steps/payasam-step3.jpg'],
    'vada': ['/assets/steps/vada-step1.jpg', '/assets/steps/vada-step2.jpg', '/assets/steps/vada-step3.jpg'],
    'chicken': ['/assets/steps/chicken-step1.jpg', '/assets/steps/chicken-step2.jpg', '/assets/steps/chicken-step3.jpg'],
}

CATEGORY_KEYWORDS = {
    'dosa': '/assets/dosa.jpg',
    'idli': '/assets/idli.jpg',
    'sambar': '/assets/sambar.jpg',
    'rasam': '/assets/rasam.jpg',
    'pongal': '/assets/pongal.jpg',
    'payasam': '/assets/payasam.jpg',
    'kheer': '/assets/payasam.jpg',
    'vada': '/assets/vada.jpg',
    'bonda': '/assets/vada.jpg',
    'chicken': '/assets/chettinad-chicken.jpg',
    'mutton': '/assets/chettinad-chicken.jpg',
    'beef': '/assets/chettinad-chicken.jpg',
    'fish': '/assets/chettinad-chicken.jpg',
    'meen': '/assets/chettinad-chicken.jpg',
    'prawn': '/assets/chettinad-chicken.jpg',
    'crab': '/assets/chettinad-chicken.jpg',
    'egg': '/assets/chettinad-chicken.jpg',
}


def hash_string(s: str) -> int:
    """Simple hash function to convert string to number"""
    hash_val = 0
    for char in s:
        hash_val = ((hash_val << 5) - hash_val) + ord(char)
        hash_val = hash_val & hash_val  # Convert to 32-bit integer
    return abs(hash_val)


def get_image_index(recipe_id: str, recipe_name: str) -> int:
    """Get image index based on recipe identifier"""
    combined = f"{recipe_id}-{recipe_name}"
    hash_val = hash_string(combined)
    return hash_val % len(ALL_RECIPE_IMAGES)


def get_recipe_image(recipe_name: str, recipe_id: str = None) -> str:
    """Get image path for a recipe name"""
    if not recipe_name:
        return ALL_RECIPE_IMAGES[0]
    
    normalized_name = recipe_name.lower().strip()
    
    # Direct match
    if normalized_name in RECIPE_IMAGE_MAP:
        return RECIPE_IMAGE_MAP[normalized_name]
    
    # Remove region prefixes
    name_without_region = re.sub(
        r'^(kongu nadu|chola nadu|chettinad|madurai|tanjore|pandya nadu|nanjil nadu|nadu nadu|thondai nadu|pallava nadu)\s+',
        '', normalized_name, flags=re.IGNORECASE
    ).strip()
    
    # Try match without region prefix
    if name_without_region != normalized_name and name_without_region in RECIPE_IMAGE_MAP:
        return RECIPE_IMAGE_MAP[name_without_region]
    
    # Partial match
    for key, image_path in RECIPE_IMAGE_MAP.items():
        if normalized_name in key or key in normalized_name:
            return image_path
        if name_without_region in key or key in name_without_region:
            return image_path
    
    # Category-based fallback
    for keyword, image_path in CATEGORY_KEYWORDS.items():
        if keyword in normalized_name or keyword in name_without_region:
            return image_path
    
    # Hash-based assignment
    image_index = get_image_index(recipe_id or recipe_name, recipe_name)
    return ALL_RECIPE_IMAGES[image_index]


def get_recipe_step_images(recipe_name: str, step_number: int) -> str:
    """Get step images for a recipe"""
    if not recipe_name:
        return ""
    
    normalized_name = recipe_name.lower().strip()
    
    # Find matching recipe
    for key, images in STEP_IMAGE_MAP.items():
        if key in normalized_name or normalized_name in key:
            step_index = step_number - 1
            if 0 <= step_index < len(images):
                return images[step_index]
    
    return ""

