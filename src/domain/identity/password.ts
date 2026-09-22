import { scryptAsync } from '@noble/hashes/scrypt.js'
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js'

/**
 * Password hashing.
 *
 * scrypt from @noble/hashes is pure JavaScript, so it runs unchanged on Node,
 * on Render and on Cloudflare Workers. argon2id would be the stronger default
 * but is a native module and cannot load on Workers; the algorithm is recorded
 * per user row so switching later is a rehash-on-next-signin, not a reset.
 *
 * Encoded form: `scrypt$N$r$p$<salt hex>$<hash hex>`
 * Parameters travel with the hash so raising the cost later does not
 * invalidate existing passwords.
 */

export const SCRYPT_PARAMS = {
  /** CPU/memory cost. 2^17 ≈ 128 MiB with r=8 — OWASP's floor for scrypt. */
  N: 2 ** 17,
  r: 8,
  p: 1,
  dkLen: 32,
} as const

const SALT_BYTES = 16
const PREFIX = 'scrypt'

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return bytes
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES)
  const derived = await scryptAsync(password.normalize('NFKC'), salt, SCRYPT_PARAMS)
  const { N, r, p } = SCRYPT_PARAMS
  return [PREFIX, N, r, p, bytesToHex(salt), bytesToHex(derived)].join('$')
}

/**
 * Constant-time comparison. `crypto.subtle.timingSafeEqual` is not available on
 * every target runtime, so this is done by hand over the full length.
 */
function equalsConstantTime(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}

export async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const parts = encoded.split('$')
  if (parts.length !== 6) return false

  const [prefix, rawN, rawR, rawP, saltHex, hashHex] = parts
  if (prefix !== PREFIX) return false

  const N = Number(rawN)
  const r = Number(rawR)
  const p = Number(rawP)
  if (!Number.isInteger(N) || !Number.isInteger(r) || !Number.isInteger(p)) return false

  let salt: Uint8Array
  let expected: Uint8Array
  try {
    salt = hexToBytes(saltHex)
    expected = hexToBytes(hashHex)
  } catch {
    return false
  }

  const derived = await scryptAsync(password.normalize('NFKC'), salt, {
    N,
    r,
    p,
    dkLen: expected.length,
  })

  return equalsConstantTime(derived, expected)
}

/**
 * True when a stored hash was produced with weaker parameters than the current
 * policy, so the caller can transparently rehash during a successful sign-in.
 */
export function needsRehash(encoded: string): boolean {
  const parts = encoded.split('$')
  if (parts.length !== 6 || parts[0] !== PREFIX) return true
  const [, N, r, p] = parts
  return (
    Number(N) < SCRYPT_PARAMS.N || Number(r) < SCRYPT_PARAMS.r || Number(p) < SCRYPT_PARAMS.p
  )
}
