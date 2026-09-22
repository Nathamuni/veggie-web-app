import 'server-only'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { getEnv } from '@/lib/env'
import * as schema from './schema'

/**
 * The single database module.
 *
 * Every query in the application goes through here. That is a portability
 * requirement, not a style preference: on Cloudflare Workers there is no
 * long-lived TCP pool, so the connection is created through Hyperdrive with a
 * different factory while the Drizzle query code stays identical. Keeping the
 * connection in exactly one place means that switch is a change to this file
 * and nothing else.
 */

type Db = ReturnType<typeof createDb>

function createDb(connection: postgres.Sql) {
  return drizzle(connection, { schema, casing: 'snake_case' })
}

declare global {
  // Next.js dev server hot-reloads modules; without this the process leaks a
  // new connection pool on every reload until Postgres refuses connections.
  var __veggieSql: postgres.Sql | undefined
}

function getSql(): postgres.Sql {
  if (globalThis.__veggieSql) return globalThis.__veggieSql

  const env = getEnv()
  const sql = postgres(env.DATABASE_URL, {
    // Workers and serverless hosts do not keep sockets between invocations;
    // a small pool is right for both, and Postgres is not the bottleneck here.
    max: env.NODE_ENV === 'production' ? 10 : 5,
    idle_timeout: 20,
    connect_timeout: 10,
    // Drizzle handles type parsing; keep dates as strings so the same value
    // crosses the wire identically on every runtime.
    types: {},
    onnotice: () => {},
  })

  if (env.NODE_ENV !== 'production') globalThis.__veggieSql = sql
  return sql
}

let cachedDb: Db | undefined

export function getDb(): Db {
  if (!cachedDb) cachedDb = createDb(getSql())
  return cachedDb
}

/** Raw driver handle. For migrations, scripts and `SET LOCAL` only. */
export function getSqlClient(): postgres.Sql {
  return getSql()
}

export type { Db }
