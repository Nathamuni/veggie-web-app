import { describe, expect, it } from 'vitest'
import {
  SCRYPT_PARAMS,
  hashPassword,
  needsRehash,
  verifyPassword,
} from '@/domain/identity/password'

describe('password hashing', () => {
  it('accepts the correct password', async () => {
    const encoded = await hashPassword('correct horse battery staple')
    await expect(verifyPassword('correct horse battery staple', encoded)).resolves.toBe(true)
  })

  it('rejects a wrong password', async () => {
    const encoded = await hashPassword('correct horse battery staple')
    await expect(verifyPassword('Correct horse battery staple', encoded)).resolves.toBe(false)
  })

  it('salts each hash, so identical passwords do not collide', async () => {
    const [a, b] = await Promise.all([hashPassword('same-password'), hashPassword('same-password')])
    expect(a).not.toEqual(b)
  })

  it('encodes its parameters so cost can be raised without invalidating hashes', async () => {
    const encoded = await hashPassword('whatever')
    const [prefix, n, r, p] = encoded.split('$')
    expect(prefix).toBe('scrypt')
    expect(Number(n)).toBe(SCRYPT_PARAMS.N)
    expect(Number(r)).toBe(SCRYPT_PARAMS.r)
    expect(Number(p)).toBe(SCRYPT_PARAMS.p)
  })

  it('verifies a hash made with weaker parameters, and flags it for rehash', async () => {
    // Simulates a row written before the cost was raised.
    const weak = 'scrypt$16384$8$1$00112233445566778899aabbccddeeff$'
    const { scryptAsync } = await import('@noble/hashes/scrypt.js')
    const { bytesToHex, hexToBytes } = await import('@noble/hashes/utils.js')
    const derived = await scryptAsync(
      'legacy-password',
      hexToBytes('00112233445566778899aabbccddeeff'),
      { N: 16384, r: 8, p: 1, dkLen: 32 },
    )
    const encoded = weak + bytesToHex(derived)

    await expect(verifyPassword('legacy-password', encoded)).resolves.toBe(true)
    expect(needsRehash(encoded)).toBe(true)
  })

  it('does not flag a current-policy hash for rehash', async () => {
    expect(needsRehash(await hashPassword('whatever'))).toBe(false)
  })

  it.each([
    ['empty', ''],
    ['not our format', 'argon2id$v=19$m=65536,t=3,p=4$abc$def'],
    ['too few fields', 'scrypt$131072$8$deadbeef'],
    ['non-numeric cost', 'scrypt$N$8$1$deadbeef$deadbeef'],
    ['non-hex salt', 'scrypt$131072$8$1$zzzz$deadbeef'],
  ])('rejects a malformed hash (%s) instead of throwing', async (_label, encoded) => {
    await expect(verifyPassword('anything', encoded)).resolves.toBe(false)
  })
})
