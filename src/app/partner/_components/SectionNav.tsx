"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Operator section nav, shared shape for /partner and /admin. Wraps instead
 * of scrolling so it never causes horizontal overflow at 360px.
 */
export function SectionNav({
  label,
  root,
  items,
}: {
  label: string;
  root: string;
  items: { href: string; label: string }[];
}) {
  const pathname = usePathname();
  return (
    <nav aria-label={label}>
      <ul className="flex flex-wrap gap-x-1 gap-y-1">
        {items.map((item) => {
          const active =
            item.href === root ? pathname === root : pathname?.startsWith(item.href) ?? false;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-block rounded-[4px] px-2.5 py-1.5 font-mono text-[0.6875rem] uppercase tracking-wide ${
                  active
                    ? "bg-surface text-turmeric underline decoration-2 underline-offset-4 border border-hairline"
                    : "text-ink-soft hover:text-ink border border-transparent"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
