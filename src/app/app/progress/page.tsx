import Link from "next/link";
import { Shell } from "@/components/ui/Shell";
import { Card } from "@/components/ui/Card";
import { weeklyTarget, progressTrend, dietBaseline, impact } from "@/lib/fixtures";
import { ShareSummary } from "./ShareSummary";

const timeframes = ["Week", "Month", "Lifetime"];

export default function ProgressCentre() {
  const max = Math.max(...progressTrend.map((p) => p.meatMeals));
  const successfulSwaps = 6;
  const satisfactionTrend = "+0.4★ vs. baseline";

  return (
    <main className="flex-1 pb-8">
      <Shell>
        <Link href="/app" className="mt-5 inline-block text-ink">
          ← Home
        </Link>
        <div className="mt-5 flex items-center justify-between">
          <h1 className="text-[1.5rem] font-semibold tracking-tight">Progress</h1>
          <div className="flex gap-1">
            {timeframes.map((t) => (
              <span
                key={t}
                className={`rounded-full border px-2.5 py-1 text-[0.75rem] ${
                  t === "Month"
                    ? "border-2 border-ink font-medium"
                    : "border-hairline text-ink-soft"
                }`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <Card className="mb-4 mt-4">
          <p className="mb-3 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
            Baseline vs. now — meat meals/week
          </p>
          <div className="flex h-24 items-end gap-3 xl:h-44 xl:gap-5">
            {progressTrend.map((p, i) => (
              <div key={p.week} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex h-20 w-full items-end justify-center xl:h-36">
                  <div
                    className={`w-full rounded-t-[3px] ${
                      i === progressTrend.length - 1 ? "bg-turmeric" : "bg-ink-soft/30"
                    }`}
                    style={{ height: `${(p.meatMeals / max) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-[0.625rem] text-ink-soft">{p.week}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <Stat label="Meat meals reduced" value={`${weeklyTarget.baselineMeatMealsPerWeek - weeklyTarget.currentMeatMealsPerWeek}/wk`} />
          <Stat label="Vegetarian meals" value={`${dietBaseline.mealsPerWeek.vegetarian}/wk`} />
          <Stat label="Vegan meals" value={`${dietBaseline.mealsPerWeek.vegan}/wk`} />
          <Stat label="Meat-free days" value="4/7" />
          <Stat label="Successful swaps" value={String(successfulSwaps)} />
          <Stat label="Satisfaction trend" value={satisfactionTrend} />
        </div>

        <Link href="/app/impact" className="mt-6 block">
          <Card className="flex items-center justify-between transition-colors hover:border-ink-soft">
            <span>
              <span className="block text-[0.9375rem] font-medium">
                {impact.animalMealsAvoidedTotal} animal-based meals avoided
              </span>
              <span className="block text-[0.8125rem] text-ink-soft">Estimated impact, with the method</span>
            </span>
            <span aria-hidden className="text-ink-soft">→</span>
          </Card>
        </Link>

        <ShareSummary
          text={`Veggie: ${weeklyTarget.baselineMeatMealsPerWeek} → ${weeklyTarget.currentMeatMealsPerWeek} meat meals a week, ${impact.animalMealsAvoidedTotal} animal-based meals avoided (estimate).`}
        />
      </Shell>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="mt-1 text-[1.125rem] font-semibold text-ink">{value}</p>
    </Card>
  );
}
