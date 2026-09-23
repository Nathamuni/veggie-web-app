export type MealLog = {
  id: string;
  date: string;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  name: string;
  dietClassification: "vegetarian" | "vegan" | "meat";
  satisfaction?: {
    taste: number;
    fullness: number;
    texture: number;
    portion: number;
    cravingSatisfied: number;
    wouldEatAgain: boolean;
  };
  barrier?: string;
};

// Synthetic demo data — fake user, spans onboarding (2026-08-25) through "today" (2026-09-22).
// Weekly meat-meal counts are written to roughly match fixtures/core.ts progressTrend (8 → 7 → 6 → 5).
export const mealLogs: MealLog[] = [
  // --- 2026-09-22 (today) ---
  { id: "log-1", date: "2026-09-22", mealType: "Breakfast", name: "Millet idli + sambar", dietClassification: "vegetarian", satisfaction: { taste: 4, fullness: 4, texture: 5, portion: 4, cravingSatisfied: 4, wouldEatAgain: true } },

  // --- Week 4 (2026-09-15 to 2026-09-21) — current week, target ~5 meat meals ---
  { id: "log-2", date: "2026-09-21", mealType: "Dinner", name: "Chettinad Soya Curry + Millet", dietClassification: "vegetarian", satisfaction: { taste: 5, fullness: 4, texture: 4, portion: 5, cravingSatisfied: 5, wouldEatAgain: true } },
  { id: "log-3", date: "2026-09-21", mealType: "Lunch", name: "Chicken curry (family lunch)", dietClassification: "meat", barrier: "Eating with family; no vegetarian option served" },
  { id: "log-4", date: "2026-09-20", mealType: "Dinner", name: "Millet Sambar Combo", dietClassification: "vegan", satisfaction: { taste: 4, fullness: 3, texture: 4, portion: 3, cravingSatisfied: 3, wouldEatAgain: true } },
  { id: "log-5", date: "2026-09-19", mealType: "Lunch", name: "Paneer Bhurji Wrap", dietClassification: "vegetarian", satisfaction: { taste: 4, fullness: 3, texture: 4, portion: 4, cravingSatisfied: 4, wouldEatAgain: true } },
  { id: "log-6", date: "2026-09-19", mealType: "Dinner", name: "Mutton biryani", dietClassification: "meat", barrier: "Weekend family gathering; non-veg was the default" },
  { id: "log-7", date: "2026-09-18", mealType: "Dinner", name: "Fish fry + rice", dietClassification: "meat", barrier: "Team dinner out, limited vegetarian menu" },
  { id: "log-8", date: "2026-09-17", mealType: "Dinner", name: "Egg curry + rice", dietClassification: "meat", barrier: "Craving hit and nothing vegetarian was planned" },
  { id: "log-9", date: "2026-09-16", mealType: "Dinner", name: "Chicken curry + rice", dietClassification: "meat", barrier: "Family dinner; dad cooked non-veg that night" },
  { id: "log-10", date: "2026-09-15", mealType: "Breakfast", name: "Millet idli + sambar", dietClassification: "vegetarian", satisfaction: { taste: 4, fullness: 4, texture: 4, portion: 3, cravingSatisfied: 4, wouldEatAgain: true } },

  // --- Week 3 (2026-09-08 to 2026-09-14) — target ~6 meat meals ---
  { id: "log-11", date: "2026-09-14", mealType: "Breakfast", name: "Oats upma", dietClassification: "vegetarian", satisfaction: { taste: 3, fullness: 3, texture: 2, portion: 3, cravingSatisfied: 2, wouldEatAgain: false } },
  { id: "log-12", date: "2026-09-14", mealType: "Lunch", name: "Fish fry", dietClassification: "meat", barrier: "Coworker lunch order, no vegetarian choice available" },
  { id: "log-13", date: "2026-09-13", mealType: "Dinner", name: "Egg curry + rice", dietClassification: "meat", barrier: "Ran out of time to cook a vegetarian dinner" },
  { id: "log-14", date: "2026-09-12", mealType: "Lunch", name: "Chicken biryani", dietClassification: "meat", barrier: "Weekend treat with family" },
  { id: "log-15", date: "2026-09-11", mealType: "Dinner", name: "Mutton chukka", dietClassification: "meat", barrier: "Craving satisfied instead of cooking vegetarian" },
  { id: "log-16", date: "2026-09-10", mealType: "Lunch", name: "Fish curry + rice", dietClassification: "meat", barrier: "Only a non-vegetarian tiffin center was nearby" },
  { id: "log-17", date: "2026-09-09", mealType: "Lunch", name: "Sambar rice + poriyal", dietClassification: "vegan", satisfaction: { taste: 4, fullness: 4, texture: 4, portion: 4, cravingSatisfied: 3, wouldEatAgain: true } },
  { id: "log-18", date: "2026-09-08", mealType: "Dinner", name: "Chicken curry + rice", dietClassification: "meat", barrier: "Eating with family who chose the meal" },

  // --- Week 2 (2026-09-01 to 2026-09-07) — target ~7 meat meals ---
  { id: "log-19", date: "2026-09-07", mealType: "Breakfast", name: "Egg dosa", dietClassification: "meat", barrier: "Quick protein before an early meeting" },
  { id: "log-20", date: "2026-09-06", mealType: "Lunch", name: "Egg biryani", dietClassification: "meat", barrier: "Family Sunday lunch tradition" },
  { id: "log-21", date: "2026-09-05", mealType: "Dinner", name: "Chicken 65 + rice", dietClassification: "meat", barrier: "Weekend outing with friends, no vegetarian menu" },
  { id: "log-22", date: "2026-09-04", mealType: "Lunch", name: "Mutton curry + rice", dietClassification: "meat", barrier: "Craving hit and nothing vegetarian was planned" },
  { id: "log-23", date: "2026-09-03", mealType: "Dinner", name: "Vegetable kootu + rice", dietClassification: "vegan", satisfaction: { taste: 3, fullness: 4, texture: 3, portion: 4, cravingSatisfied: 3, wouldEatAgain: true } },
  { id: "log-24", date: "2026-09-03", mealType: "Lunch", name: "Fish fry", dietClassification: "meat", barrier: "Time pressure, grabbed whatever was fastest" },
  { id: "log-25", date: "2026-09-02", mealType: "Lunch", name: "Fish curry + rice", dietClassification: "meat", barrier: "No vegetarian tiffin available nearby" },
  { id: "log-26", date: "2026-09-01", mealType: "Dinner", name: "Chicken curry + rice", dietClassification: "meat", barrier: "Family meal, no vegetarian option served" },

  // --- Week 1 (2026-08-25 to 2026-08-31) — baseline, target ~8 meat meals ---
  { id: "log-27", date: "2026-08-31", mealType: "Dinner", name: "Fish curry + rice", dietClassification: "meat", barrier: "Wanted comfort food after a long day" },
  { id: "log-28", date: "2026-08-31", mealType: "Breakfast", name: "Egg omelette + toast", dietClassification: "meat", barrier: "Quick and easy before work" },
  { id: "log-29", date: "2026-08-30", mealType: "Lunch", name: "Chicken chettinad", dietClassification: "meat", barrier: "Ran out of time to cook, ordered in" },
  { id: "log-30", date: "2026-08-29", mealType: "Dinner", name: "Mutton biryani", dietClassification: "meat", barrier: "Weekend family gathering; non-veg was the default" },
  { id: "log-31", date: "2026-08-28", mealType: "Lunch", name: "Chicken biryani", dietClassification: "meat", barrier: "Colleague's birthday treat, only biryani was ordered" },
  { id: "log-32", date: "2026-08-27", mealType: "Dinner", name: "Fish fry + rice", dietClassification: "meat", barrier: "Craving hit and nothing vegetarian was planned" },
  { id: "log-33", date: "2026-08-26", mealType: "Lunch", name: "Chicken curry + rice", dietClassification: "meat", barrier: "No vegetarian option at the office canteen" },
  { id: "log-34", date: "2026-08-25", mealType: "Dinner", name: "Mutton curry + rice", dietClassification: "meat", barrier: "Eating with family who chose the meal" },
];

