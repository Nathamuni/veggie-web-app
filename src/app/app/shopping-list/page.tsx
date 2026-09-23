"use client";

import { useState } from "react";
import Link from "next/link";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Figure, SourceLabel } from "@/components/ui/SourceLabel";
import {
  shoppingListItems,
  shoppingCoveredByPantry,
  shoppingPriceBasis,
  shoppingPriceSource,
  type ShoppingItem,
} from "@/lib/fixtures/shoppingList";
import { pantryItems } from "@/lib/fixtures/pantry";

const toBuy = shoppingListItems.filter((it) => !shoppingCoveredByPantry[it.id]);
const inPantry = shoppingListItems
  .filter((it) => shoppingCoveredByPantry[it.id])
  .map((it) => ({
    item: it,
    pantry: pantryItems.find((p) => p.id === shoppingCoveredByPantry[it.id]),
  }));

/** Group preserving the fixture's category order. */
function groupByCategory(items: ShoppingItem[]): [string, ShoppingItem[]][] {
  const groups = new Map<string, ShoppingItem[]>();
  for (const it of items) {
    const list = groups.get(it.category) ?? [];
    list.push(it);
    groups.set(it.category, list);
  }
  return Array.from(groups.entries());
}

function plainTextList(items: ShoppingItem[]): string {
  const lines = ["Veggie shopping list", ""];
  for (const [category, group] of groupByCategory(items)) {
    lines.push(category.toUpperCase());
    for (const it of group) {
      lines.push(`- ${it.name}: ${it.quantity} ${it.unit} (est. ₹${it.estimatedPriceRupees})`);
    }
    lines.push("");
  }
  lines.push(`Prices: ${shoppingPriceBasis} estimates, ${shoppingPriceSource}`);
  return lines.join("\n");
}

