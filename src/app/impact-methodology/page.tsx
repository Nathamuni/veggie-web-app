import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { PublicChrome } from "@/components/ui/PublicChrome";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { SourceLabel } from "@/components/ui/SourceLabel";

export const metadata: Metadata = {
  title: "Impact methodology · Veggie",
};

const FACTOR_VERSION = "impact-factors-v0-draft";

export default function ImpactMethodologyPage() {
  return (
    <PublicChrome>
      <main className="flex-1 pb-10">
        <Shell width="narrow">
          <PageTitle eyebrow="Impact methodology">How we estimate impact</PageTitle>
          <p className="mb-2 text-[0.9375rem] leading-relaxed text-ink-soft">
            Every impact figure in Veggie is an estimate. This page explains exactly what we
            count, what we don&apos;t, and where the numbers are still pending.
          </p>
          <p className="mb-8">
            <SourceLabel>Method version · {FACTOR_VERSION}</SourceLabel>
          </p>

          <section aria-labelledby="base-heading" className="mb-8">
            <h2 id="base-heading" className="mb-3 text-[1.125rem] font-semibold">
              1. The base metric: animal-based meals avoided
            </h2>
            <Card>
              <p className="font-mono text-[0.8125rem] leading-relaxed text-ink">
                baseline − current = avoided animal-based meals
              </p>
            </Card>
            <dl className="mt-4 flex flex-col gap-3 text-[0.8125rem]">
              <div>
                <dt className="font-semibold text-ink">Baseline</dt>
                <dd className="text-ink-soft">
                  How many animal-based meals you told us you ate in a typical week when you
                  started.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Current</dt>
                <dd className="text-ink-soft">
                  How many animal-based meals you have logged in the same period since.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Avoided</dt>
                <dd className="text-ink-soft">
                  The difference. It is based only on what you report — we don&apos;t infer
                  meals you didn&apos;t log.
                </dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="animals-heading" className="mb-8">
            <h2 id="animals-heading" className="mb-3 text-[1.125rem] font-semibold">
              2. Animal-equivalents (estimate)
            </h2>
            <p className="mb-4 text-[0.8125rem] leading-relaxed text-ink-soft">
              Avoided meals may later be translated into an estimated number of animals, using
              a versioned reference table of factors per meal type. Each estimate will show the
              table version it was calculated with, so a change to the table never silently
              changes your history.
            </p>
            <Card>
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink">
                  Reference factors
                </p>
                <SourceLabel>{FACTOR_VERSION}</SourceLabel>
              </div>
              <p className="mt-3 text-[0.9375rem] font-semibold">Not yet published</p>
              <p className="mt-1 text-[0.8125rem] text-ink-soft">
                The factors are pending legal review. Until they are approved, Veggie shows no
                animal-equivalent numbers — only avoided meals.
              </p>
            </Card>
          </section>

          <section aria-labelledby="exclude-heading" className="mb-8">
            <h2 id="exclude-heading" className="mb-3 text-[1.125rem] font-semibold">
              3. What we don&apos;t measure
            </h2>
            <p className="text-[0.8125rem] leading-relaxed text-ink-soft">
              Veggie does not show CO₂, water or land-use figures. We can&apos;t estimate
              them reliably from self-reported meals, so we don&apos;t show them at all.
            </p>
          </section>

          <section aria-labelledby="limits-heading">
            <h2 id="limits-heading" className="mb-3 text-[1.125rem] font-semibold">
              4. Limits of this estimate
            </h2>
            <ul className="flex list-disc flex-col gap-1.5 pl-5 text-[0.8125rem] text-ink-soft">
              <li>It depends on how accurately your baseline and logs reflect what you ate.</li>
              <li>Missing logs are treated as missing, not as meat-free or meat meals.</li>
              <li>It describes your own reported change, not a market-level effect.</li>
            </ul>
          </section>
        </Shell>
      </main>
    </PublicChrome>
  );
}
