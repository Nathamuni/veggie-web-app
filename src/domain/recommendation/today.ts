/**
 * "What should I eat next?" — the Home screen's single best next action (PRD S08).
 *
 * Pure and deterministic so it can be unit-tested without the web layer.
 * Pipeline per PRD §7.1: hard filters first (never outranked), then score,
 * then explain with at most three reasons built from real fields — never
 * from hard-coded copy.
 */

export type MealSlot = 'breakfast' | 'lunch' | 'dinner'

export type PickInput = {
  id: string
  name: string
  cuisine: string
  dietMode: 'vegetarian' | 'vegan'
  tags: string[]
  timeMinutes: number
  protein: 'high' | 'medium' | 'low'
  spice: 'mild' | 'medium' | 'fiery'
  satisfactionAvg: number
  satisfactionCount: number
}

export type PickProfile = {
  dietMode: 'vegetarian' | 'vegan'
  cuisines: string[]
  spice: 'mild' | 'medium' | 'fiery'
  maxCookMinutes: number
}

export type Pick = { item: PickInput; score: number; reasons: string[] }

/** What the user has told us by eating and rating — the part that learns. */
export type PickSignals = {
  likedRecipes?: ReadonlySet<string>
  dislikedRecipes?: ReadonlySet<string>
  /** Cooked or eaten in the last few days — skipped so the pick doesn't repeat. */
  recentRecipes?: ReadonlySet<string>
  /** Net thumbs (up − down) per cuisine. */
  cuisineAffinity?: Readonly<Record<string, number>>
}

// Sub-regional cuisines count as the region a user picked (Chettinad is Tamil).
const CUISINE_FAMILY: Record<string, string> = { Chettinad: 'Tamil' }

export function mealSlotForHour(hour: number): MealSlot {
  if (hour < 11) return 'breakfast'
  if (hour < 16) return 'lunch'
  return 'dinner'
}

/** Vegan mode never sees a vegetarian-only item; vegetarian mode sees both. */
export function passesDietFilter(item: PickInput, profile: PickProfile) {
  return profile.dietMode === 'vegetarian' || item.dietMode === 'vegan'
}

export function rankPicks(
  items: PickInput[],
  profile: PickProfile,
  slot: MealSlot,
  isWeekend: boolean,
  limit = 3,
  signals: PickSignals = {},
): Pick[] {
  const eligible = items.filter((item) => passesDietFilter(item, profile))
  // Variety: drop recent dishes, unless that would leave nothing to suggest.
  const fresh = eligible.filter((item) => !signals.recentRecipes?.has(item.id))
  return (fresh.length > 0 ? fresh : eligible)
    .map((item) => {
      const reasons: { weight: number; text: string }[] = []
      let score = item.satisfactionAvg * 6 // satisfaction leads (PRD §7.2, 30%)

      const family = CUISINE_FAMILY[item.cuisine] ?? item.cuisine
      if (profile.cuisines.includes(family)) {
        score += 15
        reasons.push({ weight: 15, text: `${item.cuisine} — close to the ${family} food you eat` })
      }
      if (item.protein === 'high') {
        score += 10
        reasons.push({ weight: 10, text: 'High protein, so it keeps you full' })
      }
      if (item.timeMinutes <= profile.maxCookMinutes) {
        score += 5
        reasons.push({ weight: 5, text: `Ready in ${item.timeMinutes} min — within your cooking time` })
      } else {
        score -= 10
      }
      if (item.spice === profile.spice) {
        score += 5
        reasons.push({ weight: 5, text: `${item.spice[0].toUpperCase()}${item.spice.slice(1)}, the way you like it` })
      }
      // Long weekend dishes don't suit a weekday meal; quick ones suit breakfast.
      if (!isWeekend && item.tags.includes('Weekend')) score -= 8
      if (slot === 'breakfast' && item.tags.includes('Quick')) score += 4
      if (signals.likedRecipes?.has(item.id)) {
        score += 8
        reasons.push({ weight: 12, text: 'You gave this a thumbs up last time' })
      }
      if (signals.dislikedRecipes?.has(item.id)) score -= 30
      const affinity = signals.cuisineAffinity?.[item.cuisine] ?? 0
      score += Math.max(-9, Math.min(9, affinity * 3))
      if (item.satisfactionCount >= 5 && item.satisfactionAvg >= 4.4) {
        reasons.push({
          weight: 8,
          text: `Rated ${item.satisfactionAvg.toFixed(1)}/5 by ${item.satisfactionCount} Veggie cooks`,
        })
      }

      return {
        item,
        score,
        reasons: reasons
          .sort((a, b) => b.weight - a.weight)
          .slice(0, 3)
          .map((r) => r.text),
      }
    })
    .sort((a, b) => b.score - a.score || a.item.id.localeCompare(b.item.id))
    .slice(0, limit)
}
