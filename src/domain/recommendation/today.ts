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
): Pick[] {
  return items
    .filter((item) => passesDietFilter(item, profile))
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
        reasons.push({ weight: 6, text: `${item.spice[0].toUpperCase()}${item.spice.slice(1)}, the way you like it` })
      }
      // Long weekend dishes don't suit a weekday meal; quick ones suit breakfast.
      if (!isWeekend && item.tags.includes('Weekend')) score -= 8
      if (slot === 'breakfast' && item.tags.includes('Quick')) score += 4
      if (item.satisfactionAvg >= 4.4) {
        reasons.push({
          weight: 8,
          text: `Rated ${item.satisfactionAvg}/5 by ${item.satisfactionCount} diners who switched`,
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
