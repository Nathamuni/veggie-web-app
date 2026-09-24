'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { getDb } from '@/db/client'
import { profiles, users } from '@/db/schema'
import { findCity } from '@/lib/locations'
import { requireUser } from '@/lib/auth/session'
import { ONBOARDING_STEPS } from '@/lib/profile-options'

export type ProfileState = { error?: string; saved?: boolean } | undefined

const OTHER_AREA = '__other__'

const Goal = z.enum(['reduce_meat', 'stop_red_meat', 'become_vegetarian', 'become_vegan', 'more_veg_meals'])
const Diet = z.enum(['vegetarian', 'vegan'])

const stepSchemas = {
  1: z.object({ goal: Goal, dietMode: Diet }),
  2: z.object({
    baselineMeatMeals: z.coerce.number().int().min(0).max(21),
    weeklyPlantTarget: z.coerce.number().int().min(1).max(21),
  }),
  3: z.object({
    cuisines: z.array(z.string().max(40)).min(1, 'Pick at least one cuisine you enjoy.').max(12),
    spice: z.enum(['mild', 'medium', 'fiery']),
    maxCookMinutes: z.coerce.number().int().min(10).max(120),
  }),
  4: z.object({ city: z.string().max(60), area: z.string().max(80), areaOther: z.string().trim().max(80).optional() }),
} as const

type Step = keyof typeof stepSchemas

function readStep(step: Step, formData: FormData) {
  const raw = { ...Object.fromEntries(formData), cuisines: formData.getAll('cuisines') }
  const parsed = stepSchemas[step].safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Please check your answers.' } as const
  const data = parsed.data as Record<string, unknown>
  if (step === 4) {
    const { city, area, areaOther } = data as z.infer<(typeof stepSchemas)[4]>
    if (!findCity(city)) return { error: 'Choose a city from the list.' } as const
    const finalArea = area === OTHER_AREA ? areaOther : area
    if (!finalArea) return { error: 'Tell us your area.' } as const
    return { values: { city, area: finalArea } } as const
  }
  return { values: data } as const
}

/** Saves one onboarding step and moves to the next; a refresh resumes from here. */
export async function saveOnboardingStep(step: Step, _: ProfileState, formData: FormData): Promise<ProfileState> {
  const user = await requireUser()
  const result = readStep(step, formData)
  if ('error' in result) return { error: result.error }
  await getDb()
    .update(profiles)
    .set({ ...result.values, onboardingStep: sql`greatest(${profiles.onboardingStep}, ${step})`, updatedAt: new Date() })
    .where(eq(profiles.userId, user.id))
  redirect(`/onboarding?step=${step + 1}`)
}

export async function completeOnboarding(formData: FormData) {
  const user = await requireUser()
  if (user.profile.onboardingStep < ONBOARDING_STEPS) redirect('/onboarding')
  await getDb()
    .update(profiles)
    .set({ onboardedAt: user.profile.onboardedAt ?? new Date(), updatedAt: new Date() })
    .where(eq(profiles.userId, user.id))
  const next = String(formData.get('next') ?? '/app')
  redirect(next.startsWith('/app') ? next : '/app')
}

/** Settings: any one section at a time, same validation as onboarding. */
export async function updateProfileSection(step: Step, _: ProfileState, formData: FormData): Promise<ProfileState> {
  const user = await requireUser()
  const result = readStep(step, formData)
  if ('error' in result) return { error: result.error }
  await getDb()
    .update(profiles)
    .set({ ...result.values, updatedAt: new Date() })
    .where(eq(profiles.userId, user.id))
  revalidatePath('/app', 'layout')
  return { saved: true }
}

export async function updateDisplayName(_: ProfileState, formData: FormData): Promise<ProfileState> {
  const user = await requireUser()
  const name = z.string().trim().max(60).safeParse(formData.get('displayName') ?? '')
  if (!name.success) return { error: 'Keep it under 60 characters.' }
  await getDb()
    .update(users)
    .set({ displayName: name.data || null, updatedAt: new Date() })
    .where(eq(users.id, user.id))
  revalidatePath('/app', 'layout')
  return { saved: true }
}
