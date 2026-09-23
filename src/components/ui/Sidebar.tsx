"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeTag } from "@/components/ui/ModeTag";
import { user } from "@/lib/fixtures";

// PRD §4.1 desktop navigation: Home, Discover, Recipes, Progress, Learn, plus a
// prominent Log Meal action; secondary tools sit below, context controls at the foot.
const primary = [
  { href: "/app", label: "Home" },
  { href: "/app/discover", label: "Discover" },
  { href: "/app/recipes", label: "Recipes" },
  { href: "/app/progress", label: "Progress" },
  { href: "/app/learn", label: "Learn" },
];

const secondary = [
  { href: "/app/transition", label: "Transition centre" },
  { href: "/app/transition/craving", label: "I'm craving…" },
  { href: "/app/complete-meal", label: "Complete my meal" },
  { href: "/app/nutrition", label: "Nutrition" },
  { href: "/app/impact", label: "Animal impact" },
  { href: "/app/pantry", label: "Pantry" },
  { href: "/app/meal-plan", label: "Meal plan" },
  { href: "/app/shopping-list", label: "Shopping list" },
  { href: "/app/assistant", label: "Ask Veggie" },
];

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  if (href === "/app/transition") return pathname === "/app/transition";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({ href, label, pathname, strong }: { href: string; label: string; pathname: string; strong?: boolean }) {
  const active = isActive(pathname, href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-2 rounded-[4px] border px-3 py-1.5 transition-colors ${
        strong ? "text-[0.9375rem]" : "text-[0.875rem]"
      } ${
        active
          ? "border-hairline bg-surface font-semibold text-ink"
          : "border-transparent text-ink-soft hover:bg-surface hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname() ?? "";
  return (
    <aside
      aria-label="Main"
      className="sticky top-0 hidden max-h-dvh flex-col self-start overflow-y-auto border-r border-hairline bg-paper px-4 py-5 lg:flex lg:min-h-full"
    >
      <Link href="/app" className="px-3 text-[1.25rem] font-semibold tracking-tight">
        Veggie
      </Link>

      <Link
        href="/app/log"
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-[4px] bg-ink px-4 py-2.5 text-[0.9375rem] font-semibold text-surface transition-colors hover:bg-ink-soft"
      >
        <span aria-hidden>+</span> Log a meal
      </Link>

      <nav aria-label="Primary" className="mt-5 flex flex-col gap-0.5">
        {primary.map((i) => (
          <NavLink key={i.href} {...i} pathname={pathname} strong />
        ))}
      </nav>

      <p className="mt-5 px-3 font-mono text-[0.625rem] uppercase tracking-wide text-ink-soft">Tools</p>
      <nav aria-label="Tools" className="mt-1 flex flex-col gap-0.5">
        {secondary.map((i) => (
          <NavLink key={i.href} {...i} pathname={pathname} />
        ))}
      </nav>

      <div className="mt-auto border-t border-hairline pt-4">
        <div className="flex items-center justify-between gap-2 px-3">
          <Link
            href="/app/settings#location"
            className="truncate font-mono text-[0.75rem] text-ink-soft hover:text-ink"
            title={`${user.area}, ${user.city}`}
          >
            {user.area}
          </Link>
          <Link href="/app/settings#diet-mode" aria-label="Diet mode. Change in settings">
            <ModeTag mode={user.dietMode} />
          </Link>
        </div>
        <NavLink href="/app/settings" label="Profile & settings" pathname={pathname} />
      </div>
    </aside>
  );
}
