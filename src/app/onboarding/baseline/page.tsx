"use client";

import { useState } from "react";
import { OnboardingStep } from "@/components/ui/OnboardingStep";
import { dietBaseline } from "@/lib/fixtures";

type Meals = typeof dietBaseline.mealsPerWeek;

const rows: { key: keyof Meals; label: string }[] = [
  { key: "redMeat", label: "Red meat" },
  { key: "chicken", label: "Chicken" },
  { key: "fish", label: "Fish" },
  { key: "eggs", label: "Eggs" },
  { key: "dairy", label: "Dairy" },
  { key: "vegetarian", label: "Vegetarian" },
  { key: "vegan", label: "Vegan" },
];

export default function BaselineStep() {
  const [meals, setMeals] = useState<Meals>({ ...dietBaseline.mealsPerWeek });
  const [confidence, setConfidence] = useState<"exact" | "approximate">(dietBaseline.confidence);
  const total = Object.values(meals).reduce((a, b) => a + b, 0);

  function adjust(key: keyof Meals, delta: number) {
    setMeals((prev) => ({ ...prev, [key]: Math.max(0, Math.min(21, prev[key] + delta)) }));
  }

  return (
    <OnboardingStep
      step={2}
      total={7}
      back="/onboarding/goal"
      title="In a normal week, how many meals include…"
      continueHref="/onboarding/diet"
    >
      <div className="flex flex-col gap-3">
        {rows.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-[0.9375rem]">{label}</span>
            <div className="flex items-center gap-3 font-mono text-[0.9375rem]">
              <button
                type="button"
                onClick={() => adjust(key, -1)}
                aria-label={`Decrease ${label}`}
                className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-hairline text-ink-soft hover:border-ink hover:text-ink"
              >
                −
              </button>
              <span className="w-5 text-center font-medium text-ink">{meals[key]}</span>
              <button
                type="button"
                onClick={() => adjust(key, 1)}
                aria-label={`Increase ${label}`}
                className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-hairline text-ink-soft hover:border-ink hover:text-ink"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[0.8125rem] text-ink-soft">
          ⓘ Not sure? Use rough numbers — we mark them approximate.
        </p>
        <span className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
          {confidence}
        </span>
      </div>
      <button
        type="button"
        onClick={() => setConfidence((c) => (c === "exact" ? "approximate" : "exact"))}
        className="self-start rounded-full border border-hairline bg-surface px-3 py-1.5 text-[0.75rem] text-ink-soft hover:border-ink hover:text-ink"
      >
        {confidence === "exact" ? "Use approximate values" : "Mark as exact"}
      </button>

      {total > 25 ? (
        <p className="rounded-[6px] bg-rust-tint px-3 py-2 text-[0.8125rem] text-rust">
          ⚠ {total} meals/week looks high — check?
        </p>
      ) : null}
    </OnboardingStep>
  );
}
