import Link from "next/link";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card } from "@/components/ui/Card";
import { impact } from "@/lib/fixtures";

export default function AnimalImpact() {
  const max = Math.max(...impact.byCategory.map((c) => c.mealsAvoided));

  return (
    <main className="flex-1 pb-8">
      <Shell>
        <Link href="/app" className="mt-5 inline-block text-ink">
          ← Home
        </Link>
        <PageTitle eyebrow={impact.timeframe}>Animal impact</PageTitle>

        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
        <div>
        <Card className="mb-4 text-center">
          <p className="text-[2.5rem] font-semibold leading-none text-turmeric">
            {impact.animalMealsAvoidedTotal}
          </p>
          <p className="mt-2 text-[0.9375rem]">animal-based meals avoided</p>
          <p className="mt-1 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
            estimate · not a precise count
          </p>
        </Card>

        <div className="mb-4">
          <p className="mb-2 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
            By category
          </p>
          <div className="flex flex-col gap-2 md:grid md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {impact.byCategory.map((c) => (
              <Card key={c.category}>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="text-[0.875rem]">{c.category}</span>
                  <span className="font-mono text-[0.875rem] font-medium text-ink">
                    {c.mealsAvoided}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-hairline">
                  <div
                    className="h-full rounded-full bg-ink-soft"
                    style={{ width: `${(c.mealsAvoided / max) * 100}%` }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>

        </div>

        <aside className="xl:sticky xl:top-6 xl:self-start">
        <Card>
          <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
            Methodology
          </p>
          <p className="text-[0.8125rem] leading-relaxed text-ink-soft">{impact.methodologyNote}</p>
          <p className="mt-2 font-mono text-[0.6875rem] text-ink-soft">
            Factor version: {impact.methodologyVersion}
          </p>
          <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-soft">
            We report meals avoided only — never CO₂, water, or land estimates.
          </p>
          <Link
            href="/impact-methodology"
            className="mt-3 inline-block text-[0.8125rem] text-ink underline underline-offset-4"
          >
            Read the full methodology →
          </Link>
        </Card>
        </aside>
        </div>
      </Shell>
    </main>
  );
}
