"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ModeTag } from "@/components/ui/ModeTag";

export type PickView = {
  id: string;
  name: string;
  dietMode: "vegetarian" | "vegan";
  meta: string[];
  reasons: string[];
};

/** The single best next action, with its reasons; "Show another" walks the ranked shortlist. */
export function TodayPick({ picks, slotLabel }: { picks: PickView[]; slotLabel: string }) {
  const [index, setIndex] = useState(0);
  const pick = picks[index];

  return (
    <section aria-labelledby="pick-name" className="rounded-[6px] border border-hairline bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-2.5 md:px-6">
        <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
          {slotLabel} pick · {index + 1} of {picks.length}
        </p>
        <ModeTag mode={pick.dietMode} />
      </div>

      <div className="px-4 pb-5 pt-4 md:px-6 md:pb-6">
        <h2 id="pick-name" aria-live="polite" className="text-[1.5rem] font-semibold leading-tight md:text-[1.75rem]">
          {pick.name}
        </h2>
        <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
          {pick.meta.join(" · ")}
        </p>

        <p className="mt-5 text-[0.8125rem] font-medium">Why this, for you</p>
        <ul className="mt-1.5 divide-y divide-hairline border-y border-hairline">
          {pick.reasons.map((r) => (
            <li key={r} className="flex gap-2.5 py-2 text-[0.875rem]">
              <span aria-hidden className="font-mono text-curry-leaf">✓</span>
              {r}
            </li>
          ))}
        </ul>

        <div className="mt-5 grid grid-cols-2 gap-2 md:flex md:flex-wrap">
          <Button href={`/app/recipes/${pick.id}`} className="md:min-w-[160px]">
            Cook this
          </Button>
          <Button href="/app/discover" variant="secondary" className="md:min-w-[160px]">
            Find it nearby
          </Button>
          {picks.length > 1 ? (
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % picks.length)}
              className="col-span-2 min-h-11 text-[0.875rem] text-ink underline underline-offset-4 md:col-span-1 md:px-3"
            >
              Show another
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
