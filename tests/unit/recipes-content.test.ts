import { describe, expect, it } from 'vitest'
import { seedRecipes } from '@/db/seed/recipes'
import { validateRecipe, type RecipeContent } from '@/domain/food/recipe'

describe('seeded recipe content', () => {
  it('has the full reviewed set with unique ids', () => {
    expect(seedRecipes.length).toBeGreaterThanOrEqual(40)
    expect(new Set(seedRecipes.map((r) => r.id)).size).toBe(seedRecipes.length)
  })

  it('every recipe is cookable from its own page', () => {
    expect(seedRecipes.flatMap(validateRecipe)).toEqual([])
  })

  it('offers both vegetarian and vegan dishes', () => {
    const modes = new Set(seedRecipes.map((r) => r.dietMode))
    expect(modes).toEqual(new Set(['vegetarian', 'vegan']))
  })
})

describe('validateRecipe', () => {
  const good: RecipeContent = {
    id: 'test-dal',
    name: 'Test Dal',
    cuisine: 'Tamil',
    dietMode: 'vegan',
    description: 'A simple everyday dal for testing.',
    servings: 2,
    prepMinutes: 5,
    cookMinutes: 20,
    difficulty: 'easy',
    spice: 'mild',
    protein: 'medium',
    costBand: '₹',
    tags: ['Quick'],
    ingredients: [
      { qty: 0.5, unit: 'cup', item: 'Toor dal' },
      { qty: 1, unit: 'tsp', item: 'Mustard seeds' },
      { qty: 1, unit: 'tbsp', item: 'Coconut milk' },
      { qty: null, unit: 'to taste', item: 'Salt' },
    ],
    steps: Array.from({ length: 5 }, (_, i) => ({ text: `Step ${i + 1}: stir the dal gently over medium heat.` })),
    nutrition: { kcal: 250, proteinG: 12, carbsG: 35, fatG: 5, fibreG: 8 },
  }

  it('accepts a complete vegan recipe (coconut milk is plant-based)', () => {
    expect(validateRecipe(good)).toEqual([])
  })

  it('rejects dairy in a vegan recipe and missing quantities', () => {
    const bad = { ...good, ingredients: [...good.ingredients, { qty: 0, unit: 'tbsp' as const, item: 'Ghee' }] }
    const errors = validateRecipe(bad).join('\n')
    expect(errors).toMatch(/Ghee: missing quantity/)
    expect(errors).toMatch(/Ghee: not vegan/)
  })

  it('rejects egg but not eggplant', () => {
    const withEgg = { ...good, ingredients: [...good.ingredients, { qty: 1, unit: 'piece' as const, item: 'Egg' }] }
    const withBrinjal = { ...good, ingredients: [...good.ingredients, { qty: 1, unit: 'piece' as const, item: 'Eggplant' }] }
    expect(validateRecipe(withEgg).join()).toMatch(/not vegetarian/)
    expect(validateRecipe(withBrinjal)).toEqual([])
  })

  it('rejects "Quick" on a dish that needs an overnight soak', () => {
    const soaked = { ...good, steps: [{ text: 'Soak the dal overnight in plenty of water.', timerMin: 480 }, ...good.steps] }
    expect(validateRecipe(soaked).join()).toMatch(/tagged Quick/)
  })
})
