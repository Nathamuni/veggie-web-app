"use client";

import { useActionState, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ModeTag } from "@/components/ui/ModeTag";
import { logMeal } from "@/app/actions/meals";
import { Celebration } from "./Celebration";

export type RecipeOption = { id: string; name: string; dietMode: "vegetarian" | "vegan"; cuisine: string };
export type RecentMeal = {
  name: string;
  recipeId: string | null;
  diet: "vegan" | "vegetarian" | "meat";
  source: "cooked" | "ate_out" | "other";
};
type Slot = "breakfast" | "lunch" | "dinner" | "snack";

const SOURCES = [
  { id: "cooked", label: "Cooked at home" },
  { id: "ate_out", label: "Ate out / ordered" },
  { id: "other", label: "Something else" },
] as const;
const SLOTS: { id: Slot; label: string }[] = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snack", label: "Snack" },
];
const DIETS = [
  { id: "vegan", label: "Vegan", on: "border-kattam-blue bg-kattam-blue-tint text-kattam-blue" },
  { id: "vegetarian", label: "Vegetarian", on: "border-curry-leaf bg-curry-leaf-tint text-curry-leaf" },
  { id: "meat", label: "Had meat, fish or egg", on: "border-rust bg-rust-tint text-rust" },
] as const;

const chip = (on: boolean, onCls = "border-ink bg-ink text-surface") =>
  `inline-flex min-h-11 items-center rounded-full border px-4 text-[0.875rem] transition-colors ${
    on ? onCls : "border-hairline bg-surface hover:border-ink-soft"
  }`;

export function LogMeal(props: {
  recipes: RecipeOption[];
  recent: RecentMeal[];
  defaultSlot: Slot;
  preset?: RecentMeal;
}) {
  // Re-mounting resets the form and its action state for "Log another".
  const [round, setRound] = useState(0);
  return <LogForm key={round} {...props} preset={round === 0 ? props.preset : undefined} onAnother={() => setRound((r) => r + 1)} />;
}

