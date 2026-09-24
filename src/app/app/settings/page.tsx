import Link from "next/link";
import type { ReactNode } from "react";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { requireOnboardedUser } from "@/lib/auth/session";
import { findCity } from "@/lib/locations";
import { signOut, deleteAccount } from "@/app/actions/auth";
import { GoalStep, PlaceStep, TasteStep, WeekStep, type ProfileView } from "@/app/onboarding/StepForm";
import { NameForm } from "./NameForm";

const previews = [
  { href: "/app/transition/craving", label: "I'm craving…", hint: "Swaps for a meat dish you miss" },
  { href: "/app/meal-plan", label: "Meal plan", hint: "Plan the week ahead" },
  { href: "/app/pantry", label: "Pantry", hint: "Cook from what you have" },
  { href: "/app/learn", label: "Learn", hint: "Short reads on protein, cost and more" },
  { href: "/app/assistant", label: "Ask Veggie", hint: "An assistant for food questions" },
];

function Section({ id, title, hint, children }: { id: string; title: string; hint?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-6 border-t border-hairline py-6">
      <h2 id={`${id}-title`} className="text-[1.125rem] font-semibold">
        {title}
      </h2>
      {hint ? <p className="mt-0.5 text-[0.8125rem] text-ink-soft">{hint}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ delete?: string }> }) {
  const user = await requireOnboardedUser();
  const { delete: del } = await searchParams;
  const p = user.profile;
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

  return (
    <main className="flex-1 pb-8">
      <Shell width="narrow">
        <PageTitle eyebrow={user.email}>Me</PageTitle>

        <nav aria-label="Settings sections" className="-mx-4 mb-2 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:px-0">
          {[
            ["profile", "Profile"],
            ["diet-mode", "Goal & diet"],
            ["week", "Weekly goal"],
            ["taste", "Taste"],
            ["location", "Location"],
            ["account", "Account"],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} className="inline-flex min-h-10 shrink-0 items-center rounded-full border border-hairline bg-surface px-3.5 text-[0.8125rem] hover:border-ink-soft">
              {label}
            </a>
          ))}
        </nav>

        <Section id="profile" title="Profile">
          <NameForm defaultName={user.displayName ?? ""} />
        </Section>
        <Section id="diet-mode" title="Goal & diet" hint="Vegan mode never shows dishes with dairy.">
          <GoalStep profile={view} mode="settings" />
        </Section>
        <Section id="week" title="Weekly goal">
          <WeekStep profile={view} mode="settings" />
        </Section>
        <Section id="taste" title="Taste">
          <TasteStep profile={view} mode="settings" />
        </Section>
        <Section id="location" title="Location" hint={p.area && p.city ? `Now: ${p.area}, ${p.city}` : undefined}>
          <PlaceStep profile={view} mode="settings" />
        </Section>

        <Section id="more" title="More from Veggie" hint="Early previews — they use sample data for now.">
          <ul className="divide-y divide-hairline rounded-[6px] border border-hairline bg-surface">
            {previews.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="flex min-h-14 items-center justify-between gap-3 px-4 py-2.5 hover:bg-paper">
                  <span>
                    <span className="block text-[0.9375rem] font-medium">{i.label}</span>
                    <span className="block text-[0.8125rem] text-ink-soft">{i.hint}</span>
                  </span>
                  <span className="font-mono text-[0.625rem] uppercase tracking-wide text-ink-soft">Preview →</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="account" title="Account">
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center rounded-[4px] border border-hairline bg-surface px-5 text-[0.9375rem] font-semibold hover:border-ink-soft"
            >
              Sign out
            </button>
          </form>

          <details className="mt-6 rounded-[6px] border border-rust/40 bg-surface" open={del === "confirm"}>
            <summary className="flex min-h-12 cursor-pointer items-center px-4 text-[0.9375rem] text-rust">Delete my account</summary>
            <form action={deleteAccount} className="flex flex-col gap-3 px-4 pb-4">
              <p className="text-[0.875rem] text-ink-soft">
                This permanently removes your account, profile, meal history and saved recipes. It can&apos;t be undone.
              </p>
              <label className="flex flex-col gap-1.5 text-[0.8125rem] font-medium">
                Type DELETE to confirm
                <input
                  name="confirm"
                  autoComplete="off"
                  required
                  pattern="DELETE"
                  className="rounded-[6px] border border-hairline bg-paper px-3 py-2.5 text-[0.9375rem] outline-none focus:border-rust"
                />
              </label>
              <button type="submit" className="inline-flex min-h-11 items-center justify-center rounded-[4px] bg-rust px-5 text-[0.9375rem] font-semibold text-surface">
                Delete everything
              </button>
            </form>
          </details>
        </Section>
      </Shell>
    </main>
  );
}
