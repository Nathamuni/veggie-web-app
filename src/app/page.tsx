import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { ModeTag } from "@/components/ui/ModeTag";
import { PublicChrome } from "@/components/ui/PublicChrome";
import { recipes, restaurants } from "@/lib/fixtures";

const pillars = [
  {
    name: "Transition",
    detail: "Meet you where you are — reduce, don't switch overnight.",
  },
  {
    name: "Satisfaction",
    detail: "Taste, fullness and craving come before ideology.",
  },
  { name: "Nutrition", detail: "Wellness support, never a diagnosis." },
  {
    name: "Discovery",
    detail: "Regional dishes and restaurants, not a generic directory.",
  },
  {
    name: "Progress",
    detail: "No streaks to break. A missed day doesn't reset anything.",
  },
  {
    name: "Impact",
    detail: "Transparent, sourced estimates — never invented numbers.",
  },
];

const steps = ["Understand", "Recommend", "Eat", "Learn", "Progress", "Impact"];

export default function PublicHome() {
  return (
    <PublicChrome>
      <main className="flex-1">
        <section className="border-b border-hairline px-4 pb-10 pt-12 md:px-8 md:pb-14 md:pt-16">
          <div className="mx-auto max-w-[480px] md:max-w-[720px] lg:grid lg:max-w-[1080px] lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:items-center lg:gap-16">
            <div className="md:max-w-[600px]">
              <p className="mb-3 font-mono text-[0.6875rem] uppercase tracking-wide text-turmeric">
                Veggie
              </p>
              <h1 className="mb-4 text-[clamp(1.9rem,7vw,2.5rem)] font-semibold leading-[1.1] tracking-tight">
                Eat more plant-based food without sacrificing satisfaction.
              </h1>
              <p className="mb-6 text-[0.9375rem] leading-relaxed text-ink-soft md:max-w-[60ch]">
                Veggie helps you reduce meat one satisfying, regionally familiar
                meal at a time — never by persuasion, never by punishment for an
                imperfect day.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href="/auth/sign-up" className="flex-1">
                  Start my journey
                </Button>
                <Button
                  href="/restaurants"
                  variant="secondary"
                  className="flex-1"
                >
                  Explore restaurants
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <Button href="/recipes" variant="ghost">
                  Explore recipes →
                </Button>
                <p className="text-[0.8125rem] text-ink-soft">
                  Have an account?{" "}
                  <Link
                    href="/auth/sign-in"
                    className="text-ink underline underline-offset-2"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
            <aside
              aria-labelledby="hero-preview-heading"
              className="hidden lg:block"
            >
              <h2
                id="hero-preview-heading"
                className="mb-3 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft"
              >
                A taste of what&apos;s inside
              </h2>
              <TastePreview className="flex flex-col gap-3" />
            </aside>
          </div>
        </section>

        <section className="border-b border-hairline px-4 py-8 md:px-8 md:py-10">
          <div className="mx-auto max-w-[480px] md:max-w-[720px] lg:max-w-[1080px]">
            <h2 className="mb-4 text-[1.125rem] font-semibold">
              How Veggie works
            </h2>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <span className="rounded-full border border-hairline bg-surface px-3 py-1 font-mono text-[0.75rem] text-ink">
                    {s}
                  </span>
                  {i < steps.length - 1 && (
                    <span className="text-ink-soft">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-hairline px-4 py-8 md:px-8 md:py-10">
          <div className="mx-auto max-w-[480px] md:max-w-[720px] lg:max-w-[1080px]">
            <h2 className="mb-4 text-[1.125rem] font-semibold">Six pillars</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {pillars.map((p) => (
                <Card key={p.name}>
                  <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-wide text-ink">
                    {p.name}
                  </p>
                  <p className="text-[0.8125rem] leading-snug text-ink-soft">
                    {p.detail}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-hairline px-4 py-8 md:px-8 md:py-10">
          <div className="mx-auto max-w-[480px] md:max-w-[720px] lg:max-w-[1080px]">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[1.125rem] font-semibold">
                Two paths, never blended
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Card className="md:p-5">
                <ModeTag mode="vegetarian" />
                <p className="mt-2 text-[0.8125rem] text-ink-soft">
                  Keep egg &amp; dairy where you choose to. No fish, no meat.
                </p>
              </Card>
              <Card className="md:p-5">
                <ModeTag mode="vegan" />
                <p className="mt-2 text-[0.8125rem] text-ink-soft">
                  No animal products at all. A hard filter everywhere, always.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="border-b border-hairline px-4 py-8 md:px-8 md:py-10 lg:hidden">
          <div className="mx-auto max-w-[480px] md:max-w-[720px] lg:max-w-[1080px]">
            <h2 className="mb-4 text-[1.125rem] font-semibold">
              A taste of what&apos;s inside
            </h2>
            <TastePreview className="flex flex-col gap-3 md:grid md:grid-cols-3" />
          </div>
        </section>

        <section className="px-4 py-8 md:px-8 md:py-10">
          <div className="mx-auto max-w-[480px] text-[0.8125rem] leading-relaxed text-ink-soft md:max-w-[720px] lg:max-w-[1080px]">
            <p className="mb-2 md:max-w-[65ch]">
              Veggie is wellness support, not a medical or diagnostic product.
              Nutrition guidance never claims a deficiency — only what your
              logged meals show.
            </p>
            <Link
              href="/impact-methodology"
              className="text-ink underline underline-offset-2"
            >
              How we estimate impact →
            </Link>
          </div>
        </section>
      </main>
    </PublicChrome>
  );
}

/** Recipe + restaurant sample cards; rendered in the hero at lg, in its own section below lg. */
function TastePreview({ className }: { className: string }) {
  return (
    <div className={className}>
      {recipes.slice(0, 2).map((r) => (
        <Card key={r.id}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>{r.name}</CardTitle>
              <p className="text-[0.8125rem] text-ink-soft">
                {r.cuisine} · {r.timeMinutes} min
              </p>
            </div>
            <ModeTag mode={r.dietMode} />
          </div>
        </Card>
      ))}
      {restaurants.slice(0, 1).map((r) => (
        <Card key={r.id}>
          <CardTitle>{r.name}</CardTitle>
          <p className="text-[0.8125rem] text-ink-soft">
            {r.area} · {r.externalRating}★ (
            {r.externalRatingCount.toLocaleString()} · Google)
          </p>
        </Card>
      ))}
    </div>
  );
}
