import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { and, eq, gt } from 'drizzle-orm'
import { sha256 } from '@noble/hashes/sha2.js'
import { bytesToHex } from '@noble/hashes/utils.js'
import { getDb } from '@/db/client'
import { profiles, sessions, users, type Profile } from '@/db/schema'

/**
 * Database sessions. The cookie carries a random 256-bit token; the database
 * keeps only its SHA-256. `proxy.ts` checks the cookie exists (optimistic);
 * every page and action verifies it here against the database (secure).
 */

export const SESSION_COOKIE = 'veggie_session'
const SESSION_DAYS = 30

function hashToken(token: string) {
  return bytesToHex(sha256(new TextEncoder().encode(token)))
}

function newToken() {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Buffer.from(bytes).toString('base64url')
}

export async function createSession(userId: string) {
  const token = newToken()
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000)
  await getDb().insert(sessions).values({ userId, tokenHash: hashToken(token), expiresAt })
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  })
}

export async function deleteSession() {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (token) await getDb().delete(sessions).where(eq(sessions.tokenHash, hashToken(token)))
  store.delete(SESSION_COOKIE)
}

export type CurrentUser = { id: string; email: string; displayName: string | null; profile: Profile }

/** The signed-in user and their food profile, or null. Memoised per request. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null
  const [row] = await getDb()
    .select({ id: users.id, email: users.email, displayName: users.displayName, status: users.status, profile: profiles })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .innerJoin(profiles, eq(profiles.userId, users.id))
    .where(and(eq(sessions.tokenHash, hashToken(token)), gt(sessions.expiresAt, new Date())))
    .limit(1)
  if (!row || row.status !== 'active') return null
  return { id: row.id, email: row.email, displayName: row.displayName, profile: row.profile }
})

/** For pages and actions that need a signed-in user. */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/sign-in')
  return user
}

/** For the main app: signed in *and* onboarded. */
export async function requireOnboardedUser(): Promise<CurrentUser> {
  const user = await requireUser()
  if (!user.profile.onboardedAt) redirect('/onboarding')
  return user
}
