"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ModeTag } from "@/components/ui/ModeTag";
import { Figure, DataUnavailable, SourceLabel } from "@/components/ui/SourceLabel";
import { dishes, restaurants, recipes, type Dish } from "@/lib/fixtures";
import { dishIngredients } from "@/lib/fixtures/discovery-extra";

const sourceCopy: Record<Dish["sourceLabel"], string> = {
  "veggie-verified": "Checked against the restaurant's own menu by the Veggie team.",
  "restaurant-declared": "Reported directly by the restaurant, not independently checked.",
  "user-reported": "Reported by another diner, not independently checked.",
};

function Stars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1 font-mono text-[1.125rem] text-ink">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          aria-label={`${i} star${i === 1 ? "" : "s"}`}
          onClick={() => onChange(i)}
        >
          {i <= value ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}

export default function DishDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const dish = dishes.find((d) => d.id === id);

  const [rating, setRating] = useState(0);

  if (!dish) {
    return (
      <main className="flex-1 pb-8">
        <Shell>
          <Link href="/app/discover" className="mt-5 inline-block text-ink">
            ← Discover
          </Link>
          <PageTitle eyebrow="Not found">Dish not found</PageTitle>
          <p className="text-[0.875rem] text-ink-soft">
            We couldn&rsquo;t find that dish in this prototype&rsquo;s data. It may have been
            removed or the link is out of date.
          </p>
          <Button href="/app/discover" variant="secondary" className="mt-4">
            Back to Discover
          </Button>
        </Shell>
      </main>
    );
  }

  const restaurant = restaurants.find((r) => r.id === dish.restaurantId);
  const ingredients = dishIngredients[dish.id] ?? [
    "Ingredients not yet listed for this dish.",
  ];

  const siblingDishes = dishes.filter(
    (d) => d.restaurantId === dish.restaurantId && d.id !== dish.id
  );
  const bestSibling = [...siblingDishes].sort((a, b) => b.veggieRating - a.veggieRating)[0];
  const cuisineRecipe = restaurant
    ? recipes.find((r) => r.cuisine === restaurant.cuisines[0])
    : undefined;
  const recommendedSideText = bestSibling
    ? `${bestSibling.name} pairs well alongside this at ${restaurant?.name ?? "this restaurant"}.`
    : cuisineRecipe
      ? `Try it with ${cuisineRecipe.name} from Recipes for a fuller ${cuisineRecipe.cuisine} meal.`
      : "No paired suggestion yet for this dish.";

  return (
    <main className="flex-1 pb-8">
      <Shell>
        <Link
          href={restaurant ? `/app/restaurants/${restaurant.id}` : "/app/discover"}
          className="mt-5 inline-block text-ink"
        >
          ← {restaurant ? restaurant.name : "Discover"}
        </Link>
        <PageTitle eyebrow={restaurant ? `${restaurant.name} · ${restaurant.area}` : "Dish"}>
          {dish.name}
        </PageTitle>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <ModeTag mode={dish.dietMode} />
          <span className="text-[0.8125rem] text-ink-soft">
            {restaurant ? restaurant.cuisines.join(", ") : "data unavailable"}
          </span>
        </div>

        {/* xl: price/rating summary (top right) + sticky actions (below it) beside the main column. */}
        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_340px] xl:grid-rows-[auto_1fr] xl:gap-x-10">
        <div className="xl:col-start-2 xl:row-start-1">
        <div className="mb-4 flex items-center justify-between xl:rounded-[6px] xl:border xl:border-hairline xl:bg-surface xl:p-4">
          <div>
            <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
              Price
            </p>
            <Figure value={`₹${dish.price}`} />
          </div>
          <div className="text-right">
            <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
              Veggie Rating
            </p>
            <Figure
              value={`${dish.veggieRating}★`}
              source={`${dish.veggieRatingCount} ratings`}
            />
            <div className="mt-1">
              <SourceLabel>{dish.sourceLabel}</SourceLabel>
            </div>
          </div>
        </div>
        <p className="mb-4 text-[0.75rem] text-ink-soft">{sourceCopy[dish.sourceLabel]}</p>
        </div>

        <div className="min-w-0 xl:col-start-1 xl:row-span-2 xl:row-start-1">

        <div className="mb-4">
          <CardTitle>Ingredients</CardTitle>
          <Card>
            <ul className="flex flex-col gap-1.5">
              {ingredients.map((ing) => (
                <li key={ing} className="text-[0.875rem]">
                  {ing}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="mb-4">
          <CardTitle>Nutrition</CardTitle>
          <Card className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[0.9375rem]">Calories</span>
              <div className="text-right">
                <DataUnavailable />
                <p className="font-mono text-[0.625rem] uppercase tracking-wide text-ink-soft">
                  no approved source yet
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[0.9375rem]">Protein</span>
              <div className="text-right">
                <DataUnavailable />
                <p className="font-mono text-[0.625rem] uppercase tracking-wide text-ink-soft">
                  no approved source yet
                </p>
              </div>
            </div>
          </Card>
          <p className="mt-2 max-w-prose text-[0.75rem] leading-relaxed text-ink-soft">
            ICMR-NIN regional food composition data is pending licensing — per-dish nutrition
            isn&rsquo;t available yet. This is wellness support, never a diagnosis.
          </p>
        </div>

        <div className="mb-4">
          <CardTitle>Recommended sides</CardTitle>
          <Card>
            <p className="text-[0.8125rem] text-ink-soft">{recommendedSideText}</p>
          </Card>
        </div>

        <div className="mb-4">
          <SourceLabel>{dish.sourceLabel}</SourceLabel>
        </div>
        </div>

        <div className="flex flex-col gap-2 xl:sticky xl:top-6 xl:col-start-2 xl:row-start-2 xl:self-start">
          <Button href={`/app/log?dish=${encodeURIComponent(dish.name)}`}>Log this meal</Button>

          <Card>
            <p className="mb-2 text-[0.8125rem] font-medium">Rate dish</p>
            <Stars value={rating} onChange={setRating} />
            <p className="mt-2 text-[0.75rem] text-ink-soft">
              {rating > 0
                ? `You rated this ${rating} star${rating === 1 ? "" : "s"} (not saved — prototype only).`
                : "Tap a star to rate."}
            </p>
          </Card>

          <Button href="/app/complete-meal" variant="secondary" className="w-full">
            Complete this meal — add sides
          </Button>
        </div>
        </div>
      </Shell>
    </main>
  );
}
