"use client";

import { useState } from "react";
import { cities, states, findCity, nearestCity, NEAREST_CITY_MAX_KM } from "@/lib/locations";

const OTHER = "__other__";

const field =
  "w-full rounded-[6px] border border-hairline bg-surface px-3 py-2.5 text-[0.9375rem] outline-none focus:border-turmeric";

type GeoState =
  | { kind: "idle" }
  | { kind: "asking" }
  | { kind: "matched"; city: string; km: number }
  | { kind: "outside"; city: string; km: number }
  | { kind: "denied" }
  | { kind: "unsupported" };

/**
 * Manual city + area is the primary path (§4.2). Precise location is optional,
 * used once in the browser to suggest the nearest city, and never stored.
 */
export function LocationPicker({
  defaultCity,
  defaultArea,
  showPrecise = true,
}: {
  defaultCity: string;
  defaultArea: string;
  showPrecise?: boolean;
}) {
  const [city, setCity] = useState(defaultCity);
  const [area, setArea] = useState(defaultArea);
  const [otherArea, setOtherArea] = useState("");
  const [geo, setGeo] = useState<GeoState>({ kind: "idle" });

  const areas = findCity(city)?.areas ?? [];

  function chooseCity(next: string) {
    setCity(next);
    setArea(findCity(next)?.areas[0] ?? OTHER);
  }

  function usePrecise() {
    if (!("geolocation" in navigator)) {
      setGeo({ kind: "unsupported" });
      return;
    }
    setGeo({ kind: "asking" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { city: near, km } = nearestCity(pos.coords.latitude, pos.coords.longitude);
        if (km <= NEAREST_CITY_MAX_KM) {
          chooseCity(near.name);
          setGeo({ kind: "matched", city: near.name, km: Math.round(km) });
        } else {
          setGeo({ kind: "outside", city: near.name, km: Math.round(km) });
        }
      },
      () => setGeo({ kind: "denied" }),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="loc-city" className="mb-1.5 block text-[0.8125rem] font-medium">
          City <span className="text-rust">*</span>
        </label>
        <select id="loc-city" name="city" required value={city} onChange={(e) => chooseCity(e.target.value)} className={field}>
          {states.map((s) => (
            <optgroup key={s} label={s}>
              {cities
                .filter((c) => c.state === s)
                .map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="loc-area" className="mb-1.5 block text-[0.8125rem] font-medium">
          Area <span className="text-rust">*</span>
        </label>
        <select id="loc-area" name="area" required value={area} onChange={(e) => setArea(e.target.value)} className={field}>
          {areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
          <option value={OTHER}>My area isn&apos;t listed</option>
        </select>
        {area === OTHER ? (
          <label className="mt-2 flex flex-col gap-1.5">
            <span className="text-[0.8125rem] font-medium">Your area in {city}</span>
            <input
              type="text"
              name="areaOther"
              required
              maxLength={80}
              value={otherArea}
              onChange={(e) => setOtherArea(e.target.value)}
              placeholder="e.g. Kolathur"
              className={field}
            />
          </label>
        ) : null}
        <p className="mt-1.5 text-[0.75rem] text-ink-soft">
          We use this to find places near you — no GPS needed.
        </p>
      </div>

      {showPrecise ? (
        <div className="border-t border-hairline pt-4">
          <p className="mb-2 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">Optional</p>
          <button
            type="button"
            onClick={usePrecise}
            disabled={geo.kind === "asking"}
            className="w-full rounded-[6px] border border-hairline bg-surface px-4 py-3 text-[0.875rem] text-ink disabled:opacity-60"
          >
            {geo.kind === "asking" ? "Asking your browser…" : "⊕ Use precise location"}
          </button>
          <p role="status" className="mt-2 text-[0.8125rem] text-ink-soft">
            {geo.kind === "matched" &&
              `You're near ${geo.city} (about ${geo.km} km from the centre). Pick your area above.`}
            {geo.kind === "outside" &&
              `We don't cover your city yet — the closest we have is ${geo.city}, ${geo.km} km away. Choose it only if you eat there.`}
            {geo.kind === "denied" &&
              "Location permission wasn't given — that's fine. The city and area you chose work just as well."}
            {geo.kind === "unsupported" && "This browser can't share location. Choose your city and area above."}
            {(geo.kind === "idle" || geo.kind === "asking") &&
              "Suggests your nearest city. Used once, never stored; turn off any time in Settings."}
          </p>
        </div>
      ) : null}
    </div>
  );
}
