"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ModeTag } from "@/components/ui/ModeTag";
import { resolveRouteMeal, mealQuery, recipes, user } from "@/lib/fixtures";

// TR-03: why a meat meal happened. Every option is optional; nothing here is scored.
const reasons = [
  { id: "craving", label: "I was craving it", next: "Find a swap for that craving", href: "/app/transition/craving" },
  { id: "social", label: "Eating with family or friends", next: "Best vegetarian picks at mixed places", href: "/app/discover" },
  { id: "convenience", label: "It was the easiest option", next: "Quick meals under 20 minutes", href: "/app/recipes" },
  { id: "cost", label: "Cost", next: "Plan a week to your budget", href: "/app/meal-plan" },
  { id: "no-options", label: "No vegetarian option available", next: "Places near you with verified options", href: "/app/discover" },
  { id: "fullness", label: "Veg meals don't keep me full", next: "Make a meal more filling", href: "/app/complete-meal" },
] as const;

export default function BarrierPage({
  params,
  searchParams,
}: {
  params: Promise<{ meal: string }>;
  searchParams: Promise<{ name?: string; diet?: string; type?: string }>;
}) {
  const { meal: id } = use(params);
  const meal = resolveRouteMeal(id, use(searchParams));
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [other, setOther] = useState("");
  const [done, setDone] = useState(false);
  if (!meal) notFound();

  const chosen = reasons.filter((r) => picked.has(r.id));
  // Hard diet filter first: a vegan user is never offered a vegetarian-only recipe.
  const quick = recipes.find(
    (r) => (user.dietMode === "vegetarian" || r.dietMode === "vegan") && r.timeMinutes <= 30,
  );

  if (done) {
    return (
      <main className="flex-1 pb-8">
        <Shell width="narrow">
          <PageTitle eyebrow="Thanks">Noted — nothing reset</PageTitle>
          <p className="text-[0.9375rem]">
            Your lifetime progress is exactly where it was. We&apos;ll use this to pick better
            suggestions for situations like this one.
          </p>
          {chosen.length > 0 ? (
            <div className="mt-6">
              <p className="mb-2 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
                For next time
              </p>
              <div className="flex flex-col gap-2">
                {chosen.map((r) => (
                  <Link key={r.id} href={r.href} className="block">
                    <Card className="flex items-center justify-between">
                      <span className="text-[0.9375rem]">{r.next}</span>
                      <span aria-hidden className="text-ink-soft">→</span>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
          {quick ? (
            <p className="mt-6 text-[0.8125rem] text-ink-soft">
              Next meal idea:{" "}
              <Link href={`/app/recipes/${quick.id}`} className="underline">
                {quick.name}
              </Link>
            </p>
          ) : null}
          <Button href="/app" className="mt-6 w-full">
            Back to home
          </Button>
        </Shell>
      </main>
    );
  }

  return (
    <main className="flex-1 pb-8">
      <Shell width="narrow">
        <Link href={`/app/log/${meal.id}${mealQuery(meal)}`} className="mt-5 inline-block text-ink">
          ← Back
        </Link>
        <PageTitle eyebrow="Optional">Why did this one happen?</PageTitle>
        <div className="mb-4 flex items-center gap-2 text-[0.8125rem] text-ink-soft">
          {meal.name} <ModeTag mode="warning" label="Meat" />
        </div>
        <p className="mb-4 text-[0.875rem] text-ink-soft">Pick any that apply. No wrong answers.</p>

        <fieldset className="flex flex-col gap-2">
          <legend className="sr-only">Reasons</legend>
          {reasons.map((r) => {
            const on = picked.has(r.id);
            return (
              <label
                key={r.id}
                className={`flex cursor-pointer items-center gap-3 rounded-[6px] border px-3 py-3 text-[0.9375rem] ${
                  on ? "border-2 border-ink" : "border-hairline bg-surface"
                }`}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() =>
                    setPicked((prev) => {
                      const next = new Set(prev);
                      if (next.has(r.id)) next.delete(r.id);
                      else next.add(r.id);
                      return next;
                    })
                  }
                  className="accent-turmeric"
                />
                {r.label}
              </label>
            );
          })}
          <label className="mt-2 flex flex-col gap-1.5">
            <span className="text-[0.8125rem] font-medium">Something else (optional)</span>
            <input
              type="text"
              value={other}
              onChange={(e) => setOther(e.target.value)}
              className="rounded-[6px] border border-hairline bg-surface px-3 py-2.5 text-[0.875rem] outline-none focus:border-turmeric"
            />
          </label>
        </fieldset>

        <div className="mt-6 flex gap-2">
          <Button href="/app" variant="secondary" className="flex-1">
            Skip
          </Button>
          <Button type="button" className="flex-1" onClick={() => setDone(true)}>
            Save
          </Button>
        </div>
      </Shell>
    </main>
  );
}
