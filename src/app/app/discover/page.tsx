"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card } from "@/components/ui/Card";
import { SourceLabel } from "@/components/ui/SourceLabel";
import { EmptyState } from "@/components/ui/EmptyState";
import { DietStatus } from "@/components/ui/DietStatus";
import { restaurants, user, type DietMode } from "@/lib/fixtures";
import { cities, states, findCity } from "@/lib/locations";
import type { Place, Center } from "@/domain/places/osm";

type DietFilter = "all" | DietMode;

type Result =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; center: Center; radiusM: number; places: Place[]; retrievedAt: string };

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-[0.8125rem] ${
        selected ? "border-ink bg-ink text-surface" : "border-hairline bg-surface text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function matchesDiet(p: Place, filter: DietFilter) {
  if (filter === "vegan") return p.vegan === "yes" || p.vegan === "only";
  if (filter === "vegetarian") return p.vegetarian === "yes" || p.vegetarian === "only";
  return true;
}

function mapEmbedUrl(center: Center, radiusM: number) {
  const dLat = radiusM / 111_000;
  const dLng = radiusM / (111_000 * Math.cos((center.lat * Math.PI) / 180));
  const bbox = [center.lng - dLng, center.lat - dLat, center.lng + dLng, center.lat + dLat]
    .map((n) => n.toFixed(5))
    .join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${center.lat.toFixed(5)},${center.lng.toFixed(5)}`;
}

export default function DiscoverPage() {
  const [view, setView] = useState<"list" | "map">("list");
  const [dietFilter, setDietFilter] = useState<DietFilter>("all");
  const [cuisineFilter, setCuisineFilter] = useState<string>("All");
  const [city, setCity] = useState(user.city);
  const [area, setArea] = useState(user.area);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoNote, setGeoNote] = useState<string | null>(null);
  const [radiusM, setRadiusM] = useState(1500);
  const [result, setResult] = useState<Result>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  const qs = coords
    ? new URLSearchParams({ lat: String(coords.lat), lng: String(coords.lng), radius: String(radiusM) })
    : new URLSearchParams({ city, area, radius: String(radiusM) });
  const url = `/api/places/nearby?${qs}`;

  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) setResult({ status: "error", message: body.message ?? "Couldn't load places." });
        else setResult({ status: "ok", ...body });
      })
      .catch((e: Error) => {
        if (e.name !== "AbortError")
          setResult({ status: "error", message: "No connection to map data. Check your network and retry." });
      });
    return () => controller.abort();
  }, [url, attempt]);

  function chooseCity(next: string) {
    setResult({ status: "loading" });
    setCoords(null);
    setCity(next);
    setArea(findCity(next)?.areas[0] ?? "");
  }

  function chooseArea(next: string) {
    setResult({ status: "loading" });
    setCoords(null);
    setArea(next);
  }

  function usePrecise() {
    if (!("geolocation" in navigator)) {
      setGeoNote("This browser can't share location — the area you chose works just as well.");
      return;
    }
    setGeoNote("Asking your browser…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setResult({ status: "loading" });
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoNote("Using your current location for this search only — it isn't stored.");
      },
      () => setGeoNote("Location permission wasn't given — that's fine. Results use the area you chose."),
      { timeout: 10000, maximumAge: 600000 },
    );
  }

  function widen() {
    setResult({ status: "loading" });
    setRadiusM((r) => Math.min(r * 2, 5000));
  }

  const places = result.status === "ok" ? result.places : [];
  const cuisines = Array.from(new Set(places.flatMap((p) => p.cuisines))).sort().slice(0, 12);
  const filtered = places.filter(
    (p) => matchesDiet(p, dietFilter) && (cuisineFilter === "All" || p.cuisines.includes(cuisineFilter)),
  );

  return (
    <main className="flex-1 pb-8">
      <Shell>
        <Link href="/app" className="mt-5 inline-block text-ink">
          ← Home
        </Link>
        <PageTitle eyebrow="Nearby">Discover</PageTitle>

        <Card className="mb-4">
          <div className="grid grid-cols-2 gap-2 xl:max-w-[560px]">
            <label className="flex min-w-0 flex-col gap-1.5">
              <span className="text-[0.8125rem] font-medium">City</span>
              <select
                value={city}
                onChange={(e) => chooseCity(e.target.value)}
                className="min-w-0 rounded-[6px] border border-hairline bg-surface px-2 py-2.5 text-[0.875rem]"
              >
                {states.map((s) => (
                  <optgroup key={s} label={s}>
                    {cities
                      .filter((c) => c.state === s)
                      .map((c) => (
                        <option key={c.name}>{c.name}</option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </label>
            <label className="flex min-w-0 flex-col gap-1.5">
              <span className="text-[0.8125rem] font-medium">Area</span>
              <select
                value={area}
                onChange={(e) => chooseArea(e.target.value)}
                className="min-w-0 rounded-[6px] border border-hairline bg-surface px-2 py-2.5 text-[0.875rem]"
              >
                {(findCity(city)?.areas ?? []).map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </label>
          </div>
          <button
            type="button"
            onClick={usePrecise}
            className="mt-2 text-[0.8125rem] text-ink underline underline-offset-4"
          >
            {coords ? "Using current location" : "Use precise location (optional)"}
          </button>
          {geoNote ? (
            <p role="status" className="mt-1 text-[0.8125rem] text-ink-soft">
              {geoNote}
            </p>
          ) : null}
        </Card>

        <div className="mb-4 flex gap-2 xl:hidden">
          {(["list", "map"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={`flex-1 rounded-[4px] border px-4 py-2 text-[0.8125rem] font-medium capitalize ${
                view === v ? "border-ink bg-ink text-surface" : "border-hairline bg-surface text-ink"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="mb-3 flex flex-col gap-2">
          <div className="flex gap-2 overflow-x-auto pb-1 xl:flex-wrap">
            <Chip selected={dietFilter === "all"} onClick={() => setDietFilter("all")}>
              All places
            </Chip>
            <Chip selected={dietFilter === "vegetarian"} onClick={() => setDietFilter("vegetarian")}>
              Vegetarian declared
            </Chip>
            <Chip selected={dietFilter === "vegan"} onClick={() => setDietFilter("vegan")}>
              Vegan declared
            </Chip>
          </div>
          {cuisines.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto pb-1 xl:flex-wrap">
              <Chip selected={cuisineFilter === "All"} onClick={() => setCuisineFilter("All")}>
                All cuisines
              </Chip>
              {cuisines.map((c) => (
                <Chip key={c} selected={cuisineFilter === c} onClick={() => setCuisineFilter(c)}>
                  <span className="capitalize">{c}</span>
                </Chip>
              ))}
            </div>
          ) : null}
        </div>

        {result.status === "loading" ? (
          <div aria-busy="true" className="flex flex-col gap-2">
            <p role="status" className="sr-only">
              Finding places near {area}…
            </p>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-[6px] border border-hairline bg-surface motion-reduce:animate-none"
              />
            ))}
          </div>
        ) : result.status === "error" ? (
          <EmptyState title="Map data didn't load" reason={result.message} actionHref="/app/recipes" actionLabel="Cook at home instead">
            <button
              type="button"
              onClick={() => {
                setResult({ status: "loading" });
                setAttempt((n) => n + 1);
              }}
              className="mt-3 block w-full text-[0.8125rem] underline underline-offset-4"
            >
              Try again
            </button>
          </EmptyState>
        ) : (
          <>
            <p className="mb-2 text-[0.8125rem] text-ink-soft">
              {filtered.length} of {places.length} places within {(result.radiusM / 1000).toFixed(1)} km of{" "}
              {result.center.label}
            </p>

            <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_45%] xl:items-start xl:gap-6">
            {/* Below lg the map shows only in Map view; at lg it is always beside the list. */}
            <div
              className={`mb-3 overflow-hidden rounded-[6px] border border-hairline xl:sticky xl:top-6 xl:col-start-2 xl:row-start-1 xl:mb-0 xl:block ${
                view === "map" ? "" : "hidden"
              }`}
            >
              <iframe
                title={`Map of ${result.center.label}`}
                src={mapEmbedUrl(result.center, result.radiusM)}
                className="h-72 w-full xl:h-[min(640px,calc(100dvh-3rem))]"
                loading="lazy"
              />
            </div>

            <div className="min-w-0 xl:col-start-1 xl:row-start-1">
            {filtered.length === 0 ? (
              <EmptyState
                title="No places match"
                reason={
                  dietFilter !== "all"
                    ? "Few places here have their diet options mapped yet. Widen the search, or show all places — unverified ones are labelled."
                    : "Nothing mapped this close. Widen the search, or cook at home tonight."
                }
                actionHref="/app/recipes"
                actionLabel="See recipes instead"
              >
                {result.radiusM < 5000 ? (
                  <button
                    type="button"
                    onClick={widen}
                    className="mt-3 block w-full text-[0.8125rem] underline underline-offset-4"
                  >
                    Widen to {Math.min(result.radiusM * 2, 5000) / 1000} km
                  </button>
                ) : null}
              </EmptyState>
            ) : (
              <ol className="flex flex-col gap-2 md:grid md:grid-cols-2 xl:grid-cols-1">
                {filtered.slice(0, 60).map((p) => (
                  <li key={p.id}>
                    <Link href={`/app/places/${p.id}`} className="block md:h-full">
                      <Card className="transition-colors hover:border-ink-soft md:h-full">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[0.9375rem] font-medium">{p.name}</p>
                            <p className="text-[0.8125rem] capitalize text-ink-soft">
                              {p.kind.replaceAll("_", " ")}
                              {p.cuisines.length ? ` · ${p.cuisines.slice(0, 3).join(", ")}` : ""}
                            </p>
                            <p className="text-[0.8125rem] text-ink-soft">
                              {p.distanceKm !== null ? `${p.distanceKm} km` : ""}
                              {p.openingHours ? ` · ${p.openingHours}` : ""}
                            </p>
                          </div>
                          <DietStatus place={p} />
                        </div>
                      </Card>
                    </Link>
                  </li>
                ))}
              </ol>
            )}

            {result.radiusM < 5000 && filtered.length > 0 ? (
              <button
                type="button"
                onClick={widen}
                className="mt-3 w-full rounded-[6px] border border-hairline bg-surface px-4 py-2.5 text-[0.8125rem]"
              >
                Widen to {Math.min(result.radiusM * 2, 5000) / 1000} km
              </button>
            ) : null}

            <p className="mt-3">
              <SourceLabel>
                Places & diet tags: ©{" "}
                <a href="https://www.openstreetmap.org/copyright" className="underline" target="_blank" rel="noreferrer">
                  OpenStreetMap contributors
                </a>{" "}
                (ODbL) · no Veggie Rating yet
              </SourceLabel>
            </p>
            </div>
            </div>
          </>
        )}

        <details className="mt-8 border-t border-hairline pt-4">
          <summary className="cursor-pointer text-[0.875rem] font-medium">
            Sample listings with dish-level detail (demo data)
          </summary>
          <p className="mt-2 max-w-prose text-[0.8125rem] text-ink-soft">
            These show what a fully profiled restaurant will look like — menus, Veggie Rating, combos.
            They are not real places.
          </p>
          <div className="mt-3 flex flex-col gap-2 md:grid md:grid-cols-2 xl:grid-cols-3">
            {restaurants.map((r) => (
              <Link key={r.id} href={`/app/restaurants/${r.id}`} className="block">
                <Card className="transition-colors hover:border-ink-soft md:h-full">
                  <p className="text-[0.9375rem] font-medium">{r.name}</p>
                  <p className="text-[0.8125rem] text-ink-soft">
                    {r.area} · {r.cuisines.join(", ")}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </details>
      </Shell>
    </main>
  );
}
