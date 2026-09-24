import type { RecipeContent } from '../../domain/food/recipe'
import { recipesA } from './recipes-a'
import { recipesB } from './recipes-b'

/** Every seeded recipe. Validated by tests/unit/recipes-content.test.ts. */
export const seedRecipes: RecipeContent[] = [...recipesA, ...recipesB]
