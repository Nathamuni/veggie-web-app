import Link from "next/link";
import { connection } from "next/server";
import { Shell } from "@/components/ui/Shell";
import { ModeTag } from "@/components/ui/ModeTag";
import { SourceLabel, DataUnavailable } from "@/components/ui/SourceLabel";
import { user, weeklyTarget, impact, nutrition, mealLogs, recipes } from "@/lib/fixtures";
import { mealSlotForHour, rankPicks, type MealSlot } from "@/domain/recommendation/today";
import { TodayPick, type PickView } from "./_home/TodayPick";
import { NearbyNow } from "./_home/NearbyNow";

const slotNames: Record<MealSlot, string> = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner" };
const slotPick: Record<MealSlot, string> = { breakfast: "This morning's", lunch: "Today's lunch", dinner: "Tonight's" };
const greeting: Record<MealSlot, string> = { breakfast: "Good morning", lunch: "Good afternoon", dinner: "Good evening" };
const slotOrder: MealSlot[] = ["breakfast", "lunch", "dinner"];

/** Wall-clock parts in India, where every pilot user is. */
function istNow() {
  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    hourCycle: "h23",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return {
    hour: Number(get("hour")),
    weekday: get("weekday"),
    dateLabel: `${get("weekday")} ${get("day")} ${get("month")}`,
  };
}

function SectionTitle({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <h2 id={id} className="mb-2 text-[1.125rem] font-semibold">
      {children}
    </h2>
  );
}

