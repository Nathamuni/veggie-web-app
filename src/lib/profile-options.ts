/** Choices shared by onboarding and settings, so both always offer the same options. */

export const ONBOARDING_STEPS = 4

export const GOALS = [
  { id: 'reduce_meat', label: 'Eat less meat', hint: 'Swap some meals, keep the food you love' },
  { id: 'stop_red_meat', label: 'Stop red meat', hint: 'Chicken or fish is still fine for now' },
  { id: 'become_vegetarian', label: 'Go vegetarian', hint: 'Step by step, at your pace' },
  { id: 'become_vegan', label: 'Go vegan', hint: 'Dairy-free, egg-free, plant-only' },
  { id: 'more_veg_meals', label: 'Already veg — want more variety', hint: 'New dishes, more protein' },
] as const

export const DIET_MODES = [
  { id: 'vegetarian', label: 'Vegetarian', hint: 'Show dishes with dairy (paneer, curd, ghee) and vegan dishes' },
  { id: 'vegan', label: 'Vegan', hint: 'Only fully plant-based dishes — no dairy, no honey' },
] as const

export const CUISINE_GROUPS = [
  { name: 'South', options: ['Tamil', 'Chettinad', 'Kerala', 'Andhra', 'Telangana', 'Karnataka'] },
  { name: 'North & West', options: ['Punjabi', 'North Indian', 'Rajasthani', 'Gujarati', 'Maharashtrian'] },
  { name: 'East & beyond', options: ['Bengali', 'Continental'] },
] as const

export const SPICE_LEVELS = [
  { id: 'mild', label: 'Mild' },
  { id: 'medium', label: 'Medium' },
  { id: 'fiery', label: 'Fiery' },
] as const

export const COOK_TIMES = [
  { minutes: 20, label: '20 min' },
  { minutes: 30, label: '30 min' },
  { minutes: 45, label: '45 min' },
  { minutes: 60, label: '1 hour+' },
] as const

export function goalLabel(id: string) {
  return GOALS.find((g) => g.id === id)?.label ?? id
}

/** A sensible starting plant-meal target from the user's usual meat meals. */
export function suggestedPlantTarget(baselineMeatMeals: number) {
  const plantNow = 21 - baselineMeatMeals
  return Math.min(21, Math.max(3, plantNow + Math.max(2, Math.round(baselineMeatMeals / 4))))
}
