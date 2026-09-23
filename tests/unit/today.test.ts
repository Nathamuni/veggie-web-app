import { describe, expect, it } from 'vitest'
import { mealSlotForHour, rankPicks, type PickInput, type PickProfile } from '@/domain/recommendation/today'

const item = (over: Partial<PickInput>): PickInput => ({
  id: 'x',
  name: 'X',
  cuisine: 'Tamil',
  dietMode: 'vegan',
  tags: [],
  timeMinutes: 30,
  protein: 'medium',
  spice: 'medium',
  satisfactionAvg: 4,
  satisfactionCount: 10,
  ...over,
})

const profile: PickProfile = { dietMode: 'vegetarian', cuisines: ['Tamil'], spice: 'fiery', maxCookMinutes: 45 }

describe('rankPicks', () => {
  it('never offers a vegetarian-only item to a vegan user, however well it scores', () => {
    const paneer = item({ id: 'paneer', dietMode: 'vegetarian', satisfactionAvg: 5, protein: 'high' })
    const sambar = item({ id: 'sambar', dietMode: 'vegan', satisfactionAvg: 3 })
    const picks = rankPicks([paneer, sambar], { ...profile, dietMode: 'vegan' }, 'dinner', false)
    expect(picks.map((p) => p.item.id)).toEqual(['sambar'])
  })

  it('counts a sub-regional cuisine as the region the user chose', () => {
    const [pick] = rankPicks([item({ cuisine: 'Chettinad' })], profile, 'dinner', false)
    expect(pick.reasons[0]).toContain('Tamil')
  })

  it('explains every pick with at most three reasons', () => {
    const rich = item({ protein: 'high', spice: 'fiery', satisfactionAvg: 4.8 })
    for (const p of rankPicks([rich], profile, 'lunch', false)) expect(p.reasons.length).toBeLessThanOrEqual(3)
  })

  it('prefers a quick weekday dish over a long weekend one at equal satisfaction', () => {
    const weekend = item({ id: 'biryani', tags: ['Weekend'], timeMinutes: 50 })
    const quick = item({ id: 'khichdi', tags: ['Quick'], timeMinutes: 25 })
    expect(rankPicks([weekend, quick], profile, 'dinner', false)[0].item.id).toBe('khichdi')
  })
})

describe('mealSlotForHour', () => {
  it('maps the clock to the next meal', () => {
    expect([7, 12, 19].map(mealSlotForHour)).toEqual(['breakfast', 'lunch', 'dinner'])
  })
})
