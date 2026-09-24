/** Scale an ingredient quantity to a different number of servings. */
export function scaleQty(qty: number, fromServings: number, toServings: number): number {
  return (qty * toServings) / fromServings
}

const FRACTIONS: [number, string][] = [
  [0.125, '⅛'],
  [0.25, '¼'],
  [1 / 3, '⅓'],
  [0.5, '½'],
  [2 / 3, '⅔'],
  [0.75, '¾'],
]

/**
 * Kitchen-friendly display: whole numbers stay whole, small amounts become
 * common fractions (1½ tsp, not 1.5), larger amounts round sensibly.
 */
export function formatQty(n: number): string {
  if (n >= 20) return String(Math.round(n / 5) * 5)
  if (n >= 5) return String(Math.round(n))
  const whole = Math.floor(n)
  const rest = n - whole
  if (rest < 0.06) return String(whole || n.toFixed(2).replace(/0+$/, ''))
  if (rest > 0.94) return String(whole + 1)
  const [, glyph] = FRACTIONS.reduce((best, f) => (Math.abs(f[0] - rest) < Math.abs(best[0] - rest) ? f : best))
  return whole ? `${whole}${glyph}` : glyph
}
