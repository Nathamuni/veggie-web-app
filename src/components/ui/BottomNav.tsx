"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/app", label: "Home", icon: HomeIcon },
  { href: "/app/discover", label: "Discover", icon: DiscoverIcon },
  { href: "/app/log", label: "Log", icon: LogIcon },
  { href: "/app/recipes", label: "Recipes", icon: RecipesIcon },
  { href: "/app/progress", label: "Progress", icon: ProgressIcon },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-20 border-t border-hairline bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="mx-auto flex max-w-[480px] items-stretch justify-between px-2 md:max-w-[720px]">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/app" ? pathname === "/app" : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
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
