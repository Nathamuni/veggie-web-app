import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ModeTag } from "@/components/ui/ModeTag";
import { resolveRouteMeal, mealQuery, weeklyTarget, nextBestMeal } from "@/lib/fixtures";

export default async function MealLoggedPage({
  params,
  searchParams,
}: {
  params: Promise<{ meal: string }>;
  searchParams: Promise<{ name?: string; diet?: string; type?: string }>;
}) {
  const { meal: id } = await params;
  const meal = resolveRouteMeal(id, await searchParams);
  if (!meal) notFound();
  const q = mealQuery(meal);
  const isMeat = meal.dietClassification === "meat";

  return (
    <main className="flex-1 pb-8">
      <Shell width="narrow">
        <Link href="/app/log" className="mt-5 inline-block text-ink">
          ← Log another
        </Link>
        <PageTitle eyebrow={id === "new" ? "Saved" : "Logged meal"}>{meal.name}</PageTitle>

        <Card className="flex items-center justify-between">
          <p className="text-[0.875rem] text-ink-soft">{meal.mealType}</p>
          {meal.dietClassification === "meat" ? (
            <ModeTag mode="warning" label="Meat" />
          ) : (
            <ModeTag mode={meal.dietClassification} />
          )}
        </Card>

        {isMeat ? (
          <div className="mt-5">
            <p className="text-[0.9375rem]">
              Logged. Your lifetime progress hasn&apos;t changed — one meal doesn&apos;t undo the{" "}
              {weeklyTarget.baselineMeatMealsPerWeek - weeklyTarget.currentMeatMealsPerWeek} fewer meat
              meals a week you&apos;re already eating.
            </p>
            <p className="mt-3 text-[0.8125rem] text-ink-soft">
              If you tell us why it happened, we can suggest something better for that situation next
              time. Completely optional.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <Button href={`/app/log/${meal.id}/barrier${q}`}>Tell us why (optional)</Button>
              <Button href="/app" variant="secondary">
                Skip
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-5">
            <p className="text-[0.9375rem]">
              How did it go? Two taps now tells us which meals actually satisfy you — that&apos;s what
              makes the next suggestion better.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <Button href={`/app/log/${meal.id}/satisfaction${q}`}>Rate this meal</Button>
              <Button href="/app" variant="secondary">
                Later
              </Button>
            </div>
          </div>
        )}

        <div className="mt-8">
          <p className="mb-2 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
            Next meal idea
          </p>
          <Link href={`/app/recipes/${nextBestMeal.id}`} className="block">
            <Card className="flex items-center justify-between">
              <span className="text-[0.9375rem] font-medium">{nextBestMeal.name}</span>
              <span aria-hidden className="text-ink-soft">→</span>
            </Card>
          </Link>
        </div>
      </Shell>
    </main>
  );
}