function LogForm({
  recipes,
  recent,
  defaultSlot,
  preset,
  onAnother,
}: {
  recipes: RecipeOption[];
  recent: RecentMeal[];
  defaultSlot: Slot;
  preset?: RecentMeal;
  onAnother: () => void;
}) {
  const router = useRouter();
  const [result, action, pending] = useActionState(logMeal, undefined);
  const [name, setName] = useState(preset?.name ?? "");
  const [recipeId, setRecipeId] = useState<string | null>(preset?.recipeId ?? null);
  const [source, setSource] = useState<RecentMeal["source"]>(preset?.source ?? "cooked");
  const [diet, setDiet] = useState<RecentMeal["diet"] | null>(preset?.diet ?? null);
  const [slot, setSlot] = useState<Slot>(defaultSlot);
  const [day, setDay] = useState<"today" | "yesterday">("today");

  const recipe = recipes.find((r) => r.id === recipeId);
  const query = name.trim().toLowerCase();
  const matches = useMemo(
    () =>
      query.length < 2 || recipe
        ? []
        : recipes.filter((r) => r.name.toLowerCase().includes(query) || r.cuisine.toLowerCase().includes(query)).slice(0, 5),
    [query, recipe, recipes],
  );

  if (result?.ok) {
    return (
      <Celebration
        result={result}
        onDone={() => router.push("/app")}
        onAnother={onAnother}
      />
    );
  }

  function pick(m: RecentMeal) {
    setName(m.name);
    setRecipeId(m.recipeId);
    setSource(m.source);
    setDiet(m.diet);
  }

  const effectiveDiet = recipe ? recipe.dietMode : diet;
  const ready = name.trim().length > 0 && effectiveDiet !== null;

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="recipeId" value={recipeId ?? ""} />
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="slot" value={slot} />
      <input type="hidden" name="day" value={day} />
      {effectiveDiet ? <input type="hidden" name="diet" value={effectiveDiet} /> : null}

      {recent.length > 0 && !name ? (
        <section aria-labelledby="again-title">
          <h2 id="again-title" className="mb-2 text-[0.9375rem] font-semibold">
            Eat one of these again?
          </h2>
          <ul className="flex flex-wrap gap-2">
            {recent.map((m) => (
              <li key={`${m.name}-${m.recipeId}`}>
                <button type="button" onClick={() => pick(m)} className={chip(false)}>
                  {m.name}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <fieldset>
        <legend id="ate-label" className="mb-2 text-[0.9375rem] font-semibold">What did you eat?</legend>
        <div className="relative">
          <input
            type="text"
            name="name"
            required
            maxLength={120}
            autoComplete="off"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setRecipeId(null);
            }}
            placeholder="e.g. Idli sambar, veg thali, chicken biryani"
            aria-labelledby="ate-label"
            aria-describedby="name-help"
            className="w-full rounded-[6px] border border-hairline bg-surface px-3 py-3 text-[1rem] outline-none focus:border-turmeric"
          />
          {name ? (
            <button
              type="button"
              aria-label="Clear"
              onClick={() => {
                setName("");
                setRecipeId(null);
                setDiet(null);
              }}
              className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-ink-soft"
            >
              ✕
            </button>
          ) : null}
        </div>
        <p id="name-help" className="mt-1.5 text-[0.8125rem] text-ink-soft">
          {recipe ? (
            <span className="inline-flex items-center gap-2">
              From your recipes <ModeTag mode={recipe.dietMode} />
            </span>
          ) : (
            "Type anything — a dish, a restaurant meal, a snack."
          )}
        </p>
        {matches.length > 0 ? (
          <ul className="mt-2 divide-y divide-hairline rounded-[6px] border border-hairline bg-surface" aria-label="Matching recipes">
            {matches.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => {
                    setName(r.name);
                    setRecipeId(r.id);
                    setSource("cooked");
                  }}
                  className="flex min-h-12 w-full items-center justify-between gap-3 px-4 py-2 text-left hover:bg-paper"
                >
                  <span className="text-[0.9375rem]">{r.name}</span>
                  <ModeTag mode={r.dietMode} />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </fieldset>

      {!recipe ? (
        <fieldset>
          <legend className="mb-2 text-[0.9375rem] font-semibold">Was it…</legend>
          <div className="flex flex-wrap gap-2">
            {DIETS.map((d) => (
              <button
                key={d.id}
                type="button"
                aria-pressed={diet === d.id}
                onClick={() => setDiet(d.id)}
                className={chip(diet === d.id, d.on)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      <fieldset>
        <legend className="mb-2 text-[0.9375rem] font-semibold">Where from?</legend>
        <div className="flex flex-wrap gap-2">
          {SOURCES.map((s) => (
            <button key={s.id} type="button" aria-pressed={source === s.id} onClick={() => setSource(s.id)} className={chip(source === s.id)}>
              {s.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-[0.9375rem] font-semibold">When?</legend>
        <div className="flex flex-wrap gap-2">
          {SLOTS.map((s) => (
            <button key={s.id} type="button" aria-pressed={slot === s.id} onClick={() => setSlot(s.id)} className={chip(slot === s.id)}>
              {s.label}
            </button>
          ))}
        </div>
        <div className="mt-2 flex gap-4 text-[0.875rem]">
          {(["today", "yesterday"] as const).map((d) => (
            <label key={d} className="flex min-h-11 cursor-pointer items-center gap-2">
              <input type="radio" name="dayChoice" checked={day === d} onChange={() => setDay(d)} className="accent-ink" />
              {d === "today" ? "Today" : "Yesterday"}
            </label>
          ))}
        </div>
      </fieldset>

      {result && !result.ok ? (
        <p role="alert" className="text-[0.875rem] text-rust">
          {result.error}
        </p>
      ) : null}

      <div className="sticky bottom-20 z-10 -mx-4 border-t border-hairline bg-paper/95 px-4 py-3 backdrop-blur lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0">
        <Button type="submit" className="w-full" disabled={!ready || pending}>
          {pending ? "Logging…" : ready ? `Log ${name.length > 28 ? "meal" : name}` : "Tell us what you ate"}
        </Button>
      </div>
    </form>
  );
}
