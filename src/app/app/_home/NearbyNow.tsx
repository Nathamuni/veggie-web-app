"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DietStatus } from "@/components/ui/DietStatus";
import type { Place } from "@/domain/places/osm";

type State = { status: "loading" } | { status: "error" } | { status: "ok"; places: Place[] };

const rank = (p: Place) => (p.vegetarian === "only" ? 0 : p.vegetarian === "yes" || p.vegan !== "unknown" ? 1 : 2);

/** Three real places close to the user's chosen area — declared-vegetarian first. */
export function NearbyNow({ city, area }: { city: string; area: string }) {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/places/nearby?${new URLSearchParams({ city, area, radius: "1000" })}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) return setState({ status: "error" });
        const body: { places: Place[] } = await res.json();
        const places = [...body.places].sort((a, b) => rank(a) - rank(b)).slice(0, 3);
        setState({ status: "ok", places });
      })
      .catch((e: Error) => {
        if (e.name !== "AbortError") setState({ status: "error" });
      });
    return () => controller.abort();
  }, [city, area]);

  return (
    <section aria-labelledby="nearby-title">
      <div className="mb-2 flex items-baseline justify-between">
        <h2 id="nearby-title" className="text-[1.125rem] font-semibold">
          Near you now
        </h2>
        <Link href="/app/discover" className="text-[0.8125rem] underline underline-offset-4">
          See all
        </Link>
      </div>
      <p className="mb-2 text-[0.8125rem] text-ink-soft">Within 1 km of {area}</p>

      {state.status === "loading" ? (
        <div aria-busy="true" className="flex flex-col gap-2">
          <p role="status" className="sr-only">
            Finding places near {area}…
          </p>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-[6px] border border-hairline bg-surface motion-reduce:animate-none" />
          ))}
        </div>
      ) : state.status === "error" || state.places.length === 0 ? (
        <p className="rounded-[6px] border border-dashed border-hairline bg-surface px-4 py-4 text-[0.875rem] text-ink-soft">
          {state.status === "error" ? "Map data is busy right now." : "Nothing mapped this close."}{" "}
          <Link href="/app/discover" className="text-ink underline underline-offset-4">
            Search a wider area
          </Link>
        </p>
      ) : (
        <ul className="divide-y divide-hairline rounded-[6px] border border-hairline bg-surface">
          {state.places.map((p) => (
            <li key={p.id}>
              <Link
                href={`/app/places/${p.id}`}
                className="flex min-h-14 items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-paper"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[0.9375rem] font-medium">{p.name}</span>
                  <span className="block font-mono text-[0.6875rem] text-ink-soft">
                    {p.distanceKm !== null ? `${p.distanceKm} km` : ""}
                    {p.cuisines[0] ? ` · ${p.cuisines[0]}` : ""}
                  </span>
                </span>
                <DietStatus place={p} />
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-1.5 font-mono text-[0.625rem] uppercase tracking-wide text-ink-soft">
        Real places · © OpenStreetMap contributors
      </p>
    </section>
  );
}
