"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { Celebration } from "@/components/meal/Celebration";
import { logMeal, toggleSaved } from "@/app/actions/meals";
import { formatQty, scaleQty } from "@/domain/food/scale";
import { mealSlotForHour } from "@/domain/recommendation/today";
import type { Ingredient } from "@/domain/food/recipe";

export function IngredientList({ ingredients, baseServings }: { ingredients: Ingredient[]; baseServings: number }) {
  const [servings, setServings] = useState(baseServings);
  const [have, setHave] = useState<Set<number>>(new Set());

  const btn =
    "flex h-10 w-10 items-center justify-center rounded-[6px] border border-hairline bg-surface text-[1.125rem] hover:border-ink-soft disabled:opacity-30";

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id="ingredients-title" className="text-[1.125rem] font-semibold">
          Ingredients
        </h2>
        <div className="flex items-center gap-2" role="group" aria-label="Servings">
          <button type="button" className={btn} onClick={() => setServings((s) => Math.max(1, s - 1))} disabled={servings <= 1} aria-label="Fewer servings">
            −
          </button>
          <span className="min-w-[5.5rem] text-center text-[0.875rem]" aria-live="polite">
            <span className="font-mono font-semibold">{servings}</span> {servings === 1 ? "serving" : "servings"}
          </span>
          <button type="button" className={btn} onClick={() => setServings((s) => Math.min(12, s + 1))} disabled={servings >= 12} aria-label="More servings">
            +
          </button>
        </div>
      </div>
      <ul className="divide-y divide-hairline rounded-[6px] border border-hairline bg-surface">
        {ingredients.map((ing, i) => {
          const checked = have.has(i);
          const amount =
            ing.qty === null ? "to taste" : `${formatQty(scaleQty(ing.qty, baseServings, servings))} ${ing.unit === "piece" ? "" : ing.unit}`.trim();
          return (
            <li key={i}>
              <label className="flex min-h-12 cursor-pointer items-start gap-3 px-4 py-2.5">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    setHave((prev) => {
                      const next = new Set(prev);
                      if (next.has(i)) next.delete(i);
                      else next.add(i);
                      return next;
                    })
                  }
                  className="mt-1 h-4 w-4 shrink-0 accent-curry-leaf"
                />
                <span className={`min-w-0 flex-1 text-[0.9375rem] ${checked ? "text-ink-soft line-through" : ""}`}>
                  <span className="block first-letter:uppercase">{ing.item}</span>
                  {ing.note ? <span className="block text-[0.8125rem] text-ink-soft">{ing.note}</span> : null}
                </span>
                <span className="shrink-0 whitespace-nowrap font-mono text-[0.8125rem] text-ink">{amount}</span>
              </label>
            </li>
          );
        })}
      </ul>
      <p className="mt-1.5 text-[0.8125rem] text-ink-soft" aria-live="polite">
        {have.size === 0
          ? "Tick things off as you gather them."
          : have.size === ingredients.length
            ? "All set — start cooking!"
            : `${have.size} of ${ingredients.length} ready`}
      </p>
    </>
  );
}

export function SaveButton({ recipeId, initial }: { recipeId: string; initial: boolean }) {
  const [saved, setSaved] = useState(initial);
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      aria-pressed={saved}
      disabled={pending}
      onClick={() =>
        start(async () => {
          setSaved((s) => !s);
          const res = await toggleSaved(recipeId);
          setSaved(res.saved);
          toast(res.saved ? "Saved to your recipes" : "Removed from saved");
        })
      }
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[0.875rem] transition-colors ${
        saved ? "border-turmeric bg-turmeric-tint text-ink" : "border-hairline bg-surface hover:border-ink-soft"
      }`}
    >
      <span aria-hidden>{saved ? "♥" : "♡"}</span> {saved ? "Saved" : "Save"}
    </button>
  );
}

function currentSlot() {
  const hour = Number(new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", hourCycle: "h23" }).format(new Date()));
  return mealSlotForHour(hour);
}

/** Sticky bar: the two things you do with a recipe — cook it, then log it. */
export function RecipeActions({ recipe }: { recipe: { id: string; name: string; dietMode: "vegetarian" | "vegan" } }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-10 border-t border-hairline bg-paper/95 backdrop-blur lg:sticky lg:bottom-0 lg:ml-0">
        <div className="mx-auto grid max-w-[480px] grid-cols-2 gap-2 px-4 py-3 md:max-w-[720px] md:px-8 lg:max-w-[1080px]">
          <Button href={`/app/recipes/${recipe.id}/cook`} variant="secondary">
            ▶ Start cooking
          </Button>
          <Button type="button" onClick={() => setOpen(true)}>
            I cooked this
          </Button>
        </div>
      </div>
      {open ? <QuickLogSheet recipe={recipe} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

export function QuickLogSheet({
  recipe,
  onClose,
}: {
  recipe: { id: string; name: string; dietMode: "vegetarian" | "vegan" };
  onClose: () => void;
}) {
  const router = useRouter();
  const [result, action, pending] = useActionState(logMeal, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const fired = useRef(false);

  // Log immediately — "I cooked this" is one tap, the sheet is the thank-you.
  // The ref guard keeps React's dev double-mount from logging the meal twice.
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    dialogRef.current?.showModal();
    formRef.current?.requestSubmit();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="quicklog-title"
      className="m-0 mt-auto max-h-[92dvh] w-full max-w-none overflow-y-auto rounded-t-[12px] border border-hairline bg-surface p-0 text-ink backdrop:bg-ink/40 md:m-auto md:max-w-[520px] md:rounded-[8px]"
    >
      <div className="px-5 pb-6 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="quicklog-title" className="text-[1.125rem] font-semibold">
            Nice cooking!
          </h2>
          <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close" className="flex h-11 w-11 items-center justify-center text-ink-soft">
            ✕
          </button>
        </div>
        <form ref={formRef} action={action} hidden>
          <input name="name" defaultValue={recipe.name} />
          <input name="recipeId" defaultValue={recipe.id} />
          <input name="diet" defaultValue={recipe.dietMode} />
          <input name="source" defaultValue="cooked" />
          <input name="slot" defaultValue={currentSlot()} />
          <input name="day" defaultValue="today" />
        </form>
        {result?.ok ? (
          <Celebration
            result={result}
            onDone={() => {
              dialogRef.current?.close();
              router.push("/app");
            }}
          />
        ) : result && !result.ok ? (
          <p role="alert" className="text-[0.875rem] text-rust">
            {result.error}
          </p>
        ) : (
          <p className="text-[0.9375rem] text-ink-soft" aria-busy={pending}>
            Logging {recipe.name}…
          </p>
        )}
      </div>
    </dialog>
  );
}
