# Places & Ratings — API specification

Status: **proposed** · 2026-09-23 · replaces the prototype's OpenStreetMap-only `/api/places/nearby`

Goal: Discover shows **real, live restaurants** with **real external ratings** next to Veggie's own
rating, without breaking the PRD rules or the providers' terms.

---

## 1. The three decisions that shape everything

1. **"Combined" means shown side by side, never blended into one number.** PRD §7.4 forbids
   mathematically mixing external ratings into the Veggie Rating. Google's terms also require
   Google content to be *visually distinguished* from other content. So a place card shows
   `Google ★4.3 (2,140)` and `Veggie Rating 4.6 (18 diners)` as two separate, attributed figures.
2. **Google Places content cannot be stored.** Only the Google `place_id` may be kept indefinitely.
   Ratings, hours, names and addresses from Google must be fetched live on each view. This is why
   Discover is "real time" by necessity, and why cost scales with usage (§6).
3. **Google data shown on a map must be on a Google Map.** The current OpenStreetMap embed may only
   show OpenStreetMap data. With Google switched on, the map becomes the Maps JavaScript API.

**Ratings sources that are *not* available:** Zomato and Swiggy have no official public API; the
only access is scraping, which PRD §1.8 / §9.7 forbids. Foursquare has ratings but they are a
Premium field with no free tier (§7) — not recommended for an India pilot.

---

## 2. Architecture

```
Browser ──► Veggie API (/api/v1/…)  ──► Google Places API (New)   live: listings, rating, hours, veg flag
   │           │  server-side only  ──► OpenStreetMap Overpass    fallback + diet:vegan/vegetarian tags
   │           │                    ──► Veggie Postgres           Veggie Rating, corrections, place_id map
   │           └─ never exposes provider keys or raw provider errors
   └──► Maps JavaScript API (browser key, referrer-restricted)  — map tiles/markers only
```

- Every provider call happens **on the server**. The browser only ever calls `/api/v1/*`, except for
  loading Google map tiles with a separate browser key.
- **Area centres come from our own table.** City and area coordinates (`src/lib/locations.ts`) are
  stored once, so no geocoding call is needed per search. Nominatim is not used in production: its
  usage policy limits heavy use (about 1 request a second).
- **The Veggie place record is the join point.** `restaurant_sources` (already planned in Phase 6)
  links one Veggie place id to a `google_place_id` and/or an `osm_type/osm_id`. Veggie Ratings,
  corrections and partner claims hang off the Veggie id, so switching provider never loses a rating.

---

## 3. Upstream APIs to connect

### 3.1 Google Places API (New) — primary, live

Enable in Google Cloud: **Places API (New)**. The key is server-only (`GOOGLE_PLACES_API_KEY`,
already in `src/lib/env.ts`), restricted to that API and the server's egress IPs.
The flag `FEATURE_GOOGLE_PLACES=true` switches it on.

**Nearby Search (New)** — list view

```http
POST https://places.googleapis.com/v1/places:searchNearby
X-Goog-Api-Key: <server key>
X-Goog-FieldMask: places.id,places.displayName,places.location,places.formattedAddress,
  places.primaryType,places.rating,places.userRatingCount,places.currentOpeningHours.openNow,
  places.priceLevel,places.servesVegetarianFood,places.googleMapsUri
Content-Type: application/json

{
  "includedTypes": ["restaurant", "cafe", "fast_food_restaurant"],
  "maxResultCount": 20,
  "rankPreference": "DISTANCE",
  "locationRestriction": { "circle": { "center": { "latitude": 13.0378, "longitude": 80.2318 }, "radius": 1500 } }
}
```

- `maxResultCount` is capped at **20** per call, and Nearby Search has no page token. More results
  means another call with a wider radius. Text Search (New) does paginate, if a text query is ever
  needed.
- The field mask is mandatory and sets the price (§6). `rating` / `userRatingCount` /
  `currentOpeningHours` / `priceLevel` → **Enterprise**; adding `servesVegetarianFood` →
  **Enterprise + Atmosphere**.
