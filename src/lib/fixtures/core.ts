import type { DietMode } from "./types";
import { recipes } from "./recipes";

export const user = {
  displayName: "Priya",
  email: "priya@example.com",
  city: "Chennai",
  area: "T. Nagar",
  goal: "Stop red meat" as const,
  dietMode: "vegetarian" as DietMode,
  cuisines: ["Tamil", "Kerala"],
  spiceLevel: "Medium-high",
  budgetBand: "₹100–200",
  cookingTime: "20–45 min",
  cookingSkill: "Confident",
  allergies: [] as string[],
  jain: false,
  eatsEggs: false,
  eatsDairy: true,
  onboardingCompletedAt: "2026-08-25T09:12:00+05:30",
};

export const dietBaseline = {
  confidence: "exact" as const,
  mealsPerWeek: {
    redMeat: 2,
    chicken: 5,
    fish: 1,
    eggs: 4,
    dairy: 7,
    vegetarian: 6,
    vegan: 1,
  },
};

export const weeklyTarget = {
  baselineMeatMealsPerWeek: 8,
  currentMeatMealsPerWeek: 5,
  targetMeatMealsPerWeek: 5,
  streakDays: 3,
  weekOf: "2026-09-15",
};

export const progressTrend = [
  { week: "Wk 1", meatMeals: 8 },
  { week: "Wk 2", meatMeals: 7 },
  { week: "Wk 3", meatMeals: 6 },
  { week: "Wk 4", meatMeals: 5 },
];

export const impact = {
  animalMealsAvoidedTotal: 41,
  timeframe: "since Aug 25, 2026" as const,
  byCategory: [
    { category: "Chicken", mealsAvoided: 22 },
    { category: "Red meat", mealsAvoided: 11 },
    { category: "Fish", mealsAvoided: 8 },
  ],
  methodologyVersion: "impact-factors-v0-draft",
  methodologyNote:
    "Estimated from your logged meat-meal reduction vs. baseline. Reference factors are pending legal review — figures are provisional.",
};

export const nextBestMeal = recipes.find((r) => r.id === "chettinad-soya-curry")!;
