"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DietMode } from "@/lib/fixtures";

// Same five destinations as the phone tab bar, so the app has one map on every screen.
const primary = [
  { href: "/app", label: "Today" },
  { href: "/app/recipes", label: "Recipes" },
  { href: "/app/discover", label: "Eat out" },
  { href: "/app/progress", label: "Progress" },
];

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({ href, label, pathname }: { href: string; label: string; pathname: string }) {
  const active = isActive(pathname, href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-10 items-center gap-2 rounded-[4px] border px-3 py-1.5 text-[0.9375rem] transition-colors ${
        active
          ? "border-hairline bg-surface font-semibold text-ink"
          : "border-transparent text-ink-soft hover:bg-surface hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );
}

export function Sidebar({ name, area, dietMode }: { name: string; area: string | null; dietMode: DietMode }) {
  const pathname = usePathname() ?? "";
  return (
    <aside
      aria-label="Main"
      className="sticky top-0 hidden max-h-dvh flex-col self-start overflow-y-auto border-r border-hairline bg-paper px-4 py-5 lg:flex lg:min-h-dvh"
    >
      <Link href="/app" className="px-3 text-[1.25rem] font-semibold tracking-tight">
        Veggie
      </Link>

      <Link
        href="/app/log"
        className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-[4px] bg-turmeric px-4 py-2.5 text-[0.9375rem] font-semibold text-surface transition-colors hover:bg-turmeric-deep"
      >
        <span aria-hidden>＋</span> Log a meal
      </Link>

      <nav aria-label="Primary" className="mt-5 flex flex-col gap-0.5">
        {primary.map((i) => (
          <NavLink key={i.href} {...i} pathname={pathname} />
        ))}
      </nav>

      <div className="mt-auto border-t border-hairline pt-4">
        <Link
          href="/app/settings"
          aria-current={isActive(pathname, "/app/settings") ? "page" : undefined}
          className="flex items-center gap-3 rounded-[4px] px-3 py-2 hover:bg-surface"
        >
          <Avatar name={name} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.9375rem] font-medium">{name}</span>
            <span className="block truncate font-mono text-[0.6875rem] text-ink-soft">
              {area ?? "Set your area"} · {dietMode}
            </span>
          </span>
        </Link>
      </div>
    </aside>
  );
}

export function Avatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline bg-turmeric-tint font-semibold text-ink"
    >
      {name.trim()[0]?.toUpperCase() ?? "V"}
    </span>
  );
}
