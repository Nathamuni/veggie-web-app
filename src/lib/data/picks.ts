import 'server-only'
import type { Profile, RecipeRow } from '@/db/schema'
import { rankPicks, type MealSlot, type Pick } from '@/domain/recommendation/today'
import { listRecipes, recipeRatings, toPickInput, userSignals } from './food'

/** The ranked shortlist for a user and meal slot, learning from their own thumbs and history. */
export async function picksFor(
  userId: string,
  profile: Profile,
  slot: MealSlot,
  isWeekend: boolean,
  limit = 5,
): Promise<{ picks: Pick[]; recipesById: Map<string, RecipeRow> }> {
  const [all, ratings] = await Promise.all([listRecipes(), recipeRatings()])
  const recipesById = new Map(all.map((r) => [r.id, r]))
  const signals = await userSignals(userId, recipesById)
  const picks = rankPicks(
    all.map((r) => toPickInput(r, ratings)),
    { dietMode: profile.dietMode, cuisines: profile.cuisines, spice: profile.spice, maxCookMinutes: profile.maxCookMinutes },
    slot,
    isWeekend,
    limit,
    signals,
  )
  return { picks, recipesById }
}
