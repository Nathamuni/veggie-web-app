import { sql } from 'drizzle-orm'
import {
  customType,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

/** Case-insensitive text, so e-mail uniqueness does not depend on capitalisation. */
const citext = customType<{ data: string }>({
  dataType: () => 'citext',
})

const now = sql`now()`

/**
 * Password hashing algorithm, recorded per row.
 *
 * scrypt (@noble/hashes) is used because the application must be able to run on
 * Cloudflare Workers, where native modules such as argon2 cannot load. Storing
 * the algorithm alongside the hash means committing to a Node-only host later
 * is a rehash-on-next-signin migration rather than a forced password reset.
 */
export const passwordAlgorithm = pgEnum('password_algorithm', ['scrypt', 'argon2id'])

export const accountStatus = pgEnum('account_status', ['active', 'suspended', 'deleted'])

/**
 * Consent purposes are itemised and never bundled (PRD 11.1, DPDP).
 * Adding a purpose is a migration, which is deliberate: it forces the consent
 * text to be versioned alongside it.
 */
export const consentPurpose = pgEnum('consent_purpose', [
  'terms_and_privacy',
  'food_personalisation',
  'location_discovery',
  'marketing_email',
  'research_analytics',
])

export const actorRole = pgEnum('actor_role', ['user', 'admin', 'partner', 'system'])

/**
 * Account identity only. The food profile lives in `user_profiles` (Phase 3)
 * so that authentication data and dietary data stay separable (PRD 8).
 */
export const users = pgTable(
  'users',
  {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    email: citext().notNull(),
    emailVerifiedAt: timestamp({ withTimezone: true }),

    passwordHash: text().notNull(),
    passwordAlgorithm: passwordAlgorithm().notNull().default('scrypt'),

    displayName: text(),

    /** Age eligibility is confirmed at sign-up and recorded, not inferred. */
    ageConfirmedAt: timestamp({ withTimezone: true }),

    status: accountStatus().notNull().default('active'),

    lastSignInAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true }).notNull().default(now),
    updatedAt: timestamp({ withTimezone: true }).notNull().default(now),
  },
  (table) => [uniqueIndex('users_email_key').on(table.email)],
)

/**
 * A consent record is append-only: granting writes a row, withdrawing stamps
 * `withdrawnAt` on it. The history is the evidence, so rows are never deleted
 * or rewritten (PRD 11.1 — withdrawal must be operationally possible and
 * reflected downstream).
 */
export const consents = pgTable(
  'consents',
  {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    purpose: consentPurpose().notNull(),

    /** Version of the notice text the user actually saw. */
    policyVersion: text().notNull(),

    grantedAt: timestamp({ withTimezone: true }).notNull().default(now),
    withdrawnAt: timestamp({ withTimezone: true }),
  },
  (table) => [
    index('consents_user_purpose_idx').on(table.userId, table.purpose),
    /**
     * At most one live consent per purpose per user. Withdrawn rows are
     * excluded, so the history accumulates while the current state stays
     * unambiguous.
     */
    uniqueIndex('consents_user_purpose_active_key')
      .on(table.userId, table.purpose)
      .where(sql`${table.withdrawnAt} is null`),
  ],
)

/** Privileged actions by admins, partners and the system (PRD 10.4, 12). */
export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),

    actorUserId: uuid().references(() => users.id, { onDelete: 'set null' }),
    actorRole: actorRole().notNull(),

    action: text().notNull(),
    entityType: text().notNull(),
    entityId: text(),

    /** Redacted diff. Never credentials, never a full personal record. */
    detail: jsonb().$type<Record<string, unknown>>(),

    createdAt: timestamp({ withTimezone: true }).notNull().default(now),
  },
  (table) => [
    index('audit_logs_entity_idx').on(table.entityType, table.entityId),
    index('audit_logs_actor_idx').on(table.actorUserId),
    index('audit_logs_created_at_idx').on(table.createdAt),
  ],
)

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Consent = typeof consents.$inferSelect
export type AuditLog = typeof auditLogs.$inferSelect
