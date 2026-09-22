import { defineCloudflareConfig } from '@opennextjs/cloudflare'

/**
 * Cloudflare build configuration.
 *
 * This exists to keep the Render-or-Cloudflare decision open: CI runs
 * `npm run build:cloudflare` (build only, never deploy) so that a native
 * module, an `fs` call or an edge-incompatible Node global is caught the day it
 * lands rather than at deploy time.
 */
export default defineCloudflareConfig()
