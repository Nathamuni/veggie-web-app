import 'server-only'
import { z } from 'zod'

/**
 * Real eateries from OpenStreetMap (ODbL). Server-side only, cached, and
 * attributed wherever shown (§9.1, §11.3).
 *
 * Diet status comes only from what OSM contributors tagged. Absent tags mean
 * "unverified", never an inferred "veg friendly" (§4.2, PRODUCT.md rule 5).
 */

const USER_AGENT = 'VeggieWebApp/0.1 (prototype discovery)'
const CACHE_SECONDS = 3600

// The main instance often answers 504 once and then succeeds, so it gets a
// quick retry before we fall back to public mirrors.
const MAIN = 'https://overpass-api.de/api/interpreter'
const OVERPASS_ATTEMPTS = [
  { endpoint: MAIN, timeoutMs: 15_000, delayMs: 0 },
  { endpoint: MAIN, timeoutMs: 15_000, delayMs: 1_000 },
  { endpoint: 'https://overpass.kumi.systems/api/interpreter', timeoutMs: 8_000, delayMs: 0 },
  { endpoint: 'https://overpass.private.coffee/api/interpreter', timeoutMs: 8_000, delayMs: 0 },
]

export type DietDeclaration = 'only' | 'yes' | 'no' | 'unknown'

export type Place = {
  id: string // `${osmType}-${osmId}`, e.g. node-2001077834
  osmType: 'node' | 'way' | 'relation'
  osmId: number
  name: string
  kind: string
  lat: number
  lng: number
  distanceKm: number | null
  cuisines: string[]
  vegetarian: DietDeclaration
  vegan: DietDeclaration
  openingHours: string | null
  address: string | null
  phone: string | null
  website: string | null
}

export type Center = { lat: number; lng: number; label: string }

export class PlacesUnavailableError extends Error {}

const nominatimSchema = z.array(
  z.object({ lat: z.string(), lon: z.string(), display_name: z.string() }),
)

const overpassSchema = z.object({
  elements: z.array(
    z.object({
      type: z.enum(['node', 'way', 'relation']),
      id: z.number(),
      lat: z.number().optional(),
      lon: z.number().optional(),
      center: z.object({ lat: z.number(), lon: z.number() }).optional(),
      tags: z.record(z.string(), z.string()).optional(),
    }),
  ),
})

/** City + area → coordinates, via Nominatim (1 req/s policy; results cached). */
export async function geocodeArea(area: string, city: string): Promise<Center | null> {
  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.search = new URLSearchParams({
    q: `${area}, ${city}, India`,
    format: 'jsonv2',
    limit: '1',
    countrycodes: 'in',
  }).toString()

  let res: Response
  try {
    res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'en' },
      next: { revalidate: 60 * 60 * 24 * 7 },
      signal: AbortSignal.timeout(10_000),
    })
  } catch (error) {
    throw new PlacesUnavailableError(`geocoder unreachable: ${String(error)}`)
  }
  if (!res.ok) throw new PlacesUnavailableError(`geocoder returned ${res.status}`)
  const hit = nominatimSchema.parse(await res.json())[0]
  if (!hit) return null
  return { lat: Number(hit.lat), lng: Number(hit.lon), label: `${area}, ${city}` }
}

async function overpass(query: string) {
  let lastError: unknown
  for (const { endpoint, timeoutMs, delayMs } of OVERPASS_ATTEMPTS) {
    if (delayMs) await new Promise((resolve) => setTimeout(resolve, delayMs))
    try {
      const url = `${endpoint}?${new URLSearchParams({ data: query })}`
      const res = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT },
        next: { revalidate: CACHE_SECONDS },
        signal: AbortSignal.timeout(timeoutMs),
      })
      // An overloaded instance answers 200 with an HTML error page.
      if (!res.ok || !res.headers.get('content-type')?.includes('json')) {
        lastError = new Error(`${endpoint} returned ${res.status}`)
        continue
      }
      return overpassSchema.parse(await res.json())
    } catch (error) {
      lastError = error
    }
  }
  throw new PlacesUnavailableError(`all map data servers failed: ${String(lastError)}`)
}

function declaration(value: string | undefined): DietDeclaration {
  if (value === 'only' || value === 'yes' || value === 'no') return value
  return 'unknown'
}

function strongest(...values: DietDeclaration[]): DietDeclaration {
  for (const v of ['only', 'yes', 'no'] as const) if (values.includes(v)) return v
  return 'unknown'
}

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(h))
}

function toPlace(el: z.infer<typeof overpassSchema>['elements'][number], from?: Center): Place | null {
  const tags = el.tags ?? {}
  const lat = el.lat ?? el.center?.lat
  const lng = el.lon ?? el.center?.lon
  if (!tags.name || lat === undefined || lng === undefined) return null
  const address = [tags['addr:housenumber'], tags['addr:street'], tags['addr:suburb'] ?? tags['addr:city']]
    .filter(Boolean)
    .join(', ')
  return {
    id: `${el.type}-${el.id}`,
    osmType: el.type,
    osmId: el.id,
    name: tags['name:en'] ?? tags.name,
    kind: tags.amenity ?? 'restaurant',
    lat,
    lng,
    distanceKm: from ? Math.round(haversineKm(from, { lat, lng }) * 10) / 10 : null,
    cuisines: (tags.cuisine ?? '')
      .split(';')
      .map((c) => c.trim().toLowerCase().replaceAll('_', ' '))
      .filter((c, i, all) => c && all.indexOf(c) === i),
    // Vegan food is vegetarian, so vegan options imply vegetarian ones. The
    // reverse never holds: lacto-/ovo-vegetarian tags say nothing about vegan.
    vegetarian: strongest(
      declaration(tags['diet:vegetarian']),
      declaration(tags['diet:lacto_vegetarian']),
      declaration(tags['diet:ovo_lacto_vegetarian']),
      ['only', 'yes'].includes(declaration(tags['diet:vegan'])) ? declaration(tags['diet:vegan']) : 'unknown',
    ),
    vegan: declaration(tags['diet:vegan']),
    openingHours: tags.opening_hours ?? null,
    address: address || null,
    phone: tags.phone ?? tags['contact:phone'] ?? null,
    website: tags.website ?? tags['contact:website'] ?? null,
  }
}

/** Named eateries within `radiusM` of a point, nearest first. */
export async function nearbyEateries(center: Center, radiusM: number): Promise<Place[]> {
  const lat = center.lat.toFixed(5)
  const lng = center.lng.toFixed(5)
  const query = `[out:json][timeout:20];nwr["amenity"~"^(restaurant|fast_food|cafe|food_court)$"]["name"](around:${radiusM},${lat},${lng});out center tags 150;`
  const data = await overpass(query)
  return data.elements
    .map((el) => toPlace(el, center))
    .filter((p): p is Place => p !== null)
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
}

export async function placeById(osmType: Place['osmType'], osmId: number): Promise<Place | null> {
  const data = await overpass(`[out:json][timeout:20];${osmType}(${osmId});out center tags;`)
  const el = data.elements[0]
  return el ? toPlace(el) : null
}

export function parsePlaceId(id: string): { osmType: Place['osmType']; osmId: number } | null {
  const match = /^(node|way|relation)-(\d+)$/.exec(id)
  return match ? { osmType: match[1] as Place['osmType'], osmId: Number(match[2]) } : null
}
