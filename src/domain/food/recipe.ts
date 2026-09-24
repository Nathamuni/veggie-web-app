/**
 * A cookable recipe: exact quantities, a full method, approximate nutrition.
 *
 * This is the content contract for seeded recipes. `validateRecipe` is the
 * gate — a recipe that cannot be cooked from its own page (missing amounts,
 * one-line method, no servings) never reaches the database.
 */

export type DietMode = 'vegetarian' | 'vegan'
export type Spice = 'mild' | 'medium' | 'fiery'
export type ProteinBand = 'high' | 'medium' | 'low'
export type Difficulty = 'easy' | 'medium' | 'involved'
export type CostBand = '₹' | '₹₹' | '₹₹₹'

export const UNITS = [
  'g',
  'kg',
  'ml',
  'l',
  'cup',
  'tbsp',
  'tsp',
  'pinch',
  'piece',
  'clove',
  'sprig',
  'inch',
  'handful',
  'to taste',
] as const
export type Unit = (typeof UNITS)[number]

/** `qty` is null only when the unit is "to taste". */
export type Ingredient = { qty: number | null; unit: Unit; item: string; note?: string }

/** `timerMin` is set when the step has a clear duration (simmer 10 min, soak 30 min). */
export type Step = { text: string; timerMin?: number }

/** Per serving, approximate — shown with an "approx" label, never as a measured value. */
export type Nutrition = { kcal: number; proteinG: number; carbsG: number; fatG: number; fibreG: number }

export const RECIPE_TAGS = [
  'Quick',
  'High protein',
  'Regional',
  'Weekend',
  'Breakfast',
  'One-pot',
  'Jain-friendly',
  'Budget',
  'Kid-friendly',
  'Tiffin box',
] as const
export type RecipeTag = (typeof RECIPE_TAGS)[number]

export type RecipeContent = {
  /** kebab-case slug, stable — used in URLs and meal logs. */
  id: string
  name: string
  cuisine: string
  dietMode: DietMode
  /** One sentence: what it is and why you'd make it. */
  description: string
  servings: number
  prepMinutes: number
  cookMinutes: number
  difficulty: Difficulty
  spice: Spice
  protein: ProteinBand
  costBand: CostBand
  tags: RecipeTag[]
  ingredients: Ingredient[]
  steps: Step[]
  nutrition: Nutrition
}

export function totalMinutes(r: Pick<RecipeContent, 'prepMinutes' | 'cookMinutes'>) {
  return r.prepMinutes + r.cookMinutes
}

/** Animal products that make a recipe not vegan. Checked against ingredient names. */
const NON_VEGAN =
  /(?<!\b(?:coconut|almond|soy|soya|oat|peanut|cashew|plant|vegan) )\b(ghee|butter|paneer|curd|yogurt|yoghurt|milk|cream|cheese|khoa|honey|malai|buttermilk|parmesan)\b/i
/** Never allowed in either mode. */
const NON_VEG = /\b(eggs?|chicken|mutton|fish|prawns?|meat|gelatine?|lard|anchov\w*)\b/i

export function validateRecipe(r: RecipeContent): string[] {
  const errors: string[] = []
  const at = (msg: string) => errors.push(`${r.id}: ${msg}`)

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(r.id)) at('id must be kebab-case')
  if (!r.name.trim()) at('name is empty')
  if (r.description.trim().length < 20) at('description too short')
  if (!Number.isInteger(r.servings) || r.servings < 1 || r.servings > 12) at('servings must be 1–12')
  if (r.prepMinutes < 0 || r.cookMinutes < 0 || totalMinutes(r) < 5) at('times look wrong')
  if (r.ingredients.length < 4) at('needs at least 4 ingredients')
  if (r.steps.length < 5) at('needs at least 5 steps')

  for (const ing of r.ingredients) {
    if (!(UNITS as readonly string[]).includes(ing.unit)) at(`unknown unit "${ing.unit}" for ${ing.item}`)
    if (ing.unit === 'to taste') {
      if (ing.qty !== null) at(`${ing.item}: "to taste" must have qty null`)
    } else if (typeof ing.qty !== 'number' || !(ing.qty > 0)) {
      at(`${ing.item}: missing quantity`)
    }
    if (NON_VEG.test(ing.item)) at(`${ing.item}: not vegetarian`)
    if (r.dietMode === 'vegan' && NON_VEGAN.test(ing.item)) at(`${ing.item}: not vegan`)
  }

  for (const [i, step] of r.steps.entries()) {
    if (step.text.trim().length < 25) at(`step ${i + 1} is too thin`)
    if (step.timerMin !== undefined && !(step.timerMin > 0 && step.timerMin <= 480)) at(`step ${i + 1} timer out of range`)
  }

  const n = r.nutrition
  if (!(n.kcal > 50 && n.kcal < 1500)) at('kcal out of range')
  for (const k of ['proteinG', 'carbsG', 'fatG', 'fibreG'] as const) {
    if (!(n[k] >= 0 && n[k] < 200)) at(`${k} out of range`)
  }
  // "Quick" means quick end to end — not 25 minutes after an overnight soak.
  if (r.tags.includes('Quick') && (totalMinutes(r) > 30 || r.steps.some((s) => (s.timerMin ?? 0) > 60))) {
    at('tagged Quick but takes longer than 30 min or needs a long soak/ferment')
  }
  for (const t of r.tags) if (!(RECIPE_TAGS as readonly string[]).includes(t)) at(`unknown tag ${t}`)

  return errors
}
