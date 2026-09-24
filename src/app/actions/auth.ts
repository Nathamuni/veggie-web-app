'use server'

import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getDb } from '@/db/client'
import { auditLogs, consents, profiles, users } from '@/db/schema'
import { hashPassword, needsRehash, verifyPassword } from '@/domain/identity/password'
import { createSession, deleteSession, requireUser } from '@/lib/auth/session'

export type AuthState = { error?: string; fieldErrors?: Record<string, string[] | undefined>; email?: string } | undefined

const POLICY_VERSION = '2026-09'

/** Only same-site paths, so `?next=` can't bounce a user to another origin. */
function safeNext(value: FormDataEntryValue | null, fallback: string) {
  const next = typeof value === 'string' ? value : ''
  return next.startsWith('/') && !next.startsWith('//') ? next : fallback
}

const SignUp = z.object({
  email: z.email({ error: 'Enter a valid email.' }).trim().max(254),
  password: z.string().min(8, { error: 'Use at least 8 characters.' }).max(200),
  displayName: z.string().trim().max(60).optional(),
  terms: z.literal('on', { error: 'Please accept the Terms and Privacy Policy.' }),
  personalise: z.literal('on', { error: 'Needed so Veggie can suggest meals for you.' }),
  adult: z.literal('on', { error: 'Veggie is for people 18 and older.' }),
  marketing: z.literal('on').optional(),
})

export async function signUp(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = SignUp.safeParse(Object.fromEntries(formData))
  const email = String(formData.get('email') ?? '')
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors, email }

  const { password, displayName, marketing } = parsed.data
  const db = getDb()
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, parsed.data.email)).limit(1)
  if (existing) return { error: 'An account with this email already exists. Sign in instead?', email }

  const passwordHash = await hashPassword(password)
  const userId = await db.transaction(async (tx) => {
    const [user] = await tx
      .insert(users)
      .values({
        email: parsed.data.email,
        passwordHash,
        displayName: displayName || null,
        ageConfirmedAt: new Date(),
        lastSignInAt: new Date(),
      })
      .returning({ id: users.id })
    await tx.insert(profiles).values({ userId: user.id })
    const purposes = ['terms_and_privacy', 'food_personalisation', ...(marketing ? ['marketing_email' as const] : [])] as const
    await tx.insert(consents).values(purposes.map((purpose) => ({ userId: user.id, purpose, policyVersion: POLICY_VERSION })))
    return user.id
  })

  await createSession(userId)
  redirect('/onboarding')
}

let dummy: Promise<string> | undefined
const dummyHash = () => (dummy ??= hashPassword('not-a-real-password'))

const SignIn = z.object({ email: z.email().trim(), password: z.string().min(1).max(200) })

export async function signIn(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') ?? '')
  const parsed = SignIn.safeParse(Object.fromEntries(formData))
  // One message for every failure, so the form doesn't reveal which emails exist.
  const failed = { error: 'That email and password don’t match.', email }
  if (!parsed.success) return failed

  const db = getDb()
  const [user] = await db.select().from(users).where(eq(users.email, parsed.data.email)).limit(1)
  if (!user) {
    // Spend the same scrypt time as a real check so response timing doesn't reveal the account.
    await verifyPassword(parsed.data.password, await dummyHash())
    return failed
  }
  if (user.status !== 'active' || !(await verifyPassword(parsed.data.password, user.passwordHash))) return failed

  await db
    .update(users)
    .set({
      lastSignInAt: new Date(),
      ...(needsRehash(user.passwordHash) ? { passwordHash: await hashPassword(parsed.data.password) } : {}),
    })
    .where(eq(users.id, user.id))
  await createSession(user.id)
  redirect(safeNext(formData.get('next'), '/app'))
}

export async function signOut() {
  await deleteSession()
  redirect('/auth/sign-in')
}

/** Removes the account and, by cascade, the profile, logs, saves and sessions. */
export async function deleteAccount(formData: FormData) {
  const user = await requireUser()
  if (formData.get('confirm') !== 'DELETE') redirect('/app/settings?delete=confirm')
  const db = getDb()
  await db.insert(auditLogs).values({ actorUserId: null, actorRole: 'user', action: 'account.deleted', entityType: 'user', entityId: user.id })
  await db.delete(users).where(eq(users.id, user.id))
  await deleteSession()
  redirect('/?deleted=1')
}
