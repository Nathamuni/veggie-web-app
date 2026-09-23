import Link from "next/link";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { weeklyTarget, mealLogs, nextBestMeal } from "@/lib/fixtures";

export default function TransitionCentre() {
  const meatFreeDays = 4;
  const barrierLogs = mealLogs.filter((m) => m.barrier);

  return (
    <main className="flex-1 pb-8">
      <Shell>
        <Link href="/app" className="mt-5 inline-block text-ink">
          ← Home
        </Link>
        <PageTitle eyebrow="Your transition">Baseline vs. now</PageTitle>

        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
        <div>

        <Card className="mb-4">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
                Meat meals / week
              </p>
              <p className="text-[1.5rem] font-semibold">
                {weeklyTarget.baselineMeatMealsPerWeek} →{" "}
                <span className="text-turmeric">{weeklyTarget.currentMeatMealsPerWeek}</span>
              </p>
            </div>
            <span className="rounded-full bg-curry-leaf-tint px-2.5 py-1 font-mono text-[0.6875rem] text-curry-leaf">
              −3 this month
            </span>
          </div>
          <div className="mt-4">
            <ProgressBar
              value={weeklyTarget.baselineMeatMealsPerWeek - weeklyTarget.currentMeatMealsPerWeek}
              max={weeklyTarget.baselineMeatMealsPerWeek}
              label="Weekly target progress"
            />
          </div>
          <Link
            href="/app/settings#diet-mode"
            className="mt-3 inline-block text-[0.8125rem] text-ink underline underline-offset-2"
          >
            Adjust target
          </Link>
        </Card>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <Card>
            <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
              Meat-free days
            </p>
            <p className="mt-1 text-[1.25rem] font-semibold text-ink">{meatFreeDays}/7</p>
          </Card>
          <Card>
            <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
              Veg meals logged
            </p>
            <p className="mt-1 text-[1.25rem] font-semibold text-ink">
              {mealLogs.filter((m) => m.dietClassification !== "meat").length}
            </p>
            <p className="font-mono text-[0.625rem] uppercase tracking-wide text-ink-soft">
              lifetime · never resets
            </p>
          </Card>
        </div>

        <div className="mb-4">
          <CardTitle>Craving &amp; barrier analysis</CardTitle>
          <Card>
            {barrierLogs.length === 0 ? (
              <p className="text-[0.8125rem] text-ink-soft">No barriers logged this week.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {barrierLogs.map((m) => (
                  <li key={m.id} className="text-[0.8125rem]">
                    <span className="font-medium">{m.name}</span>
                    <span className="block text-ink-soft">{m.barrier}</span>
                  </li>
                ))}
              </ul>
            )}
            <Button href="/app/log" variant="secondary" className="mt-3 w-full">
              Log a barrier
            </Button>
          </Card>
        </div>

        </div>

        <aside className="xl:sticky xl:top-6 xl:self-start">
          <CardTitle>Suggested swap</CardTitle>
          <Card>
            <p className="text-[0.8125rem] text-ink-soft">
              Next time family orders chicken curry, try:
            </p>
            <p className="mt-1 font-medium">{nextBestMeal.name}</p>
            <p className="text-[0.8125rem] text-ink-soft">Same fullness, same spice level.</p>
            <Button href={`/app/recipes/${nextBestMeal.id}`} variant="secondary" className="mt-3 w-full">
              View replacement
            </Button>
            <Link
              href="/app/transition/craving"
              className="mt-3 block text-center text-[0.8125rem] text-ink underline underline-offset-2"
            >
              Craving something else? Find a swap →
            </Link>
          </Card>
        </aside>
        </div>
      </Shell>
    </main>
  );
}
