/**
 * Weekly progress, computed from the user's own meal logs.
 *
 * Weeks run Monday–Sunday on the Indian calendar (Asia/Kolkata), because a
 * "this week" that flips at 5:30 am IST would be wrong for every pilot user.
 * Reduction-first: a meat meal is counted, never punished, and nothing resets.
 */

export type MealDiet = 'vegan' | 'vegetarian' | 'meat'
export type LogLite = { eatenOn: string; diet: MealDiet }

const DAY_MS = 86_400_000

/** Calendar date in India for an instant, as YYYY-MM-DD. */
export function istDate(at: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(at)
}

export function addDays(date: string, days: number): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10)
}

/** Monday of the week containing `date`. */
export function weekStartOf(date: string): string {
  const dow = new Date(`${date}T00:00:00Z`).getUTCDay() // 0 = Sunday
  return addDays(date, -((dow + 6) % 7))
}

export const isPlant = (diet: MealDiet) => diet !== 'meat'

export type WeekProgress = {
  weekStart: string
  plantMeals: number
  meatMeals: number
  totalMeals: number
  target: number
  remaining: number
  hit: boolean
}

export function weeklyProgress(logs: LogLite[], target: number, weekStart: string): WeekProgress {
  const end = addDays(weekStart, 7)
  const inWeek = logs.filter((l) => l.eatenOn >= weekStart && l.eatenOn < end)
  const plantMeals = inWeek.filter((l) => isPlant(l.diet)).length
  return {
    weekStart,
    plantMeals,
    meatMeals: inWeek.length - plantMeals,
    totalMeals: inWeek.length,
    target,
    remaining: Math.max(0, target - plantMeals),
    hit: plantMeals >= target,
  }
}

/** Oldest first, ending with the week containing `today`. */
export function weeklyTrend(logs: LogLite[], today: string, target: number, weeks = 8): WeekProgress[] {
  const current = weekStartOf(today)
  return Array.from({ length: weeks }, (_, i) =>
    weeklyProgress(logs, target, addDays(current, -7 * (weeks - 1 - i))),
  )
}

/** A gentle next goal: one more if this week's was hit, never above 21. */
export function suggestedNextTarget(progress: WeekProgress): number {
  return progress.hit ? Math.min(21, progress.target + 1) : progress.target
}
