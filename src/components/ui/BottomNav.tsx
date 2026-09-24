"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/app", label: "Today", icon: HomeIcon },
  { href: "/app/recipes", label: "Recipes", icon: RecipesIcon },
  { href: "/app/log", label: "Log", icon: LogIcon, primary: true },
  { href: "/app/discover", label: "Eat out", icon: DiscoverIcon },
  { href: "/app/progress", label: "Progress", icon: ProgressIcon },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-20 border-t border-hairline bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="mx-auto flex max-w-[480px] items-stretch justify-between px-2 md:max-w-[720px]">
        {items.map(({ href, label, icon: Icon, primary }) => {
          const active = href === "/app" ? pathname === "/app" : pathname?.startsWith(href);
          if (primary) {
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className="flex flex-1 flex-col items-center gap-1 pb-2 pt-1"
              >
                <span className="-mt-5 flex h-12 w-12 items-center justify-center rounded-full border-4 border-paper bg-turmeric text-surface">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="font-mono text-[0.625rem] uppercase tracking-wide text-ink">{label}</span>
              </Link>
            );
          }
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="flex flex-1 flex-col items-center gap-1 py-2.5 text-ink-soft"
            >
              <Icon active={!!active} />
              <span
                className={`font-mono text-[0.625rem] uppercase tracking-wide ${
                  active ? "text-turmeric" : "text-ink-soft"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function iconProps(active: boolean) {
  return {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: active ? "#C97A0C" : "none",
    stroke: active ? "#C97A0C" : "#5B5344",
    strokeWidth: 1.8,
  };
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg {...iconProps(active)}>
      <path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9h12v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function DiscoverIcon({ active }: { active: boolean }) {
  return (
    <svg {...iconProps(active)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}
function LogIcon({ active }: { active: boolean }) {
  return (
    <svg {...iconProps(active)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" strokeLinecap="round" />
    </svg>
  );
}
function RecipesIcon({ active }: { active: boolean }) {
  return (
    <svg {...iconProps(active)}>
      <path d="M5 4h9l5 5v11H5z" strokeLinejoin="round" />
      <path d="M14 4v5h5" strokeLinejoin="round" />
    </svg>
  );
}
function ProgressIcon({ active }: { active: boolean }) {
  return (
    <svg {...iconProps(active)}>
      <path d="M4 19V10M11 19V5M18 19v-6" strokeLinecap="round" />
    </svg>
  );
}