- `servesVegetarianFood: true` means "has vegetarian options". It is **not** "pure veg", and it
  **never** implies vegan (PRD rule: vegetarian and vegan are never conflated).

**Place Details (New)** — detail view

```http
GET https://places.googleapis.com/v1/places/{PLACE_ID}
X-Goog-Api-Key: <server key>
X-Goog-FieldMask: id,displayName,location,formattedAddress,rating,userRatingCount,
  regularOpeningHours,currentOpeningHours.openNow,nationalPhoneNumber,websiteUri,priceLevel,
  servesVegetarianFood,reviews,googleMapsUri
```

- `reviews` returns up to 5 reviews. Each must be shown with its author name, photo and profile link.
- **A place_id refresh is free:** Place Details with only `id` in the field mask (Essentials IDs
  Only). Refresh stored ids older than 12 months this way.

**Display obligations (Google policy)**
- The Google Maps logo or "Google Maps" text attribution sits on every list or card that shows
  Google data.
- Google content is visually separated (border or background) from Veggie and OpenStreetMap content.
- If a map is shown with Google results, it must be a Google Map.

### 3.2 Google Maps JavaScript API — map view

- A browser key (`NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY`) restricted by HTTP referrer to the app's
  domains.
- It renders markers for the results our own API returned. It never calls Places from the browser.
- It replaces the OpenStreetMap embed only when the Google source is on. With it off, the
  OpenStreetMap map and OpenStreetMap data stay as they are now.

### 3.3 OpenStreetMap Overpass — fallback + diet tags (already built)

`src/domain/places/osm.ts`. Two uses:
1. **Fallback** when Google is off, over quota, or failing. Discover keeps working with "no external
   rating" shown.
2. **Diet evidence.** When an OpenStreetMap place and a Google place are matched (same name within
   ~50 m, confirmed once and stored in `restaurant_sources`), OpenStreetMap's
   `diet:vegetarian/vegan=only` can show as a *separate, labelled* source.

For production, don't use the public Overpass servers: host an Overpass instance or keep a nightly
extract. In testing, the public main server returned 504 on first attempts and the mirrors were
unreachable from here. Attribution is "© OpenStreetMap contributors (ODbL)".

### 3.4 Veggie Rating — our own, first-party

No external API. Stored in Postgres (`ratings`, Phase 6), with a Bayesian/confidence adjustment so
that 5.0 from 2 diners doesn't outrank 4.8 from 200 (PRD §7.4). This is the rating Veggie owns and
is allowed to store, rank and learn from.

---

## 4. Veggie's own API (what the app calls)

Version prefix `/api/v1`. JSON only. Times in ISO-8601 UTC. Distances in metres.

### 4.1 Error envelope — one shape for every endpoint

```json
{ "error": { "code": "map_unavailable", "message": "Map data is busy. Try again shortly.",
             "details": [], "request_id": "01J8Z…" } }
```

| Status | `code` | Client should |
|---|---|---|
| 400 | `invalid_query` — `details[]` lists **every** bad field | fix, never retry |
| 401 | `unauthenticated` (write endpoints only) | sign in |
| 404 | `place_not_found`, `area_not_found` | not retry |
| 409 | `already_rated` (same idempotency key, different body) | re-read |
| 422 | `rating_out_of_range`, `unknown_city` | fix, never retry |
| 429 | `rate_limited` + `Retry-After` header | retry after that many seconds |
| 503 | `map_unavailable` — every upstream failed | retry with backoff |

Upstream vendor messages, keys and hostnames never appear in a response. They are logged under
`request_id`.

### 4.2 `GET /api/v1/places/nearby`

Public (signed-out visitors can browse). Rate limit: **30 requests / minute per IP**, since each
call costs money upstream.

