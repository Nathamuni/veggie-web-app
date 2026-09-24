import { OnboardingStep } from "@/components/ui/OnboardingStep";
import { ModeTag } from "@/components/ui/ModeTag";
import { requireUser } from "@/lib/auth/session";
import { findCity } from "@/lib/locations";
import { ONBOARDING_STEPS, goalLabel } from "@/lib/profile-options";
import { picksFor } from "@/lib/data/picks";
import { istNow, SLOT_LABEL } from "@/lib/time";
import { completeOnboarding } from "@/app/actions/profile";
import { GoalStep, PlaceStep, TasteStep, WeekStep, type ProfileView } from "./StepForm";

const steps = {
  1: { title: "Let's set up Veggie around you", subtitle: "Two quick choices. You can change anything later in Settings." },
  2: { title: "Your week, in meals", subtitle: "We count progress in meals, not days — so one meal is always a win." },
  3: { title: "What you like to eat", subtitle: "Suggestions start from the food you already love." },
  4: { title: "Where do you usually eat?", subtitle: "For veg-friendly places near you." },
} as const;

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ step?: string }> }) {
  const user = await requireUser();
  const p = user.profile;
  const furthest = Math.min(p.onboardingStep + 1, ONBOARDING_STEPS + 1);
  const requested = Number((await searchParams).step) || furthest;
  const step = Math.max(1, Math.min(requested, furthest));

  const view: ProfileView = {
    goal: p.goal,
    dietMode: p.dietMode,
    baselineMeatMeals: p.baselineMeatMeals,
    weeklyPlantTarget: p.weeklyPlantTarget,
    cuisines: p.cuisines,
    spice: p.spice,
    maxCookMinutes: p.maxCookMinutes,
    city: p.city,
    area: p.area ?? findCity(p.city ?? "Chennai")?.areas[0] ?? null,
  };

  if (step <= ONBOARDING_STEPS) {
    const s = step as 1 | 2 | 3 | 4;
    const Form = { 1: GoalStep, 2: WeekStep, 3: TasteStep, 4: PlaceStep }[s];
    return (
      <OnboardingStep
        step={s}
        total={ONBOARDING_STEPS}
        back={s > 1 ? `/onboarding?step=${s - 1}` : undefined}
        title={steps[s].title}
        subtitle={steps[s].subtitle}
      >
        <Form profile={view} />
      </OnboardingStep>
    );
  }

  // Finish: the first week, with one concrete thing to do right now.
  const now = istNow();
  const { picks } = await picksFor(user.id, p, now.slot, now.isWeekend, 3);
  const first = picks[0]?.item;

  return (
    <OnboardingStep
      back={`/onboarding?step=${ONBOARDING_STEPS}`}
      title={user.displayName ? `You're set, ${user.displayName}.` : "You're set."}
      subtitle="Here's your first week. No streaks to break — every plant meal counts."
    >
      <dl className="mb-6 grid grid-cols-2 divide-x divide-hairline rounded-[6px] border border-hairline bg-surface">
        <div className="px-4 py-3">
          <dt className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">Your goal</dt>
          <dd className="mt-1 text-[0.9375rem] font-medium">{goalLabel(p.goal)}</dd>
        </div>
        <div className="px-4 py-3">
          <dt className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">This week</dt>
          <dd className="mt-1 text-[0.9375rem] font-medium">
            <span className="font-mono text-turmeric">{p.weeklyPlantTarget}</span> plant meals
          </dd>
        </div>
      </dl>

      <h2 className="mb-2 text-[1.125rem] font-semibold">Three dishes picked for you</h2>
      <ol className="mb-6 divide-y divide-hairline rounded-[6px] border border-hairline bg-surface">
        {picks.map(({ item, reasons }, i) => (
          <li key={item.id} className="flex items-start gap-3 px-4 py-3">
            <span className="font-mono text-[0.8125rem] text-ink-soft">{i + 1}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.9375rem] font-medium">{item.name}</span>
              <span className="block text-[0.8125rem] text-ink-soft">
                {item.timeMinutes} min{reasons[0] ? ` · ${reasons[0]}` : ` · ${item.cuisine}`}
              </span>
            </span>
            <ModeTag mode={item.dietMode} />
          </li>
        ))}
      </ol>

      <form action={completeOnboarding} className="flex flex-col gap-2">
        {first ? (
          <button
            type="submit"
            name="next"
            value={`/app/recipes/${first.id}`}
            className="inline-flex min-h-12 flex-col items-center justify-center rounded-[4px] bg-turmeric px-5 py-3 text-surface transition-colors hover:bg-turmeric-deep"
          >
            <span className="text-[0.9375rem] font-semibold">
              Cook {now.slot === "breakfast" ? "this morning" : now.slot === "lunch" ? "for lunch" : "tonight"}: {first.name}
            </span>
            <span className="text-[0.8125rem] opacity-90">{first.timeMinutes} min · full recipe with every step</span>
          </button>
        ) : null}
        <button
          type="submit"
          name="next"
          value="/app/discover"
          className="inline-flex min-h-12 items-center justify-center rounded-[4px] border border-hairline bg-surface px-5 py-3 text-[0.9375rem] font-semibold transition-colors hover:border-ink-soft"
        >
          Eat out near {p.area ?? "you"} instead
        </button>
        <button type="submit" name="next" value="/app" className="min-h-11 text-[0.875rem] underline underline-offset-4">
          Go to Today
        </button>
      </form>
      <p className="mt-4 text-center text-[0.8125rem] text-ink-soft">
        {SLOT_LABEL[now.slot]} is next. After you eat, tap <strong>＋ Log</strong> — it takes two taps.
      </p>
    </OnboardingStep>
  );
}
