import { describe, expect, it } from 'vitest'
import {
  addDays,
  istDate,
  suggestedNextTarget,
  weekStartOf,
  weeklyProgress,
  weeklyTrend,
  type LogLite,
} from '@/domain/journey/week'

describe('calendar helpers', () => {
  it('uses the Indian date, not UTC', () => {
    // 20:00 UTC on the 23rd is 01:30 IST on the 24th.
    expect(istDate(new Date('2026-09-23T20:00:00Z'))).toBe('2026-09-24')
  })

  it('starts weeks on Monday', () => {
    expect(weekStartOf('2026-09-24')).toBe('2026-09-21') // Thursday
    expect(weekStartOf('2026-09-21')).toBe('2026-09-21') // Monday
    expect(weekStartOf('2026-09-27')).toBe('2026-09-21') // Sunday
  })

  it('adds days across month ends', () => {
    expect(addDays('2026-09-29', 3)).toBe('2026-10-02')
  })
})

describe('weeklyProgress', () => {
  const logs: LogLite[] = [
    { eatenOn: '2026-09-21', diet: 'vegan' },
    { eatenOn: '2026-09-22', diet: 'vegetarian' },
    { eatenOn: '2026-09-22', diet: 'meat' },
    { eatenOn: '2026-09-20', diet: 'vegan' }, // previous week
    { eatenOn: '2026-09-28', diet: 'vegan' }, // next week
  ]

  it('counts only this week, plant and meat separately', () => {
    const w = weeklyProgress(logs, 5, '2026-09-21')
    expect(w).toMatchObject({ plantMeals: 2, meatMeals: 1, totalMeals: 3, remaining: 3, hit: false })
  })

  it('a meat meal never reduces plant progress', () => {
    const before = weeklyProgress(logs.slice(0, 2), 2, '2026-09-21')
    const after = weeklyProgress(logs.slice(0, 3), 2, '2026-09-21')
    expect(after.plantMeals).toBe(before.plantMeals)
    expect(after.hit).toBe(true)
  })

  it('handles an empty week', () => {
    expect(weeklyProgress([], 5, '2026-09-21')).toMatchObject({ plantMeals: 0, remaining: 5, hit: false })
  })

  it('builds a trend ending with the current week', () => {
    const trend = weeklyTrend(logs, '2026-09-24', 5, 3)
    expect(trend.map((w) => w.weekStart)).toEqual(['2026-09-07', '2026-09-14', '2026-09-21'])
    expect(trend[1].plantMeals).toBe(1)
  })

  it('suggests one more only after a week that was hit', () => {
    expect(suggestedNextTarget(weeklyProgress(logs, 2, '2026-09-21'))).toBe(3)
    expect(suggestedNextTarget(weeklyProgress(logs, 5, '2026-09-21'))).toBe(5)
    expect(suggestedNextTarget({ ...weeklyProgress(logs, 21, '2026-09-21'), hit: true })).toBe(21)
  })
})
