import { describe, expect, it } from 'vitest'
import { formatQty, scaleQty } from '@/domain/food/scale'

describe('scaleQty', () => {
  it('scales linearly with servings', () => {
    expect(scaleQty(200, 2, 4)).toBe(400)
    expect(scaleQty(1, 4, 2)).toBe(0.5)
  })
})

describe('formatQty', () => {
  it('shows kitchen fractions', () => {
    expect(formatQty(0.5)).toBe('½')
    expect(formatQty(1.5)).toBe('1½')
    expect(formatQty(0.25)).toBe('¼')
    expect(formatQty(0.333)).toBe('⅓')
  })

  it('keeps whole numbers whole and rounds large amounts', () => {
    expect(formatQty(2)).toBe('2')
    expect(formatQty(1.98)).toBe('2')
    expect(formatQty(7.4)).toBe('7')
    expect(formatQty(233)).toBe('235')
  })
})
