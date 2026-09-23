import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ModeTag } from "@/components/ui/ModeTag";
import { PublicChrome } from "@/components/ui/PublicChrome";
import { Shell, PageTitle } from "@/components/ui/Shell";

export const metadata: Metadata = {
  title: "How it works · Veggie",
};

const steps = [
  {
    name: "Understand",
    detail:
      "A short assessment of what you eat now, where you eat it, and why meat keeps ending up on the plate — taste, fullness, habit, cost or company.",
  },
  {
    name: "Recommend",
    detail:
      "Dishes and recipes matched to your region, cravings and chosen diet mode — at dish level, not a generic category.",
  },
  {
    name: "Eat",
    detail: "Cook it at home or find it nearby. Logging a meal takes a couple of taps.",
  },
  {
    name: "Learn",
    detail:
      "Tell us whether it satisfied you. Your feedback shapes what we suggest next.",
  },
  {
    name: "Progress",
    detail:
      "Weekly targets you set yourself. No streaks to break — a meat meal never resets anything.",
  },
  {
    name: "Impact",
    detail: "An estimate of the animal-based meals you avoided, with the method one tap away.",
  },
];

const pillars = [
  { name: "Transition", detail: "Reduce at your pace; you don't have to switch overnight." },
  { name: "Satisfaction", detail: "Taste, fullness and craving come before ideology." },
  { name: "Nutrition", detail: "Wellness support from your logged meals, never a diagnosis." },
  { name: "Discovery", detail: "Regional dishes and restaurants that feel familiar." },
  { name: "Progress", detail: "Reward what went well; an imperfect day is survivable." },
  { name: "Impact", detail: "Estimates with a visible method — never invented numbers." },
];

export default function HowItWorksPage() {
  return (
    <PublicChrome>
      <main className="flex-1 pb-10">
        <Shell>
          <PageTitle eyebrow="How it works">One satisfying meal at a time</PageTitle>
          <p className="mb-8 text-[0.9375rem] leading-relaxed text-ink-soft md:max-w-[65ch]">
            Veggie works on the reasons meat stays on the plate, rather than asking you to
            try harder.
          </p>

          <section aria-labelledby="loop-heading" className="mb-10">
            <h2 id="loop-heading" className="mb-4 text-[1.125rem] font-semibold">
              The loop
            </h2>
            <ol className="flex flex-col border-t border-hairline md:grid md:grid-cols-2 md:gap-x-8">
              {steps.map((s, i) => (
                <li key={s.name} className="flex gap-4 border-b border-hairline py-4">
                  <span className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-[0.9375rem] font-semibold">{s.name}</h3>
                    <p className="mt-1 text-[0.8125rem] leading-snug text-ink-soft">{s.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="pillars-heading" className="mb-10">
            <h2 id="pillars-heading" className="mb-4 text-[1.125rem] font-semibold">
              Six pillars
            </h2>
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {pillars.map((p) => (
                <li key={p.name}>
                  <Card className="h-full">
                    <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-wide text-ink">
                      {p.name}
                    </p>
                    <p className="text-[0.8125rem] leading-snug text-ink-soft">{p.detail}</p>
                  </Card>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="paths-heading">
            <h2 id="paths-heading" className="mb-1 text-[1.125rem] font-semibold">
              Two separate paths
            </h2>
            <p className="mb-4 text-[0.8125rem] text-ink-soft md:max-w-[65ch]">
              You choose one. Every filter, recommendation and suitability label follows it —
              the two are never blended.
            </p>
            <div className="flex flex-col gap-3 md:grid md:grid-cols-2">
              <Card>
                <ModeTag mode="vegetarian" />
                <h3 className="mt-3 text-[0.9375rem] font-semibold">Vegetarian path</h3>
                <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-[0.8125rem] text-ink-soft">
                  <li>No meat, no fish.</li>
                  <li>Dairy — and egg, if you choose — stay available.</li>
                  <li>Dishes are shown only when they suit vegetarian.</li>
                </ul>
              </Card>
              <Card>
                <ModeTag mode="vegan" />
                <h3 className="mt-3 text-[0.9375rem] font-semibold">Vegan path</h3>
                <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-[0.8125rem] text-ink-soft">
                  <li>No animal-derived foods at all, including dairy, ghee, egg and honey.</li>
                  <li>A hard filter everywhere: a vegetarian dish is not shown as vegan.</li>
                  <li>Where we can&apos;t confirm suitability, we say so.</li>
                </ul>
              </Card>
            </div>
            <p className="mt-6 text-[0.8125rem] text-ink-soft">
              Curious how impact is estimated?{" "}
              <Link href="/impact-methodology" className="text-ink underline underline-offset-2">
                Read the method
              </Link>
              .
            </p>
          </section>
        </Shell>
      </main>
    </PublicChrome>
  );
}
