"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatQty } from "@/domain/food/scale";
import type { Ingredient, Step } from "@/domain/food/recipe";
import { QuickLogSheet } from "../RecipeClient";

type Recipe = { id: string; name: string; dietMode: "vegetarian" | "vegan" };

/** Keeps the phone screen on while cooking, where the browser supports it. */
function useWakeLock() {
  useEffect(() => {
    let lock: WakeLockSentinel | null = null;
    const request = () =>
      navigator.wakeLock
        ?.request("screen")
        .then((l) => (lock = l))
        .catch(() => {});
    request();
    const onVisible = () => document.visibilityState === "visible" && request();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      lock?.release().catch(() => {});
    };
  }, []);
}

function Timer({ minutes }: { minutes: number }) {
  const [left, setLeft] = useState<number | null>(null);
  const running = left !== null && left > 0;

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setLeft((s) => (s === null ? null : Math.max(0, s - 1))), 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (left === 0) navigator.vibrate?.([300, 150, 300]);
  }, [left]);

  const total = left ?? minutes * 60;
  const hh = Math.floor(total / 3600);
  const mm = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  const clock = hh > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
  const label = minutes >= 60 ? `${+(minutes / 60).toFixed(1)} hr` : `${minutes} min`;

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 rounded-[6px] border border-hairline bg-surface px-4 py-3">
      <span className={`font-mono text-[2rem] font-semibold ${left === 0 ? "text-curry-leaf" : ""}`} aria-live="polite">
        {left === 0 ? "Done!" : clock}
      </span>
      <span className="ml-auto flex gap-2">
        {running ? (
          <Button type="button" variant="secondary" onClick={() => setLeft(null)}>
            Reset
          </Button>
        ) : (
          <Button type="button" variant="secondary" onClick={() => setLeft(minutes * 60)}>
            ⏱ Start {label} timer
          </Button>
        )}
      </span>
    </div>
  );
}

export function CookMode({ recipe, steps, ingredients, servings }: { recipe: Recipe; steps: Step[]; ingredients: Ingredient[]; servings: number }) {
  useWakeLock();
  // Screen 0 is "gather ingredients"; 1..n are the steps; n+1 is "done".
  const [i, setI] = useState(0);
  const [logging, setLogging] = useState(false);
  const last = steps.length + 1;
  const step = i >= 1 && i <= steps.length ? steps[i - 1] : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setI((v) => Math.min(last, v + 1));
      if (e.key === "ArrowLeft") setI((v) => Math.max(0, v - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [last]);

  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-[640px] flex-1 flex-col px-4 md:px-8">
        <div className="flex min-h-14 items-center justify-between gap-3">
          <Link href={`/app/recipes/${recipe.id}`} className="-ml-2 inline-flex min-h-11 items-center px-2 text-[0.9375rem]">
            ✕ Exit
          </Link>
          <span className="truncate font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">{recipe.name}</span>
        </div>
        <div className="flex gap-1" aria-hidden>
          {Array.from({ length: last + 1 }).map((_, k) => (
            <span key={k} className={`h-1 flex-1 rounded-full ${k <= i ? "bg-turmeric" : "bg-hairline"}`} />
          ))}
        </div>

        <section className="flex flex-1 flex-col justify-center py-8" aria-live="polite">
          {i === 0 ? (
            <>
              <p className="font-mono text-[0.75rem] uppercase tracking-wide text-ink-soft">Before you start · {servings} servings</p>
              <h1 className="mt-2 text-[1.75rem] font-semibold leading-tight">Gather everything</h1>
              <ul className="mt-4 columns-1 gap-6 text-[1rem] leading-relaxed sm:columns-2">
                {ingredients.map((ing, k) => (
                  <li key={k} className="break-inside-avoid py-0.5">
                    <span className="font-mono text-[0.875rem] text-ink-soft">
                      {ing.qty === null ? "" : `${formatQty(ing.qty)} ${ing.unit === "piece" ? "" : ing.unit} `}
                    </span>
                    {ing.item}
                  </li>
                ))}
              </ul>
            </>
          ) : step ? (
            <>
              <p className="font-mono text-[0.75rem] uppercase tracking-wide text-ink-soft">
                Step {i} of {steps.length}
              </p>
              <p className="mt-3 text-[clamp(1.375rem,4.5vw,1.875rem)] font-medium leading-snug">{step.text}</p>
              {step.timerMin ? <Timer key={i} minutes={step.timerMin} /> : null}
            </>
          ) : (
            <div className="text-center">
              <p className="text-[3rem]" aria-hidden>
                🍽️
              </p>
              <h1 className="mt-2 text-[1.75rem] font-semibold">Ready to eat!</h1>
              <p className="mt-2 text-[0.9375rem] text-ink-soft">Log it so it counts toward your week.</p>
              <Button type="button" className="mt-6 w-full" onClick={() => setLogging(true)}>
                I cooked this — log it
              </Button>
            </div>
          )}
        </section>

        <div className="sticky bottom-20 grid grid-cols-2 gap-2 border-t border-hairline bg-paper py-3 lg:bottom-0">
          <Button type="button" variant="secondary" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0}>
            ← Back
          </Button>
          <Button type="button" onClick={() => setI((v) => Math.min(last, v + 1))} disabled={i === last}>
            {i === 0 ? "Start step 1" : i === steps.length ? "Finish" : "Next step →"}
          </Button>
        </div>
      </div>
      {logging ? <QuickLogSheet recipe={recipe} onClose={() => setLogging(false)} /> : null}
    </main>
  );
}
