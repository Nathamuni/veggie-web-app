"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ModeTag } from "@/components/ui/ModeTag";
import { Figure, DataUnavailable } from "@/components/ui/SourceLabel";
import { restaurants, dishes } from "@/lib/fixtures";
import { restaurantNotes } from "@/lib/fixtures/discovery-extra";

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

export default function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const restaurant = restaurants.find((r) => r.id === id);

  const [rateOpen, setRateOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [saved, setSaved] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  if (!restaurant) {
    return (
      <main className="flex-1 pb-8">
        <Shell>
          <Link href="/app/discover" className="mt-5 inline-block text-ink">
            ← Discover
          </Link>
          <PageTitle eyebrow="Not found">Restaurant not found</PageTitle>
          <p className="text-[0.875rem] text-ink-soft">
            We couldn&rsquo;t find that restaurant in this prototype&rsquo;s data. It may have
            been removed or the link is out of date.
          </p>
          <Button href="/app/discover" variant="secondary" className="mt-4">
            Back to Discover
          </Button>
        </Shell>
      </main>
    );
  }

  const restaurantDishes = dishes.filter((d) => d.restaurantId === restaurant.id);
  const veggieAvg =
    restaurantDishes.length > 0
      ? Math.round(
          (restaurantDishes.reduce((sum, d) => sum + d.veggieRating, 0) /
            restaurantDishes.length) *
            10
        ) / 10
      : null;
  const veggieCount = restaurantDishes.reduce((sum, d) => sum + d.veggieRatingCount, 0);
  const comboPair = [...restaurantDishes]
    .sort((a, b) => b.veggieRating - a.veggieRating)
    .slice(0, 2);

  const notes = restaurantNotes[restaurant.id] ?? {
    preparation: ["Preparation details not yet declared by this restaurant."],
    reviews: [],
  };

  return (
    <main className="flex-1 pb-8">
      <Shell>
        <Link href="/app/discover" className="mt-5 inline-block text-ink">
          ← Discover
        </Link>
        <PageTitle eyebrow={restaurant.area}>{restaurant.name}</PageTitle>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <ModeTag
            mode="neutral"
            label={restaurant.dietSuitability === "pure_veg" ? "Pure veg" : "Veg friendly"}
          />
          <span className="text-[0.8125rem] text-ink-soft">{restaurant.cuisines.join(", ")}</span>
        </div>

        {/* xl: summary (top right) + sticky actions (below it) beside the main column. */}
        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_340px] xl:grid-rows-[auto_1fr] xl:gap-x-10">
        <div className="xl:col-start-2 xl:row-start-1">
        <div className="mb-2 grid grid-cols-2 gap-3">
          <Card>
            <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
              External rating
            </p>
            <Figure
              value={`${restaurant.externalRating}★`}
              source={`${restaurant.externalRatingCount.toLocaleString()} · ${restaurant.externalSource}`}
            />
          </Card>
          <Card>
            <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
              Veggie Rating
            </p>
            {veggieAvg !== null ? (
              <Figure
                value={`${veggieAvg}★`}
                source={`avg of ${restaurantDishes.length} dishes · ${veggieCount} ratings`}
              />
            ) : (
              <DataUnavailable />
            )}
          </Card>
        </div>
        <p className="mb-4 text-[0.75rem] text-ink-soft">
          Veggie Rating is computed from this restaurant&rsquo;s dish ratings — shown separately
          from the external rating above, never blended into it.
        </p>
        </div>

        <div className="min-w-0 xl:col-start-1 xl:row-span-2 xl:row-start-1">
        <div className="mb-4">
          <CardTitle>Preparation</CardTitle>
          <Card>
            <ul className="flex flex-col gap-1.5">
              {notes.preparation.map((p) => (
                <li key={p} className="text-[0.8125rem] text-ink-soft">
                  {p}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="mb-4">
          <CardTitle>Dishes</CardTitle>
          {restaurantDishes.length === 0 ? (
            <Card>
              <p className="text-[0.8125rem] text-ink-soft">No dishes listed yet.</p>
            </Card>
          ) : (
            <div className="flex flex-col gap-2 md:grid md:grid-cols-2">
              {restaurantDishes.map((d) => (
                <Link key={d.id} href={`/app/dishes/${d.id}`} className="block">
                  <Card className="transition-colors hover:border-ink-soft md:h-full">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[0.9375rem] font-medium">{d.name}</p>
                        <p className="mt-1 font-mono text-[0.8125rem] text-ink-soft">
                          ★ {d.veggieRating} ({d.veggieRatingCount})
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <ModeTag mode={d.dietMode} />
                        <Figure value={`₹${d.price}`} />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {comboPair.length === 2 ? (
          <div className="mb-4">
            <CardTitle>Recommended combo</CardTitle>
            <Card>
              <p className="text-[0.8125rem] text-ink-soft">
                {comboPair[0].name} + {comboPair[1].name} — a popular pairing at this table.
              </p>
            </Card>
          </div>
        ) : null}

        {notes.reviews.length > 0 ? (
          <div className="mb-4">
            <CardTitle>What people say</CardTitle>
            <Card>
              <ul className="flex flex-col gap-2">
                {notes.reviews.map((r) => (
                  <li key={r} className="text-[0.8125rem] text-ink-soft">
                    &ldquo;{r}&rdquo;
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        ) : null}
        </div>

        <div className="xl:sticky xl:top-6 xl:col-start-2 xl:row-start-2 xl:self-start">
        <div className="mb-3 flex flex-col gap-2">
          <Button variant="secondary" className="w-full" disabled>
            Directions
          </Button>
          <Button variant="secondary" className="w-full" disabled>
            Call / website
          </Button>
          <p className="text-[0.75rem] text-ink-soft">
            Directions and contact details come from the live place listing, which is off in this
            prototype. This sample restaurant has none.
          </p>
        </div>

        <div className="mb-3 flex gap-2">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setRateOpen((v) => !v)}
          >
            Rate
          </Button>
          <button
            type="button"
            onClick={() => setSaved((v) => !v)}
            aria-pressed={saved}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-[4px] border px-5 py-3 text-[0.9375rem] font-semibold ${
              saved ? "border-ink bg-ink text-surface" : "border-hairline bg-surface text-ink"
            }`}
          >
            {saved ? "Saved ✓" : "Save"}
          </button>
        </div>

        {rateOpen ? (
          <Card className="mb-3">
            <p className="mb-2 text-[0.8125rem] font-medium">Rate {restaurant.name}</p>
            <Stars value={rating} onChange={setRating} />
            <p className="mt-2 text-[0.75rem] text-ink-soft">
              {rating > 0
                ? `You rated this ${rating} star${rating === 1 ? "" : "s"} (not saved — prototype only).`
                : "Tap a star to rate."}
            </p>
          </Card>
        ) : null}

        <Button
          variant="secondary"
          className="w-full"
          aria-expanded={reportOpen}
          onClick={() => setReportOpen((v) => !v)}
        >
          Report correction
        </Button>
        {reportOpen ? (
          <Card className="mt-3">
            {reportSent ? (
              <p role="status" className="text-[0.8125rem]">
                Thanks. A moderator reviews every correction before anything changes (prototype —
                not sent).
              </p>
            ) : (
              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setReportSent(true);
                }}
              >
                <label className="flex flex-col gap-1.5">
                  <span className="text-[0.8125rem] font-medium">What&apos;s wrong?</span>
                  <select className="rounded-[6px] border border-hairline bg-surface px-3 py-2.5 text-[0.875rem]">
                    <option>A dish is not actually vegetarian</option>
                    <option>A dish is not actually vegan</option>
                    <option>Menu or price is out of date</option>
                    <option>Closed / moved</option>
                    <option>Something else</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[0.8125rem] font-medium">Details</span>
                  <textarea
                    required
                    rows={3}
                    className="rounded-[6px] border border-hairline bg-surface px-3 py-2.5 text-[0.875rem] outline-none focus:border-turmeric"
                  />
                </label>
                <Button type="submit">Send correction</Button>
              </form>
            )}
          </Card>
        ) : null}
        </div>
        </div>
      </Shell>
    </main>
  );
}
