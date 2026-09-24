import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PreviewNotice } from "@/components/ui/PreviewNotice";
import Link from "next/link";
import { SectionNav } from "./_components/SectionNav";
import { demoPartnerId } from "@/lib/fixtures/operations";

export const metadata: Metadata = {
  title: "Veggie Partner",
};

const nav = [
  { href: "/partner", label: "Overview" },
  { href: "/partner/claim", label: "Claim" },
  { href: "/partner/menu", label: "Menu" },
  { href: "/partner/analytics", label: "Analytics" },
];

/** PRD S28 — restaurant owner portal. No consumer bottom nav here. */
export default function PartnerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
        <PreviewNotice />
      <header className="border-b border-hairline bg-paper">
        <div className="mx-auto flex max-w-[480px] flex-col gap-2 px-4 py-3 md:max-w-[720px] md:px-8 lg:max-w-[1080px]">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[1.125rem] font-semibold">
              Veggie <span className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">Partner</span>
            </p>
            <Link href="/app" className="text-[0.8125rem] text-ink underline-offset-4 hover:underline">
              ← Back to Veggie
            </Link>
          </div>
          <p className="font-mono text-[0.6875rem] tracking-wide text-ink-soft">
            Signed in as {demoPartnerId} (synthetic demo account)
          </p>
          <SectionNav label="Partner sections" root="/partner" items={nav} />
        </div>
      </header>
      {children}
    </div>
  );
}
