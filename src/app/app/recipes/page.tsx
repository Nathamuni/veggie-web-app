"use client";

import { useState } from "react";
import Link from "next/link";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card, CardTitle } from "@/components/ui/Card";
import { ModeTag } from "@/components/ui/ModeTag";
import { recipes, type DietMode } from "@/lib/fixtures";

const cuisines = Array.from(new Set(recipes.map((r) => r.cuisine))).sort();
const budgetBands: Array<"₹" | "₹₹" | "₹₹₹"> = ["₹", "₹₹", "₹₹₹"];

const dietOptions: Array<{
  id: "all" | DietMode;
  label: string;
  border: string;
  bg: string;
  text: string;
}> = [
  { id: "all", label: "All", border: "border-ink", bg: "bg-ink", text: "text-surface" },
  { id: "vegetarian", label: "Vegetarian", border: "border-curry-leaf", bg: "bg-curry-leaf-tint", text: "text-curry-leaf" },
  { id: "vegan", label: "Vegan", border: "border-kattam-blue", bg: "bg-kattam-blue-tint", text: "text-kattam-blue" },
];

export default function RecipesPage() {
  const [dietFilter, setDietFilter] = useState<"all" | DietMode>("all");
  const [cuisineFilter, setCuisineFilter] = useState<string | null>(null);
  const [highProteinOnly, setHighProteinOnly] = useState(false);
  const [quickOnly, setQuickOnly] = useState(false);
  const [budgetFilter, setBudgetFilter] = useState<"₹" | "₹₹" | "₹₹₹" | null>(null);
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();

  const filtered = recipes.filter((r) => {
    if (dietFilter !== "all" && r.dietMode !== dietFilter) return false;
    if (cuisineFilter && r.cuisine !== cuisineFilter) return false;
    if (highProteinOnly && r.protein !== "high") return false;
    if (quickOnly && r.timeMinutes > 30) return false;
    if (budgetFilter && r.costBand !== budgetFilter) return false;
    if (query) {
      const nameMatch = r.name.toLowerCase().includes(query);
      const ingredientMatch = r.ingredients.some((i) => i.toLowerCase().includes(query));
      if (!nameMatch && !ingredientMatch) return false;
    }
    return true;
  });

  return (
    <main className="flex-1 pb-8">
      <Shell>
        <Link href="/app" className="mt-5 inline-block text-ink">
          ← Home
        </Link>
        <PageTitle eyebrow="Discover">Recipes</PageTitle>

        <label className="mb-4 flex flex-col gap-1.5 xl:max-w-[520px]">
          <span className="sr-only">Search recipes</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or ingredient"
            className="rounded-[6px] border border-hairline bg-surface px-3 py-2.5 text-[0.9375rem] outline-none focus:border-turmeric"
          />
        </label>

        {/* Filter groups: stacked on phone/tablet. Desktop: diet / protein / budget on the left,
            the long cuisine list on the right, so the recipe grid starts higher. */}
        <div className="xl:grid xl:grid-cols-2 xl:items-start xl:gap-x-10">
          <div className="mb-4 flex flex-wrap gap-2">
            {dietOptions.map((d) => {
              const selected = d.id === dietFilter;
              return (
                <button
                  type="button"
                  key={d.id}
                  onClick={() => setDietFilter(d.id)}
                  className={`rounded-full border px-3 py-1.5 text-[0.8125rem] ${
                    selected ? `${d.border} ${d.bg} ${d.text}` : "border-hairline bg-surface text-ink-soft"
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>

          <div className="mb-4 xl:col-start-2 xl:row-span-3 xl:row-start-1">
            <p className="mb-1.5 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">Cuisine</p>
            <div className="flex flex-wrap gap-2">
              {cuisines.map((c) => {
                const selected = cuisineFilter === c;
                return (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setCuisineFilter(selected ? null : c)}
                    className={`rounded-full border px-3 py-1.5 text-[0.8125rem] ${
                      selected ? "border-ink bg-ink text-surface" : "border-hairline bg-surface text-ink"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setHighProteinOnly((v) => !v)}
              className={`rounded-full border px-3 py-1.5 text-[0.8125rem] ${
                highProteinOnly ? "border-2 border-ink font-medium" : "border-hairline bg-surface text-ink-soft"
              }`}
            >
              High protein
            </button>
            <button
              type="button"
              onClick={() => setQuickOnly((v) => !v)}
              className={`rounded-full border px-3 py-1.5 text-[0.8125rem] ${
                quickOnly ? "border-2 border-ink font-medium" : "border-hairline bg-surface text-ink-soft"
              }`}
            >
              Quick (≤30 min)
            </button>
          </div>

          <div className="mb-5">
            <p className="mb-1.5 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">Budget</p>
            <div className="flex gap-2">
              {budgetBands.map((b) => {
                const selected = budgetFilter === b;
                return (
                  <button
                    type="button"
                    key={b}
                    onClick={() => setBudgetFilter(selected ? null : b)}
                    className={`flex-1 rounded-[6px] border px-3 py-2 text-center font-mono text-[0.8125rem] ${
                      selected ? "border-2 border-ink font-medium" : "border-hairline text-ink-soft"
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className="mb-2 text-[0.75rem] text-ink-soft">
          {filtered.length} recipe{filtered.length === 1 ? "" : "s"}
        </p>

        <div className="flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-3 xl:grid-cols-3">
          {filtered.map((r) => (
            <Link key={r.id} href={`/app/recipes/${r.id}`} className="block">
              <Card className="transition-colors hover:border-ink-soft md:h-full">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle>{r.name}</CardTitle>
                    <p className="text-[0.8125rem] text-ink-soft">
                      {r.cuisine} · {r.timeMinutes} min · {r.costBand}
                    </p>
                    <p className="mt-1 font-mono text-[0.75rem] text-ink-soft">
                      ★ {r.satisfactionAvg} ({r.satisfactionCount})
                    </p>
                  </div>
                  <ModeTag mode={r.dietMode} />
                </div>
              </Card>
            </Link>
          ))}
          {filtered.length === 0 ? (
            <p className="py-6 text-center text-[0.875rem] text-ink-soft md:col-span-full">
              No recipes match these filters.
            </p>
          ) : null}
        </div>
      </Shell>
    </main>
  );
}
