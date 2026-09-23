"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ModeTag } from "@/components/ui/ModeTag";
import { recipes, type Recipe } from "@/lib/fixtures";

function missingDimensions(recipe: Recipe): { key: string; label: string }[] {
  const flags: { key: string; label: string }[] = [];
  if (recipe.protein === "low") flags.push({ key: "protein", label: "Protein" });
  if (!recipe.tags.some((t) => t.toLowerCase().includes("vegetable"))) {
    flags.push({ key: "vegetables", label: "Vegetables" });
  }
  if (flags.length === 0) {
    // Demo fallback: this screen should always have something to complete.
    flags.push({ key: "vegetables", label: "Vegetables" });
  }
  return flags;
}

export default function CompleteMyMealPage() {
  const [dishName, setDishName] = useState(recipes[0].name);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [offsets, setOffsets] = useState<number[]>([0, 1, 2]);

  const selectedRecipe = recipes.find(
    (r) => r.name.toLowerCase() === dishName.trim().toLowerCase()
  );

  const pool = useMemo(() => {
    if (!selectedRecipe) return [];
    return recipes.filter(
      (r) =>
        r.id !== selectedRecipe.id &&
        (r.protein === "high" || r.tags.some((t) => t.toLowerCase().includes("vegetable")))
    );
  }, [selectedRecipe]);

  // Reset suggestions when the dish changes — adjusted during render, not in an effect.
  const [prevRecipeId, setPrevRecipeId] = useState(selectedRecipe?.id);
  if (prevRecipeId !== selectedRecipe?.id) {
    setPrevRecipeId(selectedRecipe?.id);
    setOffsets([0, 1, 2]);
    setAddedIds(new Set());
  }

  const suggestions = offsets
    .map((offset) => (pool.length > 0 ? pool[offset % pool.length] : undefined))
    .filter((r): r is Recipe => Boolean(r));

  function swapSuggestion(slot: number) {
    if (pool.length === 0) return;
    setOffsets((prev) => prev.map((o, i) => (i === slot ? (o + 1) % pool.length : o)));
  }

  function toggleAdded(id: string) {
    setAddedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <main className="flex-1 pb-8">
      <Shell>
        <Link href="/app" className="mt-5 inline-block text-ink">
          ← Home
        </Link>
        <PageTitle eyebrow="Fulfilment">Complete My Meal</PageTitle>

        {/* Desktop: the dish input stays pinned on the left, suggestions fill the right. */}
        <div className="xl:grid xl:grid-cols-[340px_minmax(0,1fr)] xl:gap-10">
          <div className="xl:sticky xl:top-6 xl:self-start">
            <label className="mb-5 flex flex-col gap-1.5">
              <span className="text-[0.8125rem] font-medium">What are you already planning to eat?</span>
              <input
                type="text"
                list="complete-my-meal-recipes"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                placeholder="Type or pick a dish"
                className="rounded-[6px] border border-hairline bg-surface px-3 py-2.5 text-[0.9375rem] outline-none focus:border-turmeric"
              />
              <datalist id="complete-my-meal-recipes">
                {recipes.map((r) => (
                  <option key={r.id} value={r.name} />
                ))}
              </datalist>
            </label>

            {!selectedRecipe ? (
              <p className="text-[0.875rem] text-ink-soft">
                Pick a dish from the list to see what&rsquo;s missing.
              </p>
            ) : (
              <>
                <Card className="mb-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle>{selectedRecipe.name}</CardTitle>
                      <p className="text-[0.8125rem] text-ink-soft">{selectedRecipe.cuisine}</p>
                    </div>
                    <ModeTag mode={selectedRecipe.dietMode} />
                  </div>
                </Card>

                <div className="mb-5">
                  <p className="mb-2 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
                    Missing fulfilment dimensions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {missingDimensions(selectedRecipe).map((d) => (
                      <ModeTag key={d.key} mode="neutral" label={d.label} />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div>
            {selectedRecipe ? (
              <div className="mb-6">
                <p className="mb-2 text-[0.8125rem] font-medium">Suggested additions</p>
                <div className="flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-3">
                  {suggestions.map((s, i) => {
                    const added = addedIds.has(s.id);
                    return (
                      <Card key={s.id} className="md:flex md:flex-col md:justify-between">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[0.875rem] font-medium">{s.name}</p>
                            <p className="text-[0.75rem] text-ink-soft">
                              {s.cuisine} · {s.protein} protein
                            </p>
                          </div>
                          <ModeTag mode={s.dietMode} />
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button
                            variant="secondary"
                            className="flex-1 px-3 py-2 text-[0.8125rem]"
                            onClick={() => toggleAdded(s.id)}
                          >
                            {added ? "Added ✓" : "Add suggestion"}
                          </Button>
                          <Button
                            variant="secondary"
                            className="flex-1 px-3 py-2 text-[0.8125rem]"
                            onClick={() => swapSuggestion(i)}
                          >
                            Swap suggestion
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                  {suggestions.length === 0 ? (
                    <p className="text-[0.8125rem] text-ink-soft md:col-span-full">No suggested additions available.</p>
                    ) : null}
                  </div>
                </div>
            ) : null}

            <Button
              href={`/app/log?dish=${encodeURIComponent(
                [dishName.trim(), ...suggestions.filter((r) => addedIds.has(r.id)).map((r) => r.name)]
                  .filter(Boolean)
                  .join(" + "),
              )}`}
            >
              Log completed meal
            </Button>
          </div>
        </div>
      </Shell>
    </main>
  );
}
