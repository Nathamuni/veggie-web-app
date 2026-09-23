import type { Metadata } from "next";
import { ModeTag } from "@/components/ui/ModeTag";
import { PublicChrome } from "@/components/ui/PublicChrome";
import { Shell, PageTitle } from "@/components/ui/Shell";

export const metadata: Metadata = {
  title: "Terms (draft) · Veggie",
};

const sections = [
  "Using Veggie",
  "Your account",
  "Content you submit",
  "Wellness support, not medical advice",
  "Restaurant and recipe information",
  "Changes to these terms",
];

export default function TermsPage() {
  return (
    <PublicChrome>
      <main className="flex-1 pb-10">
        <Shell width="narrow">
          <PageTitle eyebrow="Terms">Terms of use</PageTitle>
          <div className="mb-8 flex flex-col gap-2 rounded-[6px] border border-rust bg-rust-tint px-4 py-3">
            <ModeTag mode="warning" label="Draft placeholder" />
            <p className="text-[0.8125rem] text-ink">
              DRAFT PLACEHOLDER — not legal text. This page only outlines the structure the
              final terms will follow.
            </p>
          </div>

          <ul className="flex flex-col border-t border-hairline">
            {sections.map((s) => (
              <li key={s} className="border-b border-hairline py-3">
                <h2 className="text-[0.9375rem] font-semibold">{s}</h2>
                <p className="mt-1 text-[0.8125rem] italic text-ink-soft">
                  Placeholder — text to be supplied after legal review.
                </p>
              </li>
            ))}
          </ul>
        </Shell>
      </main>
    </PublicChrome>
  );
}
