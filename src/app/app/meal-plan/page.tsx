"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Figure } from "@/components/ui/SourceLabel";
import { recipes as allRecipes, user, type Recipe } from "@/lib/fixtures";

// Hard diet filter before anything else: vegan mode never offers vegetarian-only recipes.
const recipes = allRecipes.filter((r) => user.dietMode === "vegetarian" || r.dietMode === "vegan");

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const mealSlots = ["Breakfast", "Lunch", "Dinner"] as const;

type Day = (typeof days)[number];
type MealSlot = (typeof mealSlots)[number];
type SlotKey = `${Day}-${MealSlot}`;

function slotKey(day: Day, slot: MealSlot): SlotKey {
  return `${day}-${slot}`;
}

const costByBand: Record<Recipe["costBand"], number> = { "₹": 80, "₹₹": 150, "₹₹₹": 250 };

export default function MealPlannerPage() {
  const [plan, setPlan] = useState<Partial<Record<SlotKey, string>>>({});
  const [pickerSlot, setPickerSlot] = useState<SlotKey | null>(null);

  function generateWeek() {
    setPlan((prev) => {
      const next = { ...prev };
      for (const day of days) {
        for (const slot of mealSlots) {
          const key = slotKey(day, slot);
          if (!next[key]) {
            next[key] = recipes[Math.floor(Math.random() * recipes.length)].id;
          }
        }
      }
      return next;
    });
  }

  function swap(key: SlotKey, recipeId: string) {
    setPlan((prev) => {
      const next = { ...prev };
      if (recipeId) next[key] = recipeId;
      else delete next[key];
      return next;
    });
    setPickerSlot(null);
  }

  const filledRecipes = useMemo(
    () =>
      Object.values(plan)
        .filter((id): id is string => !!id)
        .map((id) => recipes.find((r) => r.id === id))
        .filter((r): r is Recipe => !!r),
    [plan]
  );

  const highProteinCount = filledRecipes.filter((r) => r.protein === "high").length;
  const totalCostRupees = filledRecipes.reduce((sum, r) => sum + costByBand[r.costBand], 0);

  return (
    <main className="flex-1 pb-8">
      <Shell>
        <Link href="/app" className="mt-5 inline-block text-ink">
          ← Home
        </Link>
        <PageTitle eyebrow="Kitchen">Meal planner</PageTitle>

        <Button className="w-full md:w-auto" onClick={generateWeek}>
          Generate week
        </Button>

        {/*
          Phone/tablet: one card per day, meals across. Desktop: the full week as a grid —
          days are columns, meals are rows. Each day card spans the four rows via subgrid
          (and the inner meal row is display:contents) so rows line up across the week.
        */}
        <div className="mt-5 flex flex-col gap-2 xl:grid xl:grid-cols-7 xl:grid-rows-[auto_repeat(3,auto)] xl:gap-x-2 xl:gap-y-1.5">
          {days.map((day) => (
            <Card key={day} className="xl:row-span-4 xl:grid xl:grid-rows-subgrid xl:p-2">
              <p className="mb-2 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft xl:mb-0">
                {day}
              </p>
              <div className="grid grid-cols-3 gap-1.5 xl:contents">
                {mealSlots.map((slot) => {
                  const key = slotKey(day, slot);
                  const recipeId = plan[key];
                  const recipe = recipeId ? recipes.find((r) => r.id === recipeId) : undefined;
                  const isPicking = pickerSlot === key;

                  if (isPicking) {
                    return (
                      <select
                        key={key}
                        autoFocus
                        defaultValue={recipeId ?? ""}
                        onChange={(e) => swap(key, e.target.value)}
                        className="w-full min-w-0 rounded-[4px] border border-turmeric bg-surface px-1 py-1.5 text-[0.6875rem] text-ink outline-none"
                      >
                        <option value="">— empty —</option>
                        {recipes.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    );
                  }

                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setPickerSlot(key)}
                      className="flex min-h-[68px] w-full flex-col items-start gap-1 rounded-[4px] border border-hairline bg-surface p-1.5 text-left transition-colors hover:border-ink-soft"
                    >
                      <span className="font-mono text-[0.625rem] uppercase tracking-wide text-ink-soft">
                        {slot}
                      </span>
                      <span
                        className={`text-[0.6875rem] leading-snug break-words ${
                          recipe ? "font-medium text-ink" : "italic text-ink-soft"
                        }`}
                      >
                        {recipe ? recipe.name : "+ Add"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-3">
          <Card>
            <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
              This week
            </p>
            <p className="text-[0.875rem] text-ink">
              <span className="font-mono font-medium">{highProteinCount}</span> high-protein slot
              {highProteinCount === 1 ? "" : "s"} planned, of{" "}
              <span className="font-mono">{filledRecipes.length}</span> filled.
            </p>
          </Card>
          <Card>
            <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
              Estimated cost
            </p>
            <Figure value={`₹${totalCostRupees}`} source="₹80/₹150/₹250 per cost band" />
          </Card>
        </div>

        <div className="mt-6">
          <Button href="/app/shopping-list" variant="secondary" className="w-full md:w-auto">
            Create shopping list
          </Button>
        </div>
      </Shell>
    </main>
  );
}
