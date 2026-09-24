import Link from "next/link";
import { Shell } from "@/components/ui/Shell";
import { ModeTag } from "@/components/ui/ModeTag";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { requireOnboardedUser } from "@/lib/auth/session";
import { picksFor } from "@/lib/data/picks";
import { recentMealLogs } from "@/lib/data/food";
import { istDate, weekStartOf, weeklyProgress } from "@/domain/journey/week";
import { istNow, SLOT_LABEL } from "@/lib/time";
import { TodayPick, type PickView } from "./_home/TodayPick";
import { NearbyNow } from "./_home/NearbyNow";

const slotPick = { breakfast: "This morning's", lunch: "Today's lunch", dinner: "Tonight's" } as const;
const greeting = { breakfast: "Good morning", lunch: "Good afternoon", dinner: "Good evening" } as const;
const slotOrder = ["breakfast", "lunch", "dinner"] as const;

export default async function TodayPage() {
  const user = await requireOnboardedUser();
  const p = user.profile;
  const now = istNow();
  const today = istDate();

  const [{ picks }, logs] = await Promise.all([picksFor(user.id, p, now.slot, now.isWeekend, 5), recentMealLogs(user.id, 1)]);

  const pickViews: PickView[] = picks.map(({ item, reasons }) => ({
    id: item.id,
    name: item.name,
    dietMode: item.dietMode,
    meta: [`${item.timeMinutes} min`, item.cuisine, `${item.protein} protein`, `${item.spice} spice`],
    reasons,
  }));

  const week = weeklyProgress(logs, p.weeklyPlantTarget, weekStartOf(today));
  const todayLogs = logs.filter((l) => l.eatenOn === today);
  const name = user.displayName ?? "there";

  return (
    <main className="flex-1 pb-8">
      <Shell>
        <header className="mb-5 mt-6 xl:mb-8 xl:mt-10">
          <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
            {now.dateLabel} · {SLOT_LABEL[now.slot]} is next
          </p>
          <h1 className="mt-1 text-[clamp(1.75rem,5vw,2.25rem)] font-semibold leading-tight tracking-tight">
            {greeting[now.slot]}, {name}.
          </h1>
        </header>

        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start xl:gap-10">
          {/* Decide, then record */}
          <div className="flex min-w-0 flex-col gap-8">
            {pickViews.length > 0 ? (
              <TodayPick picks={pickViews} slotLabel={slotPick[now.slot]} />
            ) : (
              <p className="rounded-[6px] border border-dashed border-hairline bg-surface px-4 py-6 text-[0.9375rem]">
                No recipe fits your settings yet.{" "}
                <Link href="/app/recipes" className="underline underline-offset-4">
                  Browse all recipes
                </Link>
              </p>
            )}

            <section aria-labelledby="plate-title">
              <div className="mb-2 flex items-baseline justify-between">
                <h2 id="plate-title" className="text-[1.125rem] font-semibold">
                  Today&apos;s plate
                </h2>
                <Link href="/app/log" className="text-[0.8125rem] underline underline-offset-4">
                  ＋ Log a meal
                </Link>
              </div>
              <ol className="divide-y divide-hairline rounded-[6px] border border-hairline bg-surface">
                {slotOrder.map((s) => {
                  const logged = todayLogs.filter((m) => m.slot === s);
                  const isPast = slotOrder.indexOf(s) < slotOrder.indexOf(now.slot);
                  return (
                    <li key={s} className="flex min-h-14 items-center gap-4 px-4 py-2.5">
                      <span className="w-20 shrink-0 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
                        {SLOT_LABEL[s]}
                      </span>
                      {logged.length > 0 ? (
                        <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                          <span className="min-w-0 text-[0.9375rem]">{logged.map((m) => m.name).join(" + ")}</span>
                          {logged[0].diet === "meat" ? <ModeTag mode="neutral" label="Meat" /> : <ModeTag mode={logged[0].diet} />}
                        </span>
                      ) : s === now.slot ? (
                        <span className="text-[0.9375rem] text-ink-soft">Up next — your pick is above</span>
                      ) : isPast ? (
                        <Link href="/app/log" className="text-[0.9375rem] underline underline-offset-4">
                          Not logged — add it
                        </Link>
                      ) : (
                        <span className="text-[0.9375rem] text-ink-soft">Later</span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          </div>

          {/* How it's going */}
          <div className="mt-8 flex flex-col gap-8 md:grid md:grid-cols-2 md:gap-6 xl:mt-0 xl:flex xl:flex-col xl:gap-8">
            <section aria-labelledby="week-title" className="rounded-[6px] border border-hairline bg-surface p-4">
              <div className="flex items-baseline justify-between">
                <h2 id="week-title" className="text-[1.125rem] font-semibold">
                  This week
                </h2>
                <Link href="/app/progress" className="text-[0.8125rem] underline underline-offset-4">
                  Progress
                </Link>
              </div>
              <div className="mt-3 flex items-center gap-4">
                <ProgressRing
                  value={week.plantMeals}
                  max={week.target}
                  size={84}
                  label={`${week.plantMeals} of ${week.target} plant meals this week`}
                />
                <p className="text-[0.875rem] text-ink-soft">
                  {week.totalMeals === 0
                    ? "Your first log starts the week. Every plant meal counts."
                    : week.hit
                      ? "Goal reached — anything more is a bonus."
                      : `${week.remaining} more plant ${week.remaining === 1 ? "meal" : "meals"} to reach your goal.`}
                  {week.meatMeals > 0 ? ` ${week.meatMeals} with meat — that never resets anything.` : ""}
                </p>
              </div>
            </section>

            {p.city && p.area ? <NearbyNow city={p.city} area={p.area} /> : null}
          </div>
        </div>
      </Shell>
    </main>
  );
}
