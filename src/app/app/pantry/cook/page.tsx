"use client";

import { useState } from "react";
import Link from "next/link";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ModeTag } from "@/components/ui/ModeTag";
import { EmptyState } from "@/components/ui/EmptyState";
import { recipes, user, type DietMode, type Recipe } from "@/lib/fixtures";
import { pantryItems } from "@/lib/fixtures/pantry";

/** Vegan and vegetarian are separate modes: a vegan user only ever sees vegan
 *  recipes; a vegetarian user sees vegetarian and vegan ones. */
function allowedFor(mode: DietMode, recipe: Recipe): boolean {
  return mode === "vegan" ? recipe.dietMode === "vegan" : true;
}

/** Loose, case-insensitive, word-level substring overlap between a recipe
 *  ingredient line and a pantry item name. */
function ingredientOverlapsPantry(ingredient: string, pantryName: string): boolean {
  const ing = ingredient.toLowerCase();
  const words = pantryName
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length >= 3);
  return words.some((w) => ing.includes(w));
}

type CookMatch = { recipe: Recipe; have: number; total: number; missing: string[] };

const pantryNames = pantryItems.map((p) => p.name);

const matches: CookMatch[] = recipes
  .filter((r) => allowedFor(user.dietMode, r))
  .map((recipe) => {
    const missing = recipe.ingredients.filter(
      (ing) => !pantryNames.some((name) => ingredientOverlapsPantry(ing, name))
    );
    return {
      recipe,
      have: recipe.ingredients.length - missing.length,
      total: recipe.ingredients.length,
      missing,
    };
  })
  .filter((m) => m.have > 0)
  .sort((a, b) => b.have - a.have || b.have / b.total - a.have / a.total);

export default function WhatCanICookPage() {
  const [added, setAdded] = useState<Record<string, number>>({});

  return (
    <main className="flex-1 pb-8">
      <Shell>
        <Link href="/app/pantry" className="mt-5 inline-block text-ink">
          ← Pantry
        </Link>
        <PageTitle eyebrow="UC-04">What can I cook?</PageTitle>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <ModeTag mode={user.dietMode} />
          <span className="text-[0.8125rem] text-ink-soft">
            Ranked by how many ingredients your pantry already covers.
          </span>
        </div>

        {matches.length === 0 ? (
          <EmptyState
            title="No matches yet"
            reason={`None of the ${user.dietMode} recipes use what's in your pantry. Add a few staples to see suggestions.`}
            actionHref="/app/pantry"
            actionLabel="Update pantry"
          />
        ) : (
          <>
            <p className="mb-2 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
              {matches.length} recipe{matches.length === 1 ? "" : "s"}
            </p>
            <ul className="flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-3 2xl:grid-cols-3">
              {matches.map(({ recipe, have, total, missing }) => {
                const addedCount = added[recipe.id];
                return (
                  <li key={recipe.id}>
                    <Card className="md:h-full">
                      <div className="mb-1.5 flex items-start justify-between gap-3">
                        <CardTitle>{recipe.name}</CardTitle>
                        <ModeTag mode={recipe.dietMode} />
                      </div>
                      <p className="mb-1 font-mono text-[0.75rem] text-ink">
                        Have {have} of {total}
                      </p>
                      {missing.length > 0 ? (
                        <p className="text-[0.8125rem] text-ink-soft">
                          Missing:{" "}
                          {missing.map((m, i) => (
                            <span key={m}>
                              <span className="font-medium text-ink">{m}</span>
                              {i < missing.length - 1 ? "; " : ""}
                            </span>
                          ))}
                        </p>
                      ) : (
                        <p className="text-[0.8125rem] text-ink-soft">
                          You have everything on the list.
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button variant="secondary" href={`/app/recipes/${recipe.id}`}>
                          Open recipe
                        </Button>
                        {missing.length > 0 ? (
                          <Button
                            variant="secondary"
                            onClick={() =>
                              setAdded((prev) => ({ ...prev, [recipe.id]: missing.length }))
                            }
                          >
                            {addedCount !== undefined ? "Added ✓" : "Add missing to shopping list"}
                          </Button>
                        ) : null}
                      </div>
                      <p role="status" className="text-[0.8125rem] text-ink-soft">
                        {addedCount !== undefined ? (
                          <span className="mt-2 inline-block">
                            {addedCount} item{addedCount === 1 ? "" : "s"} added.{" "}
                            <Link
                              href="/app/shopping-list"
                              className="text-ink underline underline-offset-4"
                            >
                              View shopping list
                            </Link>
                          </span>
                        ) : null}
                      </p>
                    </Card>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Shell>
    </main>
  );
}
