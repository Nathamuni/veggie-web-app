"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ModeTag } from "@/components/ui/ModeTag";
import { EmptyState } from "@/components/ui/EmptyState";
import { mealLogs } from "@/lib/fixtures";

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];
const dietClass = [
  { id: "Vegetarian", border: "border-curry-leaf", bg: "bg-curry-leaf-tint", text: "text-curry-leaf" },
  { id: "Vegan", border: "border-kattam-blue", bg: "bg-kattam-blue-tint", text: "text-kattam-blue" },
  { id: "Meat", border: "border-rust", bg: "bg-rust-tint", text: "text-rust" },
];
const portions = ["Small", "Regular", "Large"];

export default function LogMealPage({
  searchParams,
}: {
  searchParams: Promise<{ dish?: string }>;
}) {
  const { dish } = use(searchParams);
  const router = useRouter();
  const recent = mealLogs.slice(0, 4);
  const [mealType, setMealType] = useState("Dinner");
  const [diet, setDiet] = useState("Vegetarian");
  const [portion, setPortion] = useState("Regular");
  const [name, setName] = useState(dish ?? "");

  function save() {
    const q = new URLSearchParams({ name, diet: diet.toLowerCase(), type: mealType });
    router.push(`/app/log/new?${q}`);
  }

  return (
    <main className="flex-1 pb-8">
      <Shell width="narrow">
        <Link href="/app" className="mt-5 inline-block text-ink">
          ← Home
        </Link>
        <PageTitle eyebrow="New entry">Log a meal</PageTitle>

        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <div>
            <p className="mb-1.5 text-[0.8125rem] font-medium">Meal type</p>
            <div className="flex gap-2">
              {mealTypes.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setMealType(t)}
                  className={`flex-1 rounded-[6px] border px-2 py-2 text-center text-[0.8125rem] ${
                    t === mealType
                      ? "border-2 border-ink font-medium"
                      : "border-hairline bg-surface text-ink-soft"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[0.8125rem] font-medium">Search food / recipe / dish</span>
            <input
              type="search"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. dosa + sambar"
              className="rounded-[6px] border border-hairline bg-surface px-3 py-2.5 text-[0.9375rem] outline-none focus:border-turmeric"
            />
          </label>

          <div>
            <p className="mb-1.5 text-[0.8125rem] font-medium">Diet classification</p>
            <div className="flex gap-2">
              {dietClass.map((d) => {
                const selected = d.id === diet;
                return (
                  <button
                    type="button"
                    key={d.id}
                    onClick={() => setDiet(d.id)}
                    className={`rounded-full border px-3 py-1.5 text-[0.8125rem] ${
                      selected ? `${d.border} ${d.bg} ${d.text}` : "border-hairline bg-surface text-ink-soft"
                    }`}
                  >
                    {d.id}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-[0.8125rem] font-medium">Portion</p>
            <div className="flex gap-2 text-[0.8125rem]">
              {portions.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPortion(p)}
                  className={`flex-1 rounded-[6px] border px-3 py-2 text-center ${
                    p === portion
                      ? "border-2 border-ink font-medium"
                      : "border-hairline text-ink-soft"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[0.8125rem] font-medium">Note (optional)</span>
            <input
              type="text"
              placeholder="+ Add a photo or note"
              className="rounded-[6px] border border-hairline bg-surface px-3 py-2.5 text-[0.875rem] text-ink-soft outline-none focus:border-turmeric"
            />
          </label>

          <Button type="submit" disabled={!name.trim()}>
            Save meal
          </Button>
          {diet === "Meat" ? (
            <p className="-mt-2 text-[0.8125rem] text-ink-soft">
              Logging a meat meal never resets your progress.
            </p>
          ) : null}
        </form>

        <div className="mt-8">
          <p className="mb-2 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
            Recent
          </p>
          {recent.length === 0 ? (
            <EmptyState
              title="No meals logged yet"
              reason="Log your first meal to start seeing progress against your baseline."
            />
          ) : null}
          <div className="flex flex-col gap-2">
            {recent.map((m) => (
              <Link key={m.id} href={`/app/log/${m.id}`} className="block">
                <Card className="flex items-center justify-between">
                  <div>
                    <p className="text-[0.875rem] font-medium">{m.name}</p>
                    <p className="text-[0.75rem] text-ink-soft">
                      {m.mealType} · {m.date}
                    </p>
                  </div>
                  {m.dietClassification !== "meat" ? (
                    <ModeTag mode={m.dietClassification} />
                  ) : (
                    <ModeTag mode="warning" label="Meat" />
                  )}
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </Shell>
    </main>
  );
}
