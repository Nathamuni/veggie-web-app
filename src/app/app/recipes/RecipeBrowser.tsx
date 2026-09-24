"use client";

import { useState } from "react";
import Link from "next/link";
import { ModeTag } from "@/components/ui/ModeTag";
import { EmptyState } from "@/components/ui/EmptyState";

export type RecipeCard = {
  id: string;
  name: string;
  cuisine: string;
  dietMode: "vegetarian" | "vegan";
  minutes: number;
  costBand: string;
  protein: "high" | "medium" | "low";
  tags: string[];
  ingredients: string[];
  saved: boolean;
};

type Diet = "all" | "vegetarian" | "vegan";

const chip = (on: boolean) =>
  `inline-flex min-h-10 shrink-0 items-center rounded-full border px-3.5 text-[0.8125rem] transition-colors ${
    on ? "border-ink bg-ink text-surface" : "border-hairline bg-surface text-ink hover:border-ink-soft"
  }`;

export function RecipeBrowser({
  recipes,
  userDiet,
  userCuisines,
  initialSaved,
}: {
  recipes: RecipeCard[];
  userDiet: "vegetarian" | "vegan";
  userCuisines: string[];
  initialSaved: boolean;
}) {
  // Vegan users start on vegan dishes; vegetarian users see both.
  const [diet, setDiet] = useState<Diet>(userDiet === "vegan" ? "vegan" : "all");
  const [cuisine, setCuisine] = useState<string | null>(null);
  const [quick, setQuick] = useState(false);
  const [protein, setProtein] = useState(false);
  const [savedOnly, setSavedOnly] = useState(initialSaved);
  const [search, setSearch] = useState("");

  // The user's own cuisines lead the list.
  const cuisines = Array.from(new Set(recipes.map((r) => r.cuisine))).sort(
    (a, b) => Number(userCuisines.includes(b)) - Number(userCuisines.includes(a)) || a.localeCompare(b),
  );

  const q = search.trim().toLowerCase();
  // "For you" order: your cuisines first, then the quickest.
  const ordered = [...recipes].sort(
    (a, b) =>
      Number(userCuisines.includes(b.cuisine)) - Number(userCuisines.includes(a.cuisine)) ||
      a.minutes - b.minutes ||
      a.name.localeCompare(b.name),
  );
  const filtered = ordered.filter(
    (r) =>
      (diet === "all" || r.dietMode === diet) &&
      (!cuisine || r.cuisine === cuisine) &&
      (!quick || r.minutes <= 30) &&
      (!protein || r.protein === "high") &&
      (!savedOnly || r.saved) &&
      (!q || r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q) || r.ingredients.some((i) => i.includes(q))),
  );
  const anyFilter = diet !== (userDiet === "vegan" ? "vegan" : "all") || cuisine || quick || protein || savedOnly || q;

  function reset() {
    setDiet(userDiet === "vegan" ? "vegan" : "all");
    setCuisine(null);
    setQuick(false);
    setProtein(false);
    setSavedOnly(false);
    setSearch("");
  }

  return (
    <>
      <label className="mb-3 block xl:max-w-[520px]">
        <span className="sr-only">Search recipes</span>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search a dish or an ingredient — paneer, dal, rice…"
          className="w-full rounded-[6px] border border-hairline bg-surface px-3 py-3 text-[1rem] outline-none focus:border-turmeric"
        />
      </label>

      {/* One scrollable row of quick filters, then cuisines. */}
      <div className="-mx-4 mb-2 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filters">
        <button type="button" aria-pressed={savedOnly} onClick={() => setSavedOnly((v) => !v)} className={chip(savedOnly)}>
          ♥ Saved
        </button>
        {userDiet === "vegetarian" ? (
          <>
            <button type="button" aria-pressed={diet === "all"} onClick={() => setDiet("all")} className={chip(diet === "all")}>
              Veg + vegan
            </button>
            <button type="button" aria-pressed={diet === "vegan"} onClick={() => setDiet("vegan")} className={chip(diet === "vegan")}>
              Vegan only
            </button>
          </>
        ) : null}
        <button type="button" aria-pressed={quick} onClick={() => setQuick((v) => !v)} className={chip(quick)}>
          ≤ 30 min
        </button>
        <button type="button" aria-pressed={protein} onClick={() => setProtein((v) => !v)} className={chip(protein)}>
          High protein
        </button>
      </div>
      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Cuisine">
        {cuisines.map((c) => (
          <button key={c} type="button" aria-pressed={cuisine === c} onClick={() => setCuisine(cuisine === c ? null : c)} className={chip(cuisine === c)}>
            {c}
          </button>
        ))}
      </div>

      <p className="mb-2 flex items-center justify-between text-[0.8125rem] text-ink-soft" aria-live="polite">
        <span>
          {filtered.length} recipe{filtered.length === 1 ? "" : "s"}
        </span>
        {anyFilter ? (
          <button type="button" onClick={reset} className="min-h-10 text-ink underline underline-offset-4">
            Clear filters
          </button>
        ) : null}
      </p>

      {filtered.length === 0 ? (
        savedOnly && !recipes.some((r) => r.saved) ? (
          <EmptyState title="Nothing saved yet" reason="Tap ♡ Save on any recipe to keep it here for later." />
        ) : (
          <EmptyState title="No recipes match" reason="Try fewer filters or a different word." />
        )
      ) : (
        <ul className="flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-3 xl:grid-cols-3">
          {filtered.map((r) => (
            <li key={r.id}>
              <Link
                href={`/app/recipes/${r.id}`}
                className="flex h-full flex-col rounded-[6px] border border-hairline bg-surface p-4 transition-colors hover:border-ink-soft"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="text-[1.0625rem] font-semibold leading-snug">{r.name}</span>
                  <ModeTag mode={r.dietMode} />
                </span>
                <span className="mt-1 text-[0.8125rem] text-ink-soft">
                  {r.cuisine} · {r.minutes} min · {r.costBand}
                  {r.protein === "high" ? " · high protein" : ""}
                </span>
                {r.saved ? <span className="mt-2 font-mono text-[0.6875rem] uppercase tracking-wide text-turmeric">♥ Saved</span> : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
