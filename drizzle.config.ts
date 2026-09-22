import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: '.env.local', quiet: true })

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // PostGIS and citext create objects in these schemas; drizzle-kit must not
  // try to manage or drop them.
  schemaFilter: ['public'],
  extensionsFilters: ['postgis'],
  strict: true,
  verbose: true,
})
