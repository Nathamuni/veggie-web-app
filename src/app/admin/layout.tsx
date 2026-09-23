import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { SectionNav } from "@/app/partner/_components/SectionNav";
import { AuditProvider } from "./_components/Audit";
import { demoAdminId } from "@/lib/fixtures/operations";

export const metadata: Metadata = {
  title: "Veggie Admin",
};

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/restaurants", label: "Restaurants" },
  { href: "/admin/recipes", label: "Recipes" },
  { href: "/admin/food", label: "Food" },
  { href: "/admin/ratings", label: "Ratings" },
  { href: "/admin/impact", label: "Impact" },
  { href: "/admin/content", label: "Content" },
];

/** PRD S29 — internal operations console. No consumer bottom nav here. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuditProvider>
      <div className="flex flex-1 flex-col">
        <header className="border-b border-hairline bg-paper">
          <div className="mx-auto flex max-w-[480px] flex-col gap-2 px-4 py-3 md:max-w-[960px] md:px-8 lg:max-w-[1200px]">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[1.125rem] font-semibold">
                Veggie{" "}
                <span className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">Admin</span>
              </p>
              <Link href="/app" className="text-[0.8125rem] text-ink underline-offset-4 hover:underline">
                ← Back to Veggie
              </Link>
            </div>
            <p className="font-mono text-[0.6875rem] tracking-wide text-ink-soft">
              Signed in as {demoAdminId} (synthetic operations account)
            </p>
            <SectionNav label="Admin sections" root="/admin" items={nav} />
          </div>
        </header>
        {children}
      </div>
    </AuditProvider>
  );
}
