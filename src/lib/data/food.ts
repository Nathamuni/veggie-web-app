import 'server-only'
import { and, desc, eq, gte, isNotNull, sql } from 'drizzle-orm'
import { getDb } from '@/db/client'
import { mealLogs, recipes, savedRecipes, type RecipeRow } from '@/db/schema'
import { addDays, istDate, weekStartOf } from '@/domain/journey/week'
import type { PickInput, PickSignals } from '@/domain/recommendation/today'
import { totalMinutes } from '@/domain/food/recipe'

/** All published recipes. ~40 rows, so one query serves list, filters and ranking. */
export async function listRecipes(): Promise<RecipeRow[]> {
  return getDb().select().from(recipes).where(eq(recipes.published, true)).orderBy(recipes.name)
}

export async function getRecipe(id: string): Promise<RecipeRow | null> {
  const [row] = await getDb()
    .select()
    .from(recipes)
    .where(and(eq(recipes.id, id), eq(recipes.published, true)))
    .limit(1)
  return row ?? null
}

/**
 * Community satisfaction from real thumbs, on a 1–5 scale
 * (all thumbs-down = 1, all thumbs-up = 5). Recipes nobody rated are absent.
 */
export async function recipeRatings(): Promise<Map<string, { avg: number; count: number }>> {
  const rows = await getDb()
    .select({
      recipeId: mealLogs.recipeId,
      count: sql<number>`count(*)::int`,
      likedShare: sql<number>`avg(case when ${mealLogs.liked} then 1.0 else 0.0 end)::float`,
    })
    .from(mealLogs)
    .where(and(isNotNull(mealLogs.recipeId), isNotNull(mealLogs.liked)))
    .groupBy(mealLogs.recipeId)
  return new Map(rows.map((r) => [r.recipeId!, { avg: 1 + 4 * r.likedShare, count: r.count }]))
}

export function toPickInput(r: RecipeRow, ratings: Map<string, { avg: number; count: number }>): PickInput {
  const rating = ratings.get(r.id)
  return {
    id: r.id,
    name: r.name,
    cuisine: r.cuisine,
    dietMode: r.dietMode,
    tags: r.tags,
    timeMinutes: totalMinutes(r),
    protein: r.protein,
    spice: r.spice,
    // Unrated recipes sit at a neutral 4 so ranking is driven by fit, not noise.
    satisfactionAvg: rating?.avg ?? 4,
    satisfactionCount: rating?.count ?? 0,
  }
}

/** What this user's own history says: likes, dislikes, recent dishes, cuisine lean. */
export async function userSignals(userId: string, recipesById: Map<string, RecipeRow>): Promise<PickSignals> {
  const rows = await getDb()
    .select({ recipeId: mealLogs.recipeId, liked: mealLogs.liked, eatenOn: mealLogs.eatenOn })
    .from(mealLogs)
    .where(and(eq(mealLogs.userId, userId), isNotNull(mealLogs.recipeId)))
    .orderBy(desc(mealLogs.createdAt))
    .limit(300)

  const recentFrom = addDays(istDate(), -3)
  const liked = new Set<string>()
  const disliked = new Set<string>()
  const recent = new Set<string>()
  const affinity: Record<string, number> = {}
  const rated = new Set<string>()

  for (const row of rows) {
    const id = row.recipeId!
    if (row.eatenOn >= recentFrom) recent.add(id)
    if (row.liked === null) continue
    const cuisine = recipesById.get(id)?.cuisine
    if (cuisine) affinity[cuisine] = (affinity[cuisine] ?? 0) + (row.liked ? 1 : -1)
    if (rated.has(id)) continue // newest rating per recipe wins
    rated.add(id)
    ;(row.liked ? liked : disliked).add(id)
  }
  return { likedRecipes: liked, dislikedRecipes: disliked, recentRecipes: recent, cuisineAffinity: affinity }
}

export async function savedRecipeIds(userId: string): Promise<Set<string>> {
  const rows = await getDb()
    .select({ recipeId: savedRecipes.recipeId })
    .from(savedRecipes)
    .where(eq(savedRecipes.userId, userId))
  return new Set(rows.map((r) => r.recipeId))
}

/** Logs from the start of the week `weeks - 1` weeks ago, newest first. */
export async function recentMealLogs(userId: string, weeks = 8) {
  const from = addDays(weekStartOf(istDate()), -7 * (weeks - 1))
  return getDb()
    .select()
    .from(mealLogs)
    .where(and(eq(mealLogs.userId, userId), gte(mealLogs.eatenOn, from)))
    .orderBy(desc(mealLogs.eatenOn), desc(mealLogs.createdAt))
}

/** How many times this user has logged each recipe — "cooked 3 times". */
export async function timesCooked(userId: string, recipeId: string): Promise<number> {
  const [row] = await getDb()
    .select({ n: sql<number>`count(*)::int` })
    .from(mealLogs)
    .where(and(eq(mealLogs.userId, userId), eq(mealLogs.recipeId, recipeId)))
  return row?.n ?? 0
}
