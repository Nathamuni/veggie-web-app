import 'server-only'
import { z } from 'zod'

/**
 * Server environment, validated once at first access.
 *
 * Every external source is behind a feature flag that defaults to OFF: the app
 * must have a working path without any of them (build plan, Feature Ledger).
 * A flag that is on without its credential is a configuration error, not a
 * silent no-op, so those pairs are checked here rather than at call time.
 */
const booleanFromEnv = z
  .enum(['true', 'false'])
  .default('false')
  .transform((value) => value === 'true')

const schema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

    DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),

    AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 characters'),
    AUTH_URL: z.url().optional(),

    S3_ENDPOINT: z.url().optional(),
    S3_REGION: z.string().default('us-east-1'),
    S3_ACCESS_KEY_ID: z.string().optional(),
    S3_SECRET_ACCESS_KEY: z.string().optional(),
    S3_BUCKET: z.string().optional(),

    FEATURE_GOOGLE_PLACES: booleanFromEnv,
    GOOGLE_PLACES_API_KEY: z.string().optional(),

    USDA_FDC_API_KEY: z.string().optional(),

    FEATURE_BARCODE_SCAN: booleanFromEnv,
    OFF_USER_AGENT: z.string().optional(),

    FEATURE_AI_ASSISTANT: booleanFromEnv,
    ANTHROPIC_API_KEY: z.string().optional(),

    FEATURE_IMPACT_ESTIMATES: booleanFromEnv,
  })
  .superRefine((env, ctx) => {
    const requireCredential = (
      flag: boolean,
      value: string | undefined,
      credential: string,
      feature: string,
    ) => {
      if (flag && !value) {
        ctx.addIssue({
          code: 'custom',
          path: [credential],
          message: `${credential} is required when ${feature} is enabled`,
        })
      }
    }

    requireCredential(
      env.FEATURE_GOOGLE_PLACES,
      env.GOOGLE_PLACES_API_KEY,
      'GOOGLE_PLACES_API_KEY',
      'FEATURE_GOOGLE_PLACES',
    )
    requireCredential(
      env.FEATURE_AI_ASSISTANT,
      env.ANTHROPIC_API_KEY,
      'ANTHROPIC_API_KEY',
      'FEATURE_AI_ASSISTANT',
    )
    // Open Food Facts asks callers to identify themselves (PRD 9.5).
    requireCredential(
      env.FEATURE_BARCODE_SCAN,
      env.OFF_USER_AGENT,
      'OFF_USER_AGENT',
      'FEATURE_BARCODE_SCAN',
    )
  })

export type Env = z.infer<typeof schema>

let cached: Env | undefined

export function getEnv(): Env {
  if (cached) return cached

  const parsed = schema.safeParse(process.env)
  if (!parsed.success) {
    // Names only — never the values, which are credentials.
    const problems = parsed.error.issues
      .map((issue) => `  ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n')
    throw new Error(`Invalid environment configuration:\n${problems}`)
  }

  cached = parsed.data
  return cached
}

/** Test-only: drop the memoised value so a test can vary the environment. */
export function resetEnvCache(): void {
  cached = undefined
}
