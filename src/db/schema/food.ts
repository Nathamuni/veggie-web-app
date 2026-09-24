import { sql } from 'drizzle-orm'
import {
  boolean,
  date,
  index,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import type { Ingredient, Nutrition, Step } from '../../domain/food/recipe'
import { users } from './identity'

const now = sql`now()`

/** Vegetarian and vegan are separate modes everywhere, never a display preference (PRODUCT.md). */
export const dietMode = pgEnum('diet_mode', ['vegetarian', 'vegan'])
export const spiceLevel = pgEnum('spice_level', ['mild', 'medium', 'fiery'])
export const proteinBand = pgEnum('protein_band', ['high', 'medium', 'low'])
export const difficulty = pgEnum('difficulty', ['easy', 'medium', 'involved'])

export const transitionGoal = pgEnum('transition_goal', [
  'reduce_meat',
  'stop_red_meat',
  'become_vegetarian',
  'become_vegan',
  'more_veg_meals',
])

export const mealSlot = pgEnum('meal_slot', ['breakfast', 'lunch', 'dinner', 'snack'])
/** What the logged meal actually was. `meat` covers fish and eggs too — anything animal-flesh or egg. */
export const mealDiet = pgEnum('meal_diet', ['vegan', 'vegetarian', 'meat'])
export const mealSource = pgEnum('meal_source', ['cooked', 'ate_out', 'other'])

/**
 * The food profile, kept apart from `users` so authentication data and
 * dietary data stay separable (PRD 8). One row per user, created at sign-up
 * and filled in by onboarding.
 */
export const profiles = pgTable('profiles', {
  userId: uuid()
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),

  goal: transitionGoal().notNull().default('reduce_meat'),
  dietMode: dietMode().notNull().default('vegetarian'),
  /** Meat meals in a typical week before starting — the reduction baseline. */
  baselineMeatMeals: smallint().notNull().default(7),
  /** Plant-based meals the user is aiming for each week. */
  weeklyPlantTarget: smallint().notNull().default(10),

  cuisines: text().array().notNull().default(sql`'{}'::text[]`),
  spice: spiceLevel().notNull().default('medium'),
  maxCookMinutes: smallint().notNull().default(45),

  city: text(),
  area: text(),

  /** Last onboarding step saved, so a refresh resumes rather than restarts. */
  onboardingStep: smallint().notNull().default(0),
  onboardedAt: timestamp({ withTimezone: true }),

  createdAt: timestamp({ withTimezone: true }).notNull().default(now),
  updatedAt: timestamp({ withTimezone: true }).notNull().default(now),
})

/**
 * Seeded, reviewed recipes. Ingredients and steps are ordered lists that are
 * always read and written with the recipe, so they live as jsonb on the row.
 */
export const recipes = pgTable(
  'recipes',
  {
    id: text().primaryKey(),
    name: text().notNull(),
    cuisine: text().notNull(),
    dietMode: dietMode().notNull(),
    description: text().notNull(),

    servings: smallint().notNull(),
    prepMinutes: smallint().notNull(),
    cookMinutes: smallint().notNull(),
    difficulty: difficulty().notNull(),
    spice: spiceLevel().notNull(),
    protein: proteinBand().notNull(),
    costBand: text().notNull(),
    tags: text().array().notNull().default(sql`'{}'::text[]`),

    ingredients: jsonb().$type<Ingredient[]>().notNull(),
    steps: jsonb().$type<Step[]>().notNull(),
    /** Per serving, approximate. */
    nutrition: jsonb().$type<Nutrition>().notNull(),

    published: boolean().notNull().default(true),
    createdAt: timestamp({ withTimezone: true }).notNull().default(now),
    updatedAt: timestamp({ withTimezone: true }).notNull().default(now),
  },
  (table) => [index('recipes_diet_cuisine_idx').on(table.dietMode, table.cuisine)],
)

/**
 * One row per thing the user ate. A meat meal is recorded like any other —
 * it never resets anything (reduction-first).
 */
export const mealLogs = pgTable(
  'meal_logs',
  {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    /** Local calendar date in India (Asia/Kolkata), YYYY-MM-DD. */
    eatenOn: date({ mode: 'string' }).notNull(),
    slot: mealSlot().notNull(),
    source: mealSource().notNull(),
    diet: mealDiet().notNull(),

    recipeId: text().references(() => recipes.id, { onDelete: 'set null' }),
    name: text().notNull(),

    /** Thumbs up / down; null until the user answers. */
    liked: boolean(),
    /** 1 still hungry … 5 very full; null until answered. */
    fullness: smallint(),

    createdAt: timestamp({ withTimezone: true }).notNull().default(now),
  },
  (table) => [
    index('meal_logs_user_date_idx').on(table.userId, table.eatenOn),
    index('meal_logs_recipe_idx').on(table.recipeId),
  ],
)

export const savedRecipes = pgTable(
  'saved_recipes',
  {
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    recipeId: text()
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    createdAt: timestamp({ withTimezone: true }).notNull().default(now),
  },
  (table) => [primaryKey({ columns: [table.userId, table.recipeId] })],
)

export type Profile = typeof profiles.$inferSelect
export type RecipeRow = typeof recipes.$inferSelect
export type MealLog = typeof mealLogs.$inferSelect
export type NewMealLog = typeof mealLogs.$inferInsert
