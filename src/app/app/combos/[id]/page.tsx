"use client";

import { use } from "react";
import Link from "next/link";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ModeTag } from "@/components/ui/ModeTag";
import { Figure } from "@/components/ui/SourceLabel";
import { combos } from "@/lib/fixtures/combos";

export default function ComboDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const combo = combos.find((c) => c.id === id);

  if (!combo) {
    return (
      <main className="flex-1 pb-8">
        <Shell>
          <Link href="/app/recipes" className="mt-5 inline-block text-ink">
            ← Recipes
          </Link>
          <PageTitle eyebrow="Not found">Combo not found</PageTitle>
          <p className="text-[0.875rem] text-ink-soft">
            This fulfilment combo doesn&rsquo;t exist in the current data set.
          </p>
          <Button href="/app/recipes" className="mt-4">
            Back to recipes
          </Button>
        </Shell>
      </main>
    );
  }

  return (
    <main className="flex-1 pb-8">
      <Shell>
        <Link href="/app/recipes" className="mt-5 inline-block text-ink">
          ← Recipes
        </Link>
        <PageTitle eyebrow={combo.category}>{combo.name}</PageTitle>

        <div className="mb-5 flex flex-wrap items-center gap-2">
          <ModeTag mode={combo.dietMode} />
          <span className="text-[0.8125rem] text-ink-soft">{combo.cuisine}</span>
        </div>

        {/*
          Phone/tablet: one column in the original order (wrappers are display:contents,
          `order-*` restores the sequence). Desktop: combo body in the main column,
          summary + actions in a sticky aside.
        */}
        <div className="flex flex-col xl:grid xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
          <div className="contents xl:block">
            <Card className="order-1 mb-4">
              <CardTitle>Main + sides</CardTitle>
              <p className="text-[0.9375rem] font-medium">{combo.mainDish}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.8125rem] text-ink-soft">
                {combo.sides.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </Card>

            <Card className="order-2 mb-4">
              <CardTitle>Why this combo fits</CardTitle>
              <p className="text-[0.875rem] text-ink-soft">{combo.whyItFits}</p>
            </Card>

            <div className="order-5 mb-6">
              <p className="mb-1.5 text-[0.8125rem] font-medium">Alternative components</p>
              <ul className="list-disc space-y-1 pl-5 text-[0.8125rem] text-ink-soft">
                {combo.alternativeComponents.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="contents xl:sticky xl:top-6 xl:block xl:self-start">
            <div className="order-3 mb-4 grid grid-cols-2 gap-3">
              <Card>
                <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">Protein</p>
                <p className="text-[0.9375rem] font-medium capitalize">{combo.proteinLevel}</p>
              </Card>
              <Card>
                <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">Fullness</p>
                <p className="text-[0.9375rem] font-medium">{combo.fullness}/5</p>
              </Card>
            </div>

            <div className="order-4 mb-5">
              <p className="mb-1 text-[0.8125rem] font-medium">Estimated cost</p>
              <Figure value={`₹${combo.estimatedCostRupees}`} source="estimated, synthetic" />
            </div>

            <div className="order-6 flex flex-col gap-2">
              <Button href={`/app/log?dish=${encodeURIComponent(combo.name)}`}>Cook / log combo</Button>
              <Button variant="secondary" disabled>
                Full recipe — outside this pass
              </Button>
              <Button variant="secondary" href="/app/discover">
                Find restaurant
              </Button>
              <Button variant="secondary" href="/app/shopping-list">
                Add ingredients
              </Button>
            </div>
          </aside>
        </div>
      </Shell>
    </main>
  );
}