export default function ShoppingListPage() {
  const [bought, setBought] = useState<Set<string>>(new Set());
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");

  function toggle(id: string) {
    setBought((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const remaining = toBuy.filter((it) => !bought.has(it.id));
  const remainingTotal = remaining.reduce((sum, it) => sum + it.estimatedPriceRupees, 0);

  async function exportList() {
    try {
      await navigator.clipboard.writeText(plainTextList(remaining));
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  }

  return (
    <main className="flex-1 pb-8">
      <Shell>
        <Link href="/app/meal-plan" className="mt-5 inline-block text-ink">
          ← Meal planner
        </Link>
        <PageTitle eyebrow="Kitchen">Shopping list</PageTitle>

        <p className="mb-4 text-[0.8125rem] text-ink-soft">
          Built from this week&rsquo;s meal plan, minus what&rsquo;s already in your pantry. Prices
          are {shoppingPriceBasis} estimates only{" "}
          <SourceLabel>· {shoppingPriceSource}</SourceLabel>
        </p>

        {/*
          Phone/tablet: one column in the original order (wrappers are display:contents,
          `order-*` restores the sequence). Desktop: the list in the main column, the
          running total and export in a sticky aside.
        */}
        <div className="flex flex-col xl:grid xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
          <div className="contents xl:block">
            <div className="order-2">
              {remaining.length === 0 ? (
                <EmptyState
                  title={toBuy.length === 0 ? "Nothing to buy" : "Everything's bought"}
                  reason={
                    toBuy.length === 0
                      ? "Your pantry already covers this week's plan."
                      : "Every item on this list is marked as bought."
                  }
                  actionHref="/app/meal-plan"
                  actionLabel="Back to meal planner"
                >
                  {bought.size > 0 ? (
                    <div>
                      <Button variant="ghost" className="mt-2" onClick={() => setBought(new Set())}>
                        Unmark all
                      </Button>
                    </div>
                  ) : null}
                </EmptyState>
              ) : (
                <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:items-start md:gap-x-6 md:gap-y-5 xl:grid-cols-1 2xl:grid-cols-2">
                  {groupByCategory(toBuy).map(([category, items]) => (
                    <section key={category} aria-labelledby={`cat-${category}`}>
                      <h2
                        id={`cat-${category}`}
                        className="mb-2 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft"
                      >
                        {category}
                      </h2>
                      <div className="rounded-[6px] border border-hairline bg-surface">
                        <ul className="divide-y divide-hairline">
                          {items.map((it) => {
                            const isBought = bought.has(it.id);
                            const inputId = `buy-${it.id}`;
                            return (
                              <li key={it.id} className="flex items-center gap-3 px-4 py-3">
                                <input
                                  id={inputId}
                                  type="checkbox"
                                  checked={isBought}
                                  onChange={() => toggle(it.id)}
                                  className="h-5 w-5 shrink-0 accent-turmeric"
                                />
                                <label htmlFor={inputId} className="min-w-0 flex-1 cursor-pointer">
                                  <span
                                    className={`block text-[0.9375rem] font-medium ${
                                      isBought ? "text-ink-soft line-through" : "text-ink"
                                    }`}
                                  >
                                    {it.name}
                                  </span>
                                  <span className="block font-mono text-[0.75rem] text-ink-soft">
                                    {it.quantity} {it.unit}
                                    {isBought ? " · bought" : ""}
                                  </span>
                                </label>
                                <span className="shrink-0 text-right">
                                  <Figure value={`₹${it.estimatedPriceRupees}`} source="est." />
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>

            {inPantry.length > 0 ? (
              <section aria-labelledby="in-pantry" className="order-3 mt-6">
                <Card>
                  <CardTitle>
                    <span id="in-pantry">Already in your pantry</span>
                  </CardTitle>
                  <p className="mb-2 text-[0.8125rem] text-ink-soft">
                    Taken off the list because your pantry covers the full amount.
                  </p>
                  <ul className="divide-y divide-hairline">
                    {inPantry.map(({ item, pantry }) => (
                      <li
                        key={item.id}
                        className="flex items-baseline justify-between gap-3 py-2 text-[0.875rem]"
                      >
                        <span className="min-w-0 text-ink">
                          {item.name}{" "}
                          <span className="font-mono text-[0.75rem] text-ink-soft">
                            needs {item.quantity} {item.unit}
                          </span>
                        </span>
                        <span className="shrink-0 font-mono text-[0.75rem] text-ink-soft">
                          have {pantry ? pantry.quantity : "data unavailable"}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/app/pantry"
                    className="mt-2 inline-block text-[0.8125rem] text-ink underline underline-offset-4"
                  >
                    Manage pantry
                  </Link>
                </Card>
              </section>
            ) : null}
          </div>

          <aside className="contents xl:sticky xl:top-6 xl:block xl:self-start">
            {remaining.length === 0 ? null : (
              <Card className="order-1 mb-4">
                <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
                  Still to buy
                </p>
                <p className="text-[0.875rem] text-ink" aria-live="polite">
                  <span className="font-mono font-medium">{remaining.length}</span> item
                  {remaining.length === 1 ? "" : "s"} ·{" "}
                  <Figure
                    value={`₹${remainingTotal}`}
                    source={`estimated ${shoppingPriceBasis} total`}
                  />
                </p>
              </Card>
            )}

            <div className="order-4 mt-6 flex flex-col gap-2 xl:mt-0">
              <Button onClick={exportList} disabled={remaining.length === 0}>
                Export / share list
              </Button>
              <p role="status" className="min-h-[1.25rem] text-center text-[0.8125rem] text-ink-soft">
                {copyStatus === "copied"
                  ? "Copied — plain-text list is on your clipboard."
                  : copyStatus === "failed"
                    ? "Couldn't copy. Your browser blocked clipboard access."
                    : ""}
              </p>
              <Button variant="secondary" disabled aria-describedby="retailer-note">
                Retailer links
              </Button>
              <p id="retailer-note" className="text-center text-[0.8125rem] text-ink-soft">
                Retailer links: not available yet.
              </p>
            </div>
          </aside>
        </div>
      </Shell>
    </main>
  );
}
