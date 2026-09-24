import { mealSlotForHour, type MealSlot } from '@/domain/recommendation/today'

/** Wall-clock parts in India, where every pilot user is. */
export function istNow(at: Date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    hourCycle: 'h23',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).formatToParts(at)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  const hour = Number(get('hour'))
  const weekday = get('weekday')
  return {
    hour,
    weekday,
    isWeekend: weekday === 'Sat' || weekday === 'Sun',
    slot: mealSlotForHour(hour) as MealSlot,
    dateLabel: `${weekday} ${get('day')} ${get('month')}`,
  }
}

export const SLOT_LABEL: Record<MealSlot | 'snack', string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
}