export const barrierOptions = [
  "Eating with family/friends who chose the place",
  "No vegetarian option available",
  "Craving hit and nothing planned",
  "Ran out of time to cook",
  "Wanted to save money",
  "Team dinner or work event, limited vegetarian menu",
  "Family tradition/expectation at this meal",
  "Prefer not to say",
];

export type RouteMeal = Pick<MealLog, "id" | "name" | "mealType" | "dietClassification">;

/**
 * The prototype has no persistence, so a just-saved meal travels in the URL:
 * `/app/log/new?name=…&diet=…&type=…`. Existing fixture ids resolve from mealLogs.
 */
export function resolveRouteMeal(
  id: string,
  query: { name?: string; diet?: string; type?: string },
): RouteMeal | undefined {
  if (id !== "new") return mealLogs.find((m) => m.id === id);
  const diet = query.diet === "meat" || query.diet === "vegan" ? query.diet : "vegetarian";
  const type = (["Breakfast", "Lunch", "Dinner", "Snack"] as const).find((t) => t === query.type) ?? "Dinner";
  return { id: "new", name: query.name?.trim() || "Your meal", mealType: type, dietClassification: diet };
}

export function mealQuery(m: RouteMeal): string {
  if (m.id !== "new") return "";
  return `?${new URLSearchParams({ name: m.name, diet: m.dietClassification, type: m.mealType })}`;
}
