import { z } from 'zod'
import { geocodeArea, nearbyEateries, PlacesUnavailableError, type Center } from '@/domain/places/osm'
import { findCity } from '@/lib/locations'

// Either a manual city + area (the primary path) or coordinates from an
// opt-in browser location. Coordinates are used for this request only.
const query = z.union([
  z.object({
    lat: z.coerce.number().min(6).max(37),
    lng: z.coerce.number().min(68).max(98),
    radius: z.coerce.number().int().min(500).max(5000).default(1500),
  }),
  z.object({
    city: z.string().min(1).max(60),
    area: z.string().min(1).max(80),
    radius: z.coerce.number().int().min(500).max(5000).default(1500),
  }),
])

export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams)
  const parsed = query.safeParse(params)
  if (!parsed.success) {
    return Response.json({ error: 'invalid_query', message: 'Choose a city and area.' }, { status: 400 })
  }
  const q = parsed.data

  try {
    let center: Center | null
    if ('lat' in q) {
      center = { lat: q.lat, lng: q.lng, label: 'Your current location' }
    } else {
      if (!findCity(q.city)) {
        return Response.json({ error: 'unknown_city', message: 'We don’t cover that city yet.' }, { status: 400 })
      }
      center = await geocodeArea(q.area, q.city)
      if (!center) {
        return Response.json(
          { error: 'area_not_found', message: `We couldn’t find “${q.area}” on the map. Try a nearby area.` },
          { status: 404 },
        )
      }
    }

    const places = await nearbyEateries(center, q.radius)
    return Response.json({
      center,
      radiusM: q.radius,
      places,
      source: 'OpenStreetMap contributors (ODbL)',
      retrievedAt: new Date().toISOString(),
    })
  } catch (error) {
    if (error instanceof PlacesUnavailableError) {
      console.error('[places] upstream unavailable:', error.message)
      return Response.json(
        { error: 'map_unavailable', message: 'Map data is busy right now. Try again in a moment.' },
        { status: 503 },
      )
    }
    throw error
  }
}
