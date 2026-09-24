/**
 * Upserts the reviewed recipe set. Safe to run repeatedly: existing recipes are
 * updated in place, so meal logs that point at them keep working.
 *
 *   npm run db:seed
 */
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import { sql } from 'drizzle-orm'
import postgres from 'postgres'
import { recipes } from '../../src/db/schema/food'
import { seedRecipes } from '../../src/db/seed/recipes'
import { validateRecipe } from '../../src/domain/food/recipe'

config({ path: '.env.local', quiet: true })

async function main() {
  const errors = seedRecipes.flatMap(validateRecipe)
  if (errors.length) throw new Error(`Recipe content failed validation:\n${errors.join('\n')}`)

  const client = postgres(process.env.DATABASE_URL!, { max: 1, onnotice: () => {} })
  const db = drizzle(client, { casing: 'snake_case' })
  try {
    await db
      .insert(recipes)
      .values(seedRecipes.map((r) => ({ ...r, published: true })))
      .onConflictDoUpdate({
        target: recipes.id,
        set: Object.fromEntries(
          [
            'name', 'cuisine', 'diet_mode', 'description', 'servings', 'prep_minutes', 'cook_minutes',
            'difficulty', 'spice', 'protein', 'cost_band', 'tags', 'ingredients', 'steps', 'nutrition',
          ].map((col) => [col.replace(/_(\w)/g, (_, c: string) => c.toUpperCase()), sql.raw(`excluded.${col}`)]),
        ),
      })
    console.log(`Seeded ${seedRecipes.length} recipes.`)
  } finally {
    await client.end()
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
