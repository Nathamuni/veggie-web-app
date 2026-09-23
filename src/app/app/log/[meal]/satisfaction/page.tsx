"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Button } from "@/components/ui/Button";
import { notFound } from "next/navigation";
import { mealLogs, resolveRouteMeal, mealQuery } from "@/lib/fixtures";

type RatingKey = "taste" | "fullness" | "texture" | "portion" | "cravingSatisfied";

const dims: { key: RatingKey; label: string }[] = [
  { key: "taste", label: "Taste" },
  { key: "fullness", label: "Fullness" },
  { key: "texture", label: "Texture" },
  { key: "portion", label: "Portion" },
  { key: "cravingSatisfied", label: "Craving satisfied" },
];

const example = mealLogs.find((m) => m.satisfaction)!.satisfaction!;

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

export default function SatisfactionPage({
  params,
  searchParams,
}: {
  params: Promise<{ meal: string }>;
  searchParams: Promise<{ name?: string; diet?: string; type?: string }>;
}) {
  const { meal: id } = use(params);
  const meal = resolveRouteMeal(id, use(searchParams));
  const [ratings, setRatings] = useState<Record<RatingKey, number>>({
    taste: example.taste,
    fullness: example.fullness,
    texture: example.texture,
    portion: example.portion,
    cravingSatisfied: example.cravingSatisfied,
  });
  const [wouldEatAgain, setWouldEatAgain] = useState(example.wouldEatAgain);
  const [submitted, setSubmitted] = useState(false);
  if (!meal) notFound();

  return (
    <main className="flex-1 pb-8">
      <Shell width="narrow">
        <Link href={`/app/log/${meal.id}${mealQuery(meal)}`} className="mt-5 inline-block text-ink">
          ← Back
        </Link>
        <PageTitle eyebrow="Rate this meal">{meal.name}</PageTitle>

        <div className="flex flex-col gap-5">
          {dims.map((d) => (
            <div key={d.key} className="flex items-center justify-between">
              <span className="text-[0.9375rem]">{d.label}</span>
              <Stars
                value={ratings[d.key]}
                onChange={(v) => setRatings((prev) => ({ ...prev, [d.key]: v }))}
              />
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-hairline pt-4">
            <span className="text-[0.9375rem]">Would eat again</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setWouldEatAgain(true)}
                className={`rounded-full border px-3 py-1 text-[0.8125rem] ${
                  wouldEatAgain ? "border-2 border-ink font-medium" : "border-hairline text-ink-soft"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setWouldEatAgain(false)}
                className={`rounded-full border px-3 py-1 text-[0.8125rem] ${
                  !wouldEatAgain ? "border-2 border-ink font-medium" : "border-hairline text-ink-soft"
                }`}
              >
                No
              </button>
            </div>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[0.8125rem] font-medium">What was missing? (optional)</span>
            <input
              type="text"
              placeholder="e.g. a bit more protein"
              className="rounded-[6px] border border-hairline bg-surface px-3 py-2.5 text-[0.875rem] outline-none focus:border-turmeric"
            />
          </label>
        </div>

        <div className="mt-8 flex gap-2">
          <Button href="/app" variant="secondary" className="flex-1">
            Skip
          </Button>
          <Button type="button" className="flex-1" onClick={() => setSubmitted(true)}>
            {submitted ? "Submitted ✓" : "Submit rating"}
          </Button>
        </div>
        {submitted ? (
          <p role="status" className="mt-4 text-[0.875rem] text-ink-soft">
            Thanks — this shapes your next suggestions.{" "}
            <Link href="/app" className="underline">
              Back to home
            </Link>
          </p>
        ) : null}
      </Shell>
    </main>
  );
}
