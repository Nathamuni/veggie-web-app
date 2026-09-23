"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ModeTag } from "@/components/ui/ModeTag";
import { Figure, DataUnavailable } from "@/components/ui/SourceLabel";
import { recipes, type Recipe } from "@/lib/fixtures";
import { combos } from "@/lib/fixtures/combos";

const SUBSTITUTION_RULES: { keyword: string; swap: string }[] = [
  { keyword: "coconut", swap: "No coconut on hand? Use cashew paste instead." },
  { keyword: "paneer", swap: "Out of paneer? Firm tofu, pressed and crumbled, works in its place." },
  { keyword: "soya", swap: "No soya chunks? Boiled black chana holds a similar bite." },
  { keyword: "tamarind", swap: "Out of tamarind? A squeeze of lemon at the end gives a similar tang." },
  { keyword: "ghee", swap: "Skipping ghee? Cold-pressed coconut oil keeps it vegan without losing richness." },
  { keyword: "curry leaves", swap: "No curry leaves? Extra coriander leaves gets you close." },
  { keyword: "mushroom", swap: "No mushrooms? Firm tofu subs in with a similar bite." },
  { keyword: "millet", swap: "No millet? Any short-grain rice works instead." },
  { keyword: "rice", swap: "Short on rice? Any millet cooks up as a swap." },
  { keyword: "chickpea", swap: "Out of chickpeas? Any similar-sized dried legume works after soaking." },
  { keyword: "rajma", swap: "No rajma? Chana or black-eyed peas step in." },
  { keyword: "dal", swap: "Short on this dal? A different dal from the pantry works after adjusting cook time." },
];

function substitutionsFor(recipe: Recipe): string[] {
  const text = recipe.ingredients.join(" ").toLowerCase();
  const matched = Array.from(
    new Set(SUBSTITUTION_RULES.filter((rule) => text.includes(rule.keyword)).map((rule) => rule.swap))
  ).slice(0, 3);
  if (matched.length >= 2) return matched;
  const fallback = [
    "Missing a spice from the list? A milder or hotter version you already have works in its place.",
    "Short on one vegetable? Any vegetable of similar texture in the fridge substitutes fine.",
  ];
  return Array.from(new Set([...matched, ...fallback])).slice(0, 3);
}

function comboFor(recipe: Recipe) {
  return (
    combos.find((c) => c.cuisine === recipe.cuisine) ??
    combos.find((c) => c.dietMode === recipe.dietMode) ??
    combos[0]
  );
}

export default function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const recipe = recipes.find((r) => r.id === id);

  const [rating, setRating] = useState(0);

  if (!recipe) {
    return (
      <main className="flex-1 pb-8">
        <Shell>
          <Link href="/app/recipes" className="mt-5 inline-block text-ink">
            ← Recipes
          </Link>
          <PageTitle eyebrow="Not found">Recipe not found</PageTitle>
          <p className="text-[0.875rem] text-ink-soft">
            This recipe doesn&rsquo;t exist in the current data set.
          </p>
          <Button href="/app/recipes" className="mt-4">
            Back to recipes
          </Button>
        </Shell>
      </main>
    );
  }

  const combo = comboFor(recipe);
  const substitutions = substitutionsFor(recipe);

  return (
    <main className="flex-1 pb-8">
      <Shell>
        <Link href="/app/recipes" className="mt-5 inline-block text-ink">
          ← Recipes
        </Link>
        <PageTitle eyebrow={recipe.cuisine}>{recipe.name}</PageTitle>

        <div className="mb-5 flex flex-wrap items-center gap-2">
          <ModeTag mode={recipe.dietMode} />
          <span className="text-[0.8125rem] text-ink-soft">
            {recipe.timeMinutes} min · {recipe.protein} protein · {recipe.spice} spice
          </span>
        </div>

        {/*
          Phone/tablet: one column in the original reading order (the wrappers are
          display:contents and `order-*` restores the sequence). Desktop: recipe body
          in the main column, summary + actions in a sticky aside.
        */}
        <div className="flex flex-col xl:grid xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
          <div className="contents xl:block">
            <Card className="order-1 mb-4">
              <CardTitle>Ingredients</CardTitle>
              <ul className="list-disc space-y-1 pl-5 text-[0.875rem] text-ink">
                {recipe.ingredients.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </Card>

            <Card className="order-2 mb-4">
              <CardTitle>Steps</CardTitle>
              <ol className="list-decimal space-y-1.5 pl-5 text-[0.875rem] text-ink">
                {recipe.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </Card>

            <div className="order-4 mb-5">
              <p className="mb-1.5 text-[0.8125rem] font-medium">Substitutions</p>
              <ul className="list-disc space-y-1 pl-5 text-[0.8125rem] text-ink-soft">
                {substitutions.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="contents xl:sticky xl:top-6 xl:block xl:self-start">
            <div className="order-3 mb-4 grid grid-cols-2 gap-3">
              <Card>
                <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">Nutrition</p>
                <DataUnavailable />
              </Card>
              <Card>
                <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">Cost</p>
                <Figure value={recipe.costBand} source="cost band" />
              </Card>
              <Card>
                <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">Fullness</p>
                <Figure value={`${recipe.fullness}/5`} source="fullness score" />
              </Card>
              <Card>
                <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">Satisfaction</p>
                <Figure value={`${recipe.satisfactionAvg.toFixed(1)}/5`} source={`${recipe.satisfactionCount} ratings`} />
              </Card>
            </div>

            <Link href={`/app/combos/${combo.id}`} className="order-5 mb-6 block">
              <Card className="transition-colors hover:border-ink-soft">
                <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
                  Recommended complete combo
                </p>
                <p className="text-[0.9375rem] font-medium text-ink underline underline-offset-4">{combo.name} →</p>
                <p className="text-[0.8125rem] text-ink-soft">
                  {combo.cuisine} · {combo.category}
                </p>
              </Card>
            </Link>

            <div className="order-6 mb-5">
              <p className="mb-1.5 text-[0.8125rem] font-medium">Rate after eating</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
                    onClick={() => setRating(n)}
                    className={`text-2xl leading-none ${n <= rating ? "text-turmeric" : "text-hairline"}`}
                  >
                    ★
                  </button>
                ))}
                {rating > 0 ? (
                  <span className="ml-2 font-mono text-[0.75rem] text-ink-soft">{rating}/5</span>
                ) : null}
              </div>
            </div>

            <div className="order-7 flex flex-col gap-2">
              <Button href={`/app/log?dish=${encodeURIComponent(recipe.name)}`}>Cook / log this</Button>
              <Button variant="secondary" href="/app/shopping-list">
                Add ingredients
              </Button>
              <Button variant="secondary" href="/app/meal-plan">
                Add to meal plan
              </Button>
            </div>
          </aside>
        </div>
      </Shell>
    </main>
  );
}
