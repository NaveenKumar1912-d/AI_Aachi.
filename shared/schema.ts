import { pgTable, text, integer, serial, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const dietTypeEnum = pgEnum('diet_type', ['veg', 'non-veg']);
export const mealTypeEnum = pgEnum('meal_type', ['breakfast', 'lunch', 'snacks', 'sweets', 'drinks']);
export const spiceLevelEnum = pgEnum('spice_level', ['mild', 'medium', 'spicy']);
export const regionEnum = pgEnum('region', ['chettinad', 'madurai', 'kongu', 'tanjore', 'general']);

// Recipes table
export const recipes = pgTable('recipes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  nameEnglish: text('name_english').notNull(),
  category: mealTypeEnum('category').notNull(),
  dietType: dietTypeEnum('diet_type').notNull(),
  spiceLevel: spiceLevelEnum('spice_level').notNull(),
  region: regionEnum('region').notNull(),
  image: text('image').notNull(),
  cookTime: text('cook_time').notNull(),
  servings: integer('servings').notNull(),
  calories: integer('calories').notNull(),
  protein: integer('protein').notNull(),
  carbs: integer('carbs').notNull(),
  fat: integer('fat').notNull(),
  description: text('description').notNull(),
  ingredients: text('ingredients').array().notNull(),
  steps: text('steps').array().notNull(),
  stepImages: text('step_images').array().notNull(),
  tips: text('tips').array().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Chat history table (for AI chat feature)
export const chatHistory = pgTable('chat_history', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id').notNull(),
  role: text('role').notNull(), // 'user' or 'assistant'
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;
export type ChatMessage = typeof chatHistory.$inferSelect;
export type NewChatMessage = typeof chatHistory.$inferInsert;
