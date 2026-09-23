import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Shell } from "@/components/ui/Shell";
import { StepProgress } from "@/components/ui/ProgressBar";
import { Card } from "@/components/ui/Card";
import { user, dietBaseline, weeklyTarget, recipes } from "@/lib/fixtures";

const starters = recipes.slice(0, 3);

function Row({
  label,
  value,
  editHref,
}: {
  label: string;
  value: string;
  editHref: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-hairline py-2.5 last:border-0">
      <span className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-[0.875rem] font-medium">{value}</span>
        <Link
          href={editHref}
          className="text-[0.75rem] text-ink-soft underline"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}

export default function PlanSummaryStep() {
  const meatMealsNow = Object.entries(dietBaseline.mealsPerWeek)
    .filter(([k]) => k === "redMeat" || k === "chicken" || k === "fish")
    .reduce((a, [, v]) => a + v, 0);

  return (
    <main className="flex-1 pb-16">
      <Shell width="narrow">
        {/* md+: same hairline sheet as the other onboarding steps (OnboardingStep). */}
        <div className="md:mt-12 md:rounded-[6px] md:border md:border-hairline md:bg-surface md:px-8 md:pb-8">
          <div className="flex items-center gap-3 pt-5 md:pt-8">
            <Link
              href="/onboarding/location"
              aria-label="Back"
              className="text-ink"
            >
              ←
            </Link>
            <div className="flex-1">
              <StepProgress step={7} total={7} />
            </div>
          </div>

          <h1 className="mb-5 mt-5 text-[1.5rem] font-semibold leading-tight tracking-tight">
            Here&rsquo;s what we understood
          </h1>

          <Card className="mb-4 md:bg-paper">
            <Row label="Goal" value={user.goal} editHref="/onboarding/goal" />
            <Row label="Mode" value="Vegetarian" editHref="/onboarding/diet" />
            <Row
              label="Now"
              value={`${meatMealsNow} meat meals/wk`}
              editHref="/onboarding/baseline"
            />
            <Row
              label="Cuisine"
              value={user.cuisines.join(", ")}
              editHref="/onboarding/cuisine"
            />
            <Row
              label="Budget"
              value={user.budgetBand}
              editHref="/onboarding/preferences"
            />
          </Card>

          <Card className="mb-4 md:bg-paper">
            <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
              Week 1 target
            </p>
            <p className="text-[1.25rem] font-semibold">
              {weeklyTarget.baselineMeatMealsPerWeek} →{" "}
              <span className="text-turmeric">
                {weeklyTarget.targetMeatMealsPerWeek}
              </span>{" "}
              meat meals
            </p>
            <p className="mt-1 text-[0.8125rem] text-ink-soft">
              Small, on purpose.
            </p>
          </Card>

          <div className="mb-4">
            <p className="mb-2 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
              Start with
            </p>
            <div className="flex flex-col gap-2">
              {starters.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-2 text-[0.875rem]"
                >
                  <span className="text-ink-soft">▸</span> {r.name}
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/app/impact"
            className="mb-6 block text-[0.8125rem] text-ink-soft underline"
          >
            ⓘ How we estimate impact
          </Link>

          <Button href="/app" className="w-full">
            Start Veggie
          </Button>
        </div>
      </Shell>
    </main>
  );
}