export default async function HomeDashboard() {
  await connection(); // greeting and pick depend on the time of the request
  const now = istNow();
  const slot = mealSlotForHour(now.hour);
  const isWeekend = now.weekday === "Sat" || now.weekday === "Sun";

  const picks: PickView[] = rankPicks(
    recipes,
    {
      dietMode: user.dietMode,
      cuisines: user.cuisines,
      spice: /high|hot|fiery/i.test(user.spiceLevel) ? "fiery" : /mild|low/i.test(user.spiceLevel) ? "mild" : "medium",
      maxCookMinutes: Number(user.cookingTime.match(/(\d+)\D*$/)?.[1] ?? 45),
    },
    slot,
    isWeekend,
  ).map(({ item, reasons }) => ({
    id: item.id,
    name: item.name,
    dietMode: item.dietMode,
    meta: [`${item.timeMinutes} min`, item.cuisine, `${item.protein} protein`, `${item.spice} spice`],
    reasons,
  }));

  // Demo data: the latest logged day stands in for "today".
  const demoDay = mealLogs[0].date;
  const todayLogs = mealLogs.filter((m) => m.date === demoDay);
  const recentDishes = Array.from(
    new Set(mealLogs.filter((m) => m.dietClassification !== "meat").map((m) => m.name)),
  ).slice(0, 4);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(`${weeklyTarget.weekOf}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + i);
    return d.toISOString().slice(0, 10);
  });
  const meatFreeDays = weekDays.filter((d) => {
    const logs = mealLogs.filter((m) => m.date === d);
    return logs.length > 0 && logs.every((m) => m.dietClassification !== "meat");
  }).length;

  const { baselineMeatMealsPerWeek: baseline, currentMeatMealsPerWeek: current, targetMeatMealsPerWeek: target } =
    weeklyTarget;
  const protein = nutrition.today.find((n) => n.nutrient === "Protein");
  const fibre = nutrition.today.find((n) => n.nutrient === "Fibre");
  const lowNutrients = nutrition.today.filter((n) => n.status === "low" && n.value).map((n) => n.nutrient.toLowerCase());
  const pickSlotLabel = slotPick[slot];

  return (
    <main className="flex-1 pb-8">
      <Shell>
        {/* Greeting: what time it is, and what's next */}
        <header className="mb-5 mt-6 xl:mb-8 xl:mt-10">
          <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
            {now.dateLabel} · {slotNames[slot]} is next
          </p>
          <h1 className="mt-1 text-[clamp(1.75rem,5vw,2.25rem)] font-semibold leading-tight tracking-tight">
            {greeting[slot]}, {user.displayName}.
          </h1>
        </header>

        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start xl:gap-10">
          {/* Primary column: decide, then record */}
          <div className="flex min-w-0 flex-col gap-8">
            {picks.length > 0 ? (
              <TodayPick picks={picks} slotLabel={pickSlotLabel} />
            ) : (
              <p className="rounded-[6px] border border-dashed border-hairline bg-surface px-4 py-6 text-[0.9375rem]">
                No recipe fits your settings yet.{" "}
                <Link href="/app/recipes" className="underline underline-offset-4">
                  Browse recipes
                </Link>
              </p>
            )}

            <section aria-labelledby="plate-title">
              <div className="mb-2 flex items-baseline justify-between">
                <SectionTitle id="plate-title">Today&apos;s plate</SectionTitle>
                <Link href="/app/log" className="text-[0.8125rem] underline underline-offset-4">
                  Log a meal
                </Link>
              </div>
              <ol className="divide-y divide-hairline rounded-[6px] border border-hairline bg-surface">
                {slotOrder.map((s) => {
                  const logged = todayLogs.filter((m) => m.mealType === slotNames[s]);
                  const isPast = slotOrder.indexOf(s) < slotOrder.indexOf(slot);
                  return (
                    <li key={s} className="flex min-h-14 items-center gap-4 px-4 py-2.5">
                      <span className="w-20 shrink-0 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
                        {slotNames[s]}
                      </span>
                      {logged.length > 0 ? (
                        <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                          <Link href={`/app/log/${logged[0].id}`} className="min-w-0 text-[0.9375rem] hover:underline">
                            {logged.map((m) => m.name).join(" + ")}
                          </Link>
                          {logged[0].dietClassification === "meat" ? (
                            <ModeTag mode="warning" label="Meat" />
                          ) : (
                            <ModeTag mode={logged[0].dietClassification} />
                          )}
                        </span>
                      ) : s === slot ? (
                        <span className="text-[0.9375rem] text-ink-soft">Up next — your pick is above</span>
                      ) : isPast ? (
                        <Link
                          href="/app/log"
                          className="text-[0.9375rem] text-ink underline underline-offset-4"
                        >
                          Not logged — add it
                        </Link>
                      ) : (
                        <span className="text-[0.9375rem] text-ink-soft">Later</span>
                      )}
                    </li>
                  );
                })}
              </ol>

              {recentDishes.length > 0 ? (
                <div className="mt-4">
                  <p className="mb-2 text-[0.8125rem] font-medium">Just ate? One tap to log it again</p>
                  <ul className="flex flex-wrap gap-2">
                    {recentDishes.map((name) => (
                      <li key={name}>
                        <Link
                          href={`/app/log?dish=${encodeURIComponent(name)}`}
                          className="inline-flex min-h-11 items-center rounded-full border border-hairline bg-surface px-3.5 text-[0.8125rem] transition-colors hover:border-ink-soft"
                        >
                          {name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>

            <nav aria-label="Other ways to decide" className="divide-y divide-hairline border-y border-hairline">
              <Link href="/app/transition/craving" className="flex min-h-14 items-center justify-between gap-3 py-3 hover:text-ink-soft">
                <span>
                  <span className="block text-[0.9375rem] font-medium">Craving meat?</span>
                  <span className="block text-[0.8125rem] text-ink-soft">Find a swap that keeps the taste and fullness</span>
                </span>
                <span aria-hidden>→</span>
              </Link>
              <Link href="/app/complete-meal" className="flex min-h-14 items-center justify-between gap-3 py-3 hover:text-ink-soft">
                <span>
                  <span className="block text-[0.9375rem] font-medium">Already know what you&apos;re eating?</span>
                  <span className="block text-[0.8125rem] text-ink-soft">Make it more filling with the right sides</span>
                </span>
                <span aria-hidden>→</span>
              </Link>
            </nav>
          </div>

          {/* Supporting column: how it's going */}
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
              <p className="mt-3 text-[0.9375rem]">
                <span className="font-mono text-[1.25rem] font-semibold">{current}</span> meat meals · target{" "}
                <span className="font-mono">{target}</span>
              </p>
              <div
                role="img"
                aria-label={`${current} meat meals this week, target ${target}, starting point ${baseline}`}
                className="relative mt-3 h-2.5 rounded-full bg-paper"
              >
                <div className="h-full rounded-full bg-turmeric" style={{ width: `${(current / baseline) * 100}%` }} />
                <div
                  aria-hidden
                  className="absolute -top-1 h-4.5 w-0.5 bg-ink"
                  style={{ left: `calc(${(target / baseline) * 100}% - 1px)` }}
                />
              </div>
              <p className="mt-2 flex justify-between font-mono text-[0.6875rem] text-ink-soft">
                <span>0</span>
                <span>started at {baseline}/wk</span>
              </p>
              <p className="mt-3 text-[0.875rem] text-ink-soft">
                {baseline - current} fewer than when you started · {meatFreeDays} meat-free{" "}
                {meatFreeDays === 1 ? "day" : "days"}. A meat meal never resets this.
              </p>
            </section>

            <NearbyNow city={user.city} area={user.area} />

            <section aria-labelledby="impact-title" className="md:col-span-2 xl:col-span-1">
              <SectionTitle id="impact-title">Your numbers</SectionTitle>
              <dl className="divide-y divide-hairline rounded-[6px] border border-hairline bg-surface">
                <div className="flex items-baseline justify-between gap-3 px-4 py-3">
                  <dt className="text-[0.875rem]">Animal-based meals avoided</dt>
                  <dd className="flex shrink-0 flex-col items-end">
                    <span className="font-mono text-[1.125rem] font-semibold">{impact.animalMealsAvoidedTotal}</span>
                    <Link href="/app/impact" className="whitespace-nowrap font-mono text-[0.6875rem] uppercase text-ink-soft underline">
                      estimate · how?
                    </Link>
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 px-4 py-3">
                  <dt className="text-[0.875rem]">Protein today</dt>
                  <dd>
                    {protein?.value ? (
                      <span className="font-mono text-[0.9375rem]">
                        {protein.value} <SourceLabel>· {protein.source}</SourceLabel>
                      </span>
                    ) : (
                      <DataUnavailable />
                    )}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 px-4 py-3">
                  <dt className="text-[0.875rem]">Fibre today</dt>
                  <dd>
                    {fibre?.value ? (
                      <span className="font-mono text-[0.9375rem]">
                        {fibre.value} <SourceLabel>· {fibre.source}</SourceLabel>
                      </span>
                    ) : (
                      <DataUnavailable />
                    )}
                  </dd>
                </div>
                {lowNutrients.length > 0 ? (
                  <p className="px-4 py-3 text-[0.8125rem] text-ink-soft">
                    Your logged meals appear low in {lowNutrients.join(" and ")} today.{" "}
                    <Link href="/app/nutrition" className="text-ink underline underline-offset-4">
                      Foods that help
                    </Link>
                  </p>
                ) : null}
              </dl>
              <p className="mt-1.5 font-mono text-[0.625rem] uppercase tracking-wide text-ink-soft">
                Nutrition from {nutrition.dataQuality} logs · wellness guide, not diagnosis
              </p>
            </section>
          </div>
        </div>
      </Shell>
    </main>
  );
}
