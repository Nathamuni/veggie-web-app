"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { rateMeal, type LogResult } from "@/app/actions/meals";

type Ok = Extract<NonNullable<LogResult>, { ok: true }>;

const FULLNESS = ["Still hungry", "A bit hungry", "Just right", "Full", "Very full"];

/**
 * After a log: show the week moving, then ask the two questions that teach
 * the recommendations (thumbs, fullness). Both are optional — skipping is fine.
 */
export function Celebration({ result, onDone, onAnother }: { result: Ok; onDone: () => void; onAnother?: () => void }) {
  const { progress, diet, name, swap } = result;
  const plant = diet !== "meat";
  const [liked, setLiked] = useState<"up" | "down" | null>(null);
  const [fullness, setFullness] = useState<number | null>(null);
  const [pending, start] = useTransition();

  function send(next: { liked?: "up" | "down"; fullness?: number }) {
    start(() => void rateMeal({ logId: result.logId, ...next }));
  }

  const headline = plant
    ? progress.hit
      ? progress.plantMeals === progress.target
        ? "Week's goal reached! 🎉"
        : "Beyond your goal 🌿"
      : `${progress.plantMeals} of ${progress.target} this week`
    : "Logged — no guilt.";

  return (
    <div className="motion-safe:animate-[pop-in_200ms_ease-out]">
      <div className="flex items-center gap-4">
        <ProgressRing
          value={progress.plantMeals}
          max={progress.target}
          label={`${progress.plantMeals} of ${progress.target} plant meals this week`}
        />
        <div className="min-w-0">
          <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">{name}</p>
          <p className="text-[1.375rem] font-semibold leading-tight">{headline}</p>
          <p className="mt-1 text-[0.875rem] text-ink-soft">
            {plant
              ? progress.hit
                ? "Every extra plant meal still counts."
                : `${progress.remaining} more plant ${progress.remaining === 1 ? "meal" : "meals"} to go this week.`
              : "One meat meal never resets your week. Your plant meals are still counted."}
          </p>
        </div>
      </div>

      {swap ? (
        <Link
          href={`/app/recipes/${swap.id}`}
          className="mt-5 block rounded-[6px] border border-hairline bg-paper px-4 py-3 transition-colors hover:border-ink-soft"
        >
          <span className="block font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">Next time, try</span>
          <span className="block text-[0.9375rem] font-medium underline underline-offset-4">{swap.name} →</span>
          {swap.why ? <span className="block text-[0.8125rem] text-ink-soft">{swap.why}</span> : null}
        </Link>
      ) : null}

      <div className="mt-6 flex flex-col gap-4 border-t border-hairline pt-5">
        <fieldset>
          <legend className="mb-2 text-[0.9375rem] font-semibold">Did you enjoy it?</legend>
          <div className="flex gap-2">
            {(["up", "down"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={liked === v}
                onClick={() => {
                  setLiked(v);
                  send({ liked: v });
                }}
                className={`flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[6px] border text-[0.9375rem] transition-colors ${
                  liked === v ? "border-ink bg-ink text-surface" : "border-hairline bg-surface hover:border-ink-soft"
                }`}
              >
                <span aria-hidden>{v === "up" ? "👍" : "👎"}</span> {v === "up" ? "Loved it" : "Not for me"}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-[0.9375rem] font-semibold">How full did it keep you?</legend>
          <div className="grid grid-cols-5 gap-1.5">
            {FULLNESS.map((label, i) => (
              <button
                key={label}
                type="button"
                aria-pressed={fullness === i + 1}
                onClick={() => {
                  setFullness(i + 1);
                  send({ fullness: i + 1 });
                }}
                className={`min-h-12 rounded-[6px] border px-1 text-[0.75rem] leading-tight transition-colors ${
                  fullness === i + 1 ? "border-ink bg-ink text-surface" : "border-hairline bg-surface hover:border-ink-soft"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <p className="text-[0.8125rem] text-ink-soft" aria-live="polite">
          {pending ? "Saving…" : liked || fullness ? "Thanks — your next suggestions will use this." : "Optional, but it makes your picks better."}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {onAnother ? (
          <Button type="button" variant="secondary" onClick={onAnother}>
            Log another
          </Button>
        ) : null}
        <Button type="button" onClick={onDone} className={onAnother ? "" : "col-span-2"}>
          Done
        </Button>
      </div>
    </div>
  );
}