| Param | Type | Rule |
|---|---|---|
| `city`, `area` | string | Required together, **or** use `lat`+`lng` |
| `lat`, `lng` | number | India bounding box only; used for this request, never stored |
| `radius_m` | int | 500–5000, default 1500 |
| `diet` | `vegetarian` \| `vegan` | Optional. Filters on **declared** evidence only |
| `open_now` | bool | Optional. A place with unknown hours is excluded when true |
| `cursor` | string | Opaque. Returned as `next_cursor`; `null` = end |

Response `200`:

```json
{
  "data": [PlaceSummary],
  "next_cursor": "eyJ…" ,
  "center": { "lat": 13.0378, "lng": 80.2318, "label": "T. Nagar, Chennai" },
  "sources": ["google_places", "veggie"],
  "retrieved_at": "2026-09-23T10:41:07Z"
}
```

### 4.3 `GET /api/v1/places/{id}`

`id` is the **Veggie place id** (`plc_…`, stable, ours to control). Provider ids are never used as
public ids. Returns `PlaceDetail` = `PlaceSummary` + `phone`, `website`, `hours[]`,
`external_reviews[]` (with author attribution), `veggie_reviews_preview[]`. Live fetch;
`404 place_not_found` if the provider no longer knows it.

### 4.4 `GET /api/v1/places/{id}/ratings?cursor=`

Veggie diners' ratings, newest first, cursor-paginated, `limit` default 20, max 50.

### 4.5 `POST /api/v1/places/{id}/ratings` — signed in

Header `Idempotency-Key: <uuid>` is **required**, so a retried tap never double-counts a rating.

```json
{ "overall": 4, "diet_accuracy": "matched" , "dish": "Ghee roast dosa", "comment": "optional, ≤500 chars" }
```

