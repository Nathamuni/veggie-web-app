"use client";

import { useState } from "react";
import Link from "next/link";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { pantryItems, type PantryItem } from "@/lib/fixtures/pantry";

/** Parse a "<amount> <unit>" quantity string into its numeric and unit parts. */
function parseQuantity(q: string): { amount: number; unit: string } | null {
  const m = q.trim().match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
  if (!m) return null;
  return { amount: parseFloat(m[1]), unit: m[2] };
}

/** Step size scales with the unit so a stepper on "5 kg" or "50 g" both feel sane. */
function stepFor(unit: string): number {
  const u = unit.toLowerCase();
  if (u.startsWith("g")) return 50;
  if (u.startsWith("kg") || u.startsWith("l") || u.startsWith("litre")) return 0.5;
  return 1;
}

function adjustQuantity(q: string, delta: number): string {
  const parsed = parseQuantity(q);
  if (!parsed) return q;
  const next = Math.max(0, parsed.amount + delta);
  const amountStr = Number.isInteger(next) ? String(next) : next.toFixed(1);
  return parsed.unit ? `${amountStr} ${parsed.unit}` : amountStr;
}

let nextIdSuffix = 0;

export default function PantryPage() {
  const [items, setItems] = useState<PantryItem[]>(pantryItems);
  const [draft, setDraft] = useState("");

  function adjust(id: string, delta: number) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, quantity: adjustQuantity(it.quantity, delta) } : it))
    );
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  function addItem() {
    const name = draft.trim();
    if (!name) return;
    nextIdSuffix += 1;
    setItems((prev) => [
      ...prev,
      { id: `pantry-custom-${Date.now()}-${nextIdSuffix}`, name, quantity: "1 unit" },
    ]);
    setDraft("");
  }

  return (
    <main className="flex-1 pb-8">
      <Shell>
        <Link href="/app" className="mt-5 inline-block text-ink">
          ← Home
        </Link>
        <PageTitle eyebrow="Kitchen">Pantry</PageTitle>

        <div className="flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-3 2xl:grid-cols-3">
          {items.map((item) => {
            const parsed = parseQuantity(item.quantity);
            const delta = parsed ? stepFor(parsed.unit) : 1;
            return (
              <Card key={item.id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[0.9375rem] font-medium">{item.name}</p>
                    {item.expiryDate ? (
                      <p className="mt-0.5 font-mono text-[0.75rem] text-ink-soft">
                        Expires {item.expiryDate}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-2 font-mono text-[0.875rem]">
                    <button
                      type="button"
                      onClick={() => adjust(item.id, -delta)}
                      aria-label={`Decrease ${item.name}`}
                      className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-hairline text-ink-soft hover:border-ink hover:text-ink"
                    >
                      −
                    </button>
                    <span className="w-16 text-center text-ink">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => adjust(item.id, delta)}
                      aria-label={`Increase ${item.name}`}
                      className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-hairline text-ink-soft hover:border-ink hover:text-ink"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="ml-1 text-ink-soft underline-offset-2 hover:text-rust hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
          {items.length === 0 ? (
            <div className="md:col-span-full">
              <EmptyState
                title="Your pantry is empty"
                reason="Add the staples you keep at home below, then see which recipes they cover."
              />
            </div>
          ) : null}
        </div>

        <div className="mt-4 md:max-w-[420px]">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addItem();
              }
            }}
            aria-label="Add pantry item"
            placeholder="Add an item and press Enter"
            className="w-full rounded-[6px] border border-hairline bg-surface px-3 py-2.5 text-[0.875rem] outline-none focus:border-turmeric"
          />
        </div>

        <div className="mt-6 md:max-w-[420px]">
          <Button href="/app/pantry/cook" className="w-full">
            What can I cook?
          </Button>
          <p className="mt-2 text-center text-[0.8125rem] text-ink-soft">
            Recipes ranked by what your pantry already covers.
          </p>
        </div>
      </Shell>
    </main>
  );
}
