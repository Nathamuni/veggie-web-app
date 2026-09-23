import Link from "next/link";
import { Shell, PageTitle } from "@/components/ui/Shell";

// §4.1: mobile bottom nav holds five items; everything else lives here.
const groups: { heading: string; items: { href: string; label: string; detail: string }[] }[] = [
  {
    heading: "Transition",
    items: [
      { href: "/app/transition", label: "Transition centre", detail: "Baseline vs now, weekly target, barriers" },
      { href: "/app/transition/craving", label: "I'm craving…", detail: "Find a replacement that keeps what you miss" },
      { href: "/app/complete-meal", label: "Complete my meal", detail: "Make a dish you already eat more filling" },
    ],
  },
  {
    heading: "Health & impact",
    items: [
      { href: "/app/nutrition", label: "Nutrition centre", detail: "What your logged meals contain" },
      { href: "/app/impact", label: "Animal impact", detail: "Meals avoided, with the method shown" },
      { href: "/app/learn", label: "Veggie Learn", detail: "Short lessons tied to your next meal" },
    ],
  },
  {
    heading: "Kitchen",
    items: [
      { href: "/app/pantry", label: "Pantry", detail: "What you have, and what you can cook" },
      { href: "/app/meal-plan", label: "Meal plan", detail: "A week that fits budget and time" },
      { href: "/app/shopping-list", label: "Shopping list", detail: "Plan minus pantry" },
    ],
  },
  {
    heading: "Help",
    items: [
      { href: "/app/assistant", label: "Ask Veggie", detail: "“What should I eat?” with reasons" },
      { href: "/app/settings", label: "Profile & settings", detail: "Goal, diet, privacy, export, delete" },
    ],
  },
];

export default function MorePage() {
  return (
    <main className="flex-1 pb-8">
      <Shell>
        <PageTitle eyebrow="Menu">More</PageTitle>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-8 2xl:grid-cols-4">
          {groups.map((g) => (
            <section key={g.heading} aria-labelledby={`more-${g.heading}`}>
              <h2
                id={`more-${g.heading}`}
                className="mb-1 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft"
              >
                {g.heading}
              </h2>
              <ul className="divide-y divide-hairline border-y border-hairline">
                {g.items.map((i) => (
                  <li key={i.href}>
                    <Link href={i.href} className="flex items-center justify-between gap-3 py-3">
                      <span>
                        <span className="block text-[0.9375rem] font-medium">{i.label}</span>
                        <span className="block text-[0.8125rem] text-ink-soft">{i.detail}</span>
                      </span>
                      <span aria-hidden className="text-ink-soft">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          </div>
          <p className="text-[0.8125rem] text-ink-soft">
            Own a restaurant? <Link href="/partner" className="underline">Partner portal</Link>
          </p>
        </div>
      </Shell>
    </main>
  );
}
