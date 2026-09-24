import Link from "next/link";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { ModeTag } from "@/components/ui/ModeTag";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireOnboardedUser } from "@/lib/auth/session";
import { recentMealLogs } from "@/lib/data/food";
import { addDays, istDate, isPlant, suggestedNextTarget, weekStartOf, weeklyProgress, weeklyTrend } from "@/domain/journey/week";
import { SLOT_LABEL } from "@/lib/time";
import { deleteMeal } from "@/app/actions/meals";
import { setWeeklyTarget } from "@/app/actions/profile";
import { ShareSummary } from "./ShareSummary";

function dayLabel(date: string, today: string) {
  if (date === today) return "Today";
  if (date === addDays(today, -1)) return "Yesterday";
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
}

function shortWeek(weekStart: string) {
  return new Date(`${weekStart}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });
}

export default async function ProgressPage() {
  const user = await requireOnboardedUser();
  const target = user.profile.weeklyPlantTarget;
  const today = istDate();
  const logs = await recentMealLogs(user.id, 8);

  const thisWeek = weeklyProgress(logs, target, weekStartOf(today));
  const lastWeekStart = addDays(weekStartOf(today), -7);
  const lastWeek = weeklyProgress(logs, target, lastWeekStart);
  const trend = weeklyTrend(logs, today, target, 8);
  const maxBar = Math.max(target, ...trend.map((w) => w.totalMeals), 1);

  // Weekly summary: the finished week (or this one from Saturday on).
  const dow = new Date(`${today}T00:00:00Z`).getUTCDay();
  const summaryWeek = dow === 0 || dow === 6 || lastWeek.totalMeals === 0 ? thisWeek : lastWeek;
  const summaryLabel = summaryWeek === thisWeek ? "This week so far" : `Week of ${shortWeek(summaryWeek.weekStart)}`;
  const summaryLogs = logs.filter((l) => l.eatenOn >= summaryWeek.weekStart && l.eatenOn < addDays(summaryWeek.weekStart, 7));
  const topDishes = Object.entries(
    summaryLogs.filter((l) => isPlant(l.diet)).reduce<Record<string, number>>((acc, l) => ((acc[l.name] = (acc[l.name] ?? 0) + 1), acc), {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  const nextTarget = suggestedNextTarget(summaryWeek);

  const byDay = logs.reduce<Map<string, typeof logs>>((m, l) => m.set(l.eatenOn, [...(m.get(l.eatenOn) ?? []), l]), new Map());

  return (
    <main className="flex-1 pb-8">
      <Shell>
        <PageTitle eyebrow="Counted in meals, never streaks">Progress</PageTitle>

        <div className="flex flex-col gap-8 xl:grid xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start xl:gap-10">
          <div className="flex min-w-0 flex-col gap-8">
            <section aria-labelledby="week-title" className="rounded-[6px] border border-hairline bg-surface p-5">
              <h2 id="week-title" className="sr-only">
                This week
              </h2>
              <div className="flex flex-wrap items-center gap-5">
                <ProgressRing
                  value={thisWeek.plantMeals}
                  max={target}
                  size={120}
                  label={`${thisWeek.plantMeals} of ${target} plant meals this week`}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">This week</p>
                  <p className="text-[1.375rem] font-semibold leading-tight">
                    {thisWeek.hit ? "Goal reached 🎉" : `${thisWeek.remaining} to go`}
                  </p>
                  <dl className="mt-3 flex gap-6 text-[0.875rem]">
                    <div>
                      <dt className="text-ink-soft">Plant meals</dt>
                      <dd className="font-mono text-[1.125rem] font-semibold">{thisWeek.plantMeals}</dd>
                    </div>
                    <div>
                      <dt className="text-ink-soft">With meat</dt>
                      <dd className="font-mono text-[1.125rem] font-semibold">{thisWeek.meatMeals}</dd>
                    </div>
                    <div>
                      <dt className="text-ink-soft">Goal</dt>
                      <dd className="font-mono text-[1.125rem] font-semibold">{target}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </section>

            <section aria-labelledby="trend-title">
              <h2 id="trend-title" className="mb-1 text-[1.125rem] font-semibold">
                Last 8 weeks
              </h2>
              <p className="mb-3 flex gap-4 text-[0.8125rem] text-ink-soft">
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden className="h-2.5 w-2.5 rounded-sm bg-turmeric" /> Plant meals
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden className="h-2.5 w-2.5 rounded-sm bg-hairline" /> With meat
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden className="h-0 w-3 border-t-2 border-dashed border-ink" /> Goal
                </span>
              </p>
              <div className="relative rounded-[6px] border border-hairline bg-surface px-3 pb-2 pt-4">
                <div className="relative flex h-36 items-end gap-2">
                  <div
                    aria-hidden
                    className="absolute inset-x-0 border-t-2 border-dashed border-ink/60"
                    style={{ bottom: `${(target / maxBar) * 100}%` }}
                  />
                  {trend.map((w) => (
                    <div
                      key={w.weekStart}
                      className="flex h-full flex-1 flex-col justify-end"
                      title={`Week of ${shortWeek(w.weekStart)}: ${w.plantMeals} plant, ${w.meatMeals} with meat`}
                    >
                      <div className="bg-hairline" style={{ height: `${(w.meatMeals / maxBar) * 100}%` }} />
                      <div className="rounded-t-[2px] bg-turmeric" style={{ height: `${(w.plantMeals / maxBar) * 100}%` }} />
                    </div>
                  ))}
                </div>
                <div className="mt-1.5 flex gap-2">
                  {trend.map((w, k) => (
                    <span key={w.weekStart} className="flex-1 text-center font-mono text-[0.625rem] text-ink-soft">
                      {k === trend.length - 1 ? "Now" : shortWeek(w.weekStart)}
                    </span>
                  ))}
                </div>
              </div>
              <table className="sr-only">
                <caption>Plant and meat meals per week</caption>
                <tbody>
                  {trend.map((w) => (
                    <tr key={w.weekStart}>
                      <th>{shortWeek(w.weekStart)}</th>
                      <td>{w.plantMeals} plant</td>
                      <td>{w.meatMeals} with meat</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section aria-labelledby="history-title">
              <h2 id="history-title" className="mb-2 text-[1.125rem] font-semibold">
                Your meals
              </h2>
              {logs.length === 0 ? (
                <EmptyState
                  title="No meals logged yet"
                  reason="Log what you eat — plant or not — and your weeks will fill in here."
                  actionHref="/app/log"
                  actionLabel="＋ Log today's meal"
                />
              ) : (
                <div className="flex flex-col gap-4">
                  {[...byDay.entries()].slice(0, 14).map(([date, items]) => (
                    <div key={date}>
                      <h3 className="mb-1 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">{dayLabel(date, today)}</h3>
                      <ul className="divide-y divide-hairline rounded-[6px] border border-hairline bg-surface">
                        {items.map((l) => (
                          <li key={l.id} className="flex min-h-14 items-center gap-3 py-2 pl-4 pr-1">
                            <span className="min-w-0 flex-1">
                              <span className="block font-mono text-[0.625rem] uppercase tracking-wide text-ink-soft">{SLOT_LABEL[l.slot]}</span>
                              {l.recipeId ? (
                                <Link href={`/app/recipes/${l.recipeId}`} className="text-[0.9375rem] hover:underline">
                                  {l.name}
                                </Link>
                              ) : (
                                <span className="text-[0.9375rem]">{l.name}</span>
                              )}
                              {l.liked !== null ? <span className="ml-2" aria-label={l.liked ? "liked" : "didn't like"}>{l.liked ? "👍" : "👎"}</span> : null}
                            </span>
                            {l.diet === "meat" ? <ModeTag mode="neutral" label="Meat" /> : <ModeTag mode={l.diet} />}
                            <form action={deleteMeal}>
                              <input type="hidden" name="logId" value={l.id} />
                              <button
                                type="submit"
                                aria-label={`Delete ${l.name}`}
                                className="flex h-10 w-10 items-center justify-center rounded-[4px] text-ink-soft hover:bg-rust-tint hover:text-rust"
                              >
                                ✕
                              </button>
                            </form>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="flex flex-col gap-6 xl:sticky xl:top-6">
            <section aria-labelledby="summary-title" className="rounded-[6px] border border-hairline bg-surface p-5">
              <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
                Weekly summary · {summaryLabel}
              </p>
              <h2 id="summary-title" className="mt-1 text-[1.25rem] font-semibold leading-tight">
                {summaryWeek.totalMeals === 0
                  ? "A fresh week"
                  : summaryWeek.hit
                    ? `You hit your goal with ${summaryWeek.plantMeals} plant meals`
                    : `${summaryWeek.plantMeals} plant meals — every one counts`}
              </h2>
              {topDishes.length > 0 ? (
                <>
                  <p className="mt-4 text-[0.8125rem] font-medium">Your top dishes</p>
                  <ol className="mt-1 list-decimal pl-5 text-[0.9375rem]">
                    {topDishes.map(([name, count]) => (
                      <li key={name}>
                        {name} <span className="font-mono text-[0.75rem] text-ink-soft">×{count}</span>
                      </li>
                    ))}
                  </ol>
                </>
              ) : (
                <p className="mt-2 text-[0.875rem] text-ink-soft">Log a few meals and your highlights will show up here.</p>
              )}
              {nextTarget > target ? (
                <form action={setWeeklyTarget} className="mt-5 border-t border-hairline pt-4">
                  <p className="mb-2 text-[0.875rem]">Ready for one more? Try {nextTarget} plant meals next week.</p>
                  <input type="hidden" name="target" value={nextTarget} />
                  <button
                    type="submit"
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-[4px] bg-turmeric px-4 text-[0.9375rem] font-semibold text-surface hover:bg-turmeric-deep"
                  >
                    Raise my goal to {nextTarget}
                  </button>
                </form>
              ) : null}
              <p className="mt-4 text-[0.8125rem]">
                <Link href="/app/recipes" className="underline underline-offset-4">
                  Plan next week&apos;s meals →
                </Link>
              </p>
            </section>

            {thisWeek.totalMeals > 0 ? (
              <ShareSummary text={`This week on Veggie: ${thisWeek.plantMeals} plant-based meals (goal ${target}).`} />
            ) : null}
          </aside>
        </div>
      </Shell>
    </main>
  );
}