`diet_accuracy` ∈ `matched | not_as_declared | unsure` feeds verification. `201` returns the updated
`veggie` rating block. One rating per user per place: a second POST with a new key replaces the
first (it's an update, never a second vote).

### 4.6 `POST /api/v1/places/{id}/corrections` — signed in

`{ "kind": "not_vegetarian | not_vegan | closed | wrong_hours | other", "detail": "…" }` →
`202 Accepted` into the moderation queue (admin `/admin/ratings`). Nothing changes publicly until a
moderator approves (UC-10).

### 4.7 Shared types

```ts
type DietEvidence = {
  status: "only" | "yes" | "no" | "unknown";
  source: "restaurant_declared" | "veggie_verified" | "google" | "osm" | "user_reported";
  confidence: "high" | "medium" | "low";
};

type PlaceSummary = {
  id: string;                         // plc_… (Veggie)
  name: string;
  location: { lat: number; lng: number };
  distance_m: number;
  address: string | null;             // null renders "data unavailable", never ""
  cuisines: string[];
  open_now: boolean | null;           // null = unknown, never assumed open
  price_level: 1 | 2 | 3 | 4 | null;
  diet: { vegetarian: DietEvidence; vegan: DietEvidence };   // never merged
  ratings: {
    veggie: { score: number; count: number; confidence: "low" | "medium" | "high" } | null;
    external: Array<{                 // shown beside veggie, NEVER averaged into it
      provider: "google";
      rating: number;                 // 1.0–5.0 as the provider returned it
      count: number;
      url: string;                    // googleMapsUri
      attribution: "Google Maps";
    }>;
  };
  attributions: Array<"Google Maps" | "© OpenStreetMap contributors (ODbL)">;
};
```

**Diet precedence** (strongest evidence wins, and the source is always shown):
`veggie_verified` > `restaurant_declared` (partner portal) > `osm` `only` > `google`
`servesVegetarianFood` > `unknown`. Google's flag can only ever produce vegetarian `yes`, never
`only`, and never anything for vegan.

### 4.8 Versioning

Adding optional fields is non-breaking. Renaming a field, changing a type, or tightening validation
is `/api/v2`, and `/api/v1` stays up for at least 90 days after a deprecation notice. The prototype
route `/api/places/nearby` is removed when `/api/v1` ships; only this app uses it.

---

## 5. Configuration

| Variable | Where | Purpose |
|---|---|---|
| `FEATURE_GOOGLE_PLACES` | server | exists — turns on the Google source |
| `GOOGLE_PLACES_API_KEY` | server secret | exists — Places API (New), IP-restricted |
| `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` | browser | **new** — Maps JS, referrer-restricted |
| `OVERPASS_URL` | server | **new** — self-hosted Overpass for production |
| `PLACES_RATE_LIMIT_PER_MIN` | server | **new** — default 30 |

A Google billing account with a **budget alert** and **per-API daily quota caps** set in Cloud
Console is a precondition of turning the flag on.

---

## 6. Cost (Google India pricing, per month, checked 2026-09-23)

| SKU | Free / month | Then, per 1,000 |
|---|---|---|
| Nearby Search Pro (no rating) | 35,000 | $9.60 |
| Nearby Search Enterprise (rating, hours) | 7,000 | $10.50 |
| Nearby Search Enterprise + Atmosphere (+ `servesVegetarianFood`, reviews) | 7,000 | $12.00 |
| Place Details Enterprise | 7,000 | $6.00 |
| Place Details Enterprise + Atmosphere | 7,000 | $7.50 |
| Place Details IDs Only (place_id refresh) | unlimited | free |
| Dynamic Maps (Maps JS) | 70,000 | $2.10 |

**Worked example, pilot of 500 active users, 3 searches a day:** 45,000 Nearby (Atmosphere) calls
→ 38,000 billable × $12 = **≈ $456**. Plus ~15,000 detail opens → 8,000 × $7.50 = **≈ $60**. Map
loads fit inside the free 70,000. **Roughly $500/month.**

Levers, in order of impact:
1. Search only on an explicit area change or "Search this area", never on every map pan.
2. Drop `servesVegetarianFood` from the *list* mask (→ Enterprise, $10.50) and fetch it on detail
   only.
3. Drop ratings from the list (→ Pro, 35,000 free, $9.60) and show them only on detail. This is the
   cheapest option, but you lose ratings in the list.

---

## 7. Alternatives considered

| Provider | Ratings? | Verdict |
|---|---|---|
| Google Places (New) | Yes: rating, count, up to 5 reviews | **Recommended**: best India coverage, and the only one with a vegetarian flag |
| Foursquare Places | Premium field, no free tier, from $18.75 / 1,000 | Costlier, weaker India coverage |
| Mappls (MapmyIndia) | Consumer app has reviews; public API ratings not confirmed | Worth a sales conversation for an India-only build |
| OpenStreetMap | No ratings | Keep as fallback + diet tags |
| Zomato / Swiggy | No official API | **Excluded**: scraping only, which the PRD forbids |

---

## 8. Acceptance tests (contract)

1. A vegan-filtered search never returns a place whose only evidence is Google
   `servesVegetarianFood`.
2. The response `veggie.score` is identical whether or not the Google rating is present. The
   ratings are never blended.
3. No Google field other than `place_id` exists in Postgres (a schema test asserts the column list).
4. With `FEATURE_GOOGLE_PLACES=false`, `/nearby` returns OpenStreetMap results, `external: []`, and
   status 200.
5. When every upstream fails, the response is `503` `map_unavailable`, contains no vendor text,
   and has a `request_id`.
6. A POST rating replayed with the same `Idempotency-Key` returns the same `201` body and
   `count` does not change.
7. A 31st request in one minute from one IP gets `429` with `Retry-After`.

## Sources

- Google — Nearby Search (New): https://developers.google.com/maps/documentation/places/web-service/nearby-search
- Google — Places policies (caching, attribution, Google-map rule): https://developers.google.com/maps/documentation/places/web-service/policies
- Google — India pricing list: https://developers.google.com/maps/billing-and-pricing/pricing-india
- Foursquare pricing: https://foursquare.com/pricing/
- Mappls APIs: https://about.mappls.com/api/
