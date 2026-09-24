'use server'

import { revalidatePath } from 'next/cache'
import { and, eq, gte } from 'drizzle-orm'
import { z } from 'zod'
import { getDb } from '@/db/client'
import { mealLogs, recipes, savedRecipes } from '@/db/schema'
import { addDays, istDate, weekStartOf, weeklyProgress, type WeekProgress } from '@/domain/journey/week'
import { findSwapRule } from '@/lib/fixtures/swaps'
import { requireOnboardedUser } from '@/lib/auth/session'

export type LogResult =
  | {
      ok: true
      logId: string
      name: string
      diet: 'vegan' | 'vegetarian' | 'meat'
      progress: WeekProgress
      /** For a meat meal: a similar plant dish to try next time. */
      swap?: { id: string; name: string; why: string }
    }
  | { ok: false; error: string }
  | undefined

const LogInput = z.object({
  name: z.string().trim().min(1, 'What did you eat?').max(120),
  recipeId: z.string().max(80).optional().or(z.literal('')),
  diet: z.enum(['vegan', 'vegetarian', 'meat']),
  slot: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  source: z.enum(['cooked', 'ate_out', 'other']),
  day: z.enum(['today', 'yesterday']).default('today'),
})

export async function logMeal(_: LogResult, formData: FormData): Promise<LogResult> {
  const user = await requireOnboardedUser()
  const parsed = LogInput.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Check the meal details.' }

  const input = parsed.data
  const db = getDb()
  let recipeId: string | null = null
  let diet = input.diet
  if (input.recipeId) {
    const [recipe] = await db.select({ id: recipes.id, dietMode: recipes.dietMode }).from(recipes).where(eq(recipes.id, input.recipeId)).limit(1)
    if (recipe) {
      recipeId = recipe.id
      diet = recipe.dietMode // a seeded recipe's mode is known, never guessed
    }
  }

  const today = istDate()
  const eatenOn = input.day === 'yesterday' ? addDays(today, -1) : today
  const [log] = await db
    .insert(mealLogs)
    .values({ userId: user.id, eatenOn, slot: input.slot, source: input.source, diet, recipeId, name: input.name })
    .returning({ id: mealLogs.id })

  const weekStart = weekStartOf(today)
  const weekLogs = await db
    .select({ eatenOn: mealLogs.eatenOn, diet: mealLogs.diet })
    .from(mealLogs)
    .where(and(eq(mealLogs.userId, user.id), gte(mealLogs.eatenOn, weekStart)))

  let swap: { id: string; name: string; why: string } | undefined
  if (diet === 'meat') {
    const rule = findSwapRule(input.name)
    const alt = rule?.alternatives.find(
      (a) => a.target.kind === 'recipe' && (user.profile.dietMode === 'vegetarian' || a.dietMode === 'vegan'),
    )
    if (alt) swap = { id: alt.target.id, name: alt.name, why: alt.reasons[0]?.text ?? '' }
  }

  revalidatePath('/app', 'layout')
  return {
    ok: true,
    logId: log.id,
    name: input.name,
    diet,
    progress: weeklyProgress(weekLogs, user.profile.weeklyPlantTarget, weekStart),
    swap,
  }
}

const Rating = z.object({
  logId: z.uuid(),
  liked: z.enum(['up', 'down']).optional(),
  fullness: z.coerce.number().int().min(1).max(5).optional(),
})

/** Thumbs and fullness after eating — this is what the recommendations learn from. */
export async function rateMeal(input: { logId: string; liked?: 'up' | 'down'; fullness?: number }) {
  const user = await requireOnboardedUser()
  const parsed = Rating.safeParse(input)
  if (!parsed.success) return { ok: false as const }
  const { logId, liked, fullness } = parsed.data
  await getDb()
    .update(mealLogs)
    .set({
      ...(liked ? { liked: liked === 'up' } : {}),
      ...(fullness ? { fullness } : {}),
    })
    .where(and(eq(mealLogs.id, logId), eq(mealLogs.userId, user.id)))
  revalidatePath('/app', 'layout')
  return { ok: true as const }
}

export async function deleteMeal(formData: FormData) {
  const user = await requireOnboardedUser()
  const id = z.uuid().safeParse(formData.get('logId'))
  if (!id.success) return
  await getDb()
    .delete(mealLogs)
    .where(and(eq(mealLogs.id, id.data), eq(mealLogs.userId, user.id)))
  revalidatePath('/app', 'layout')
}

export async function toggleSaved(recipeId: string): Promise<{ saved: boolean }> {
  const user = await requireOnboardedUser()
  const id = z.string().min(1).max(80).parse(recipeId)
  const db = getDb()
  const where = and(eq(savedRecipes.userId, user.id), eq(savedRecipes.recipeId, id))
  const [existing] = await db.select().from(savedRecipes).where(where).limit(1)
  if (existing) {
    await db.delete(savedRecipes).where(where)
  } else {
    const [recipe] = await db.select({ id: recipes.id }).from(recipes).where(eq(recipes.id, id)).limit(1)
    if (!recipe) return { saved: false }
    await db.insert(savedRecipes).values({ userId: user.id, recipeId: id }).onConflictDoNothing()
  }
  revalidatePath('/app/recipes')
  return { saved: !existing }
}
