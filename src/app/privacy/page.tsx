import type { Metadata } from "next";
import { ModeTag } from "@/components/ui/ModeTag";
import { PublicChrome } from "@/components/ui/PublicChrome";
import { Shell, PageTitle } from "@/components/ui/Shell";

export const metadata: Metadata = {
  title: "Privacy (draft) · Veggie",
};

const purposes = [
  "Account and sign-in",
  "Personalised food recommendations",
  "Meal logging and progress",
  "Location for nearby restaurants (optional)",
  "Product emails (optional)",
];

const rights = [
  "Withdraw consent",
  "Export your data",
  "Delete your account and data",
];

function Placeholder() {
  return (
    <p className="mt-1 text-[0.8125rem] italic text-ink-soft">
      Placeholder — text to be supplied after legal review.
    </p>
  );
}

export default function PrivacyPage() {
  return (
    <PublicChrome>
      <main className="flex-1 pb-10">
        <Shell width="narrow">
          <PageTitle eyebrow="Privacy">Privacy policy</PageTitle>
          <div className="mb-8 flex flex-col gap-2 rounded-[6px] border border-rust bg-rust-tint px-4 py-3">
            <ModeTag mode="warning" label="Draft placeholder" />
            <p className="text-[0.8125rem] text-ink">
              DRAFT PLACEHOLDER — not legal text. This page only outlines the structure the
              final policy will follow.
            </p>
          </div>

          <section aria-labelledby="purposes-heading" className="mb-8">
            <h2 id="purposes-heading" className="mb-1 text-[1.125rem] font-semibold">
              Consent purposes
            </h2>
            <p className="mb-4 text-[0.8125rem] text-ink-soft">
              Consent is asked for each purpose separately, never bundled.
            </p>
            <ul className="flex flex-col border-t border-hairline">
              {purposes.map((p) => (
                <li key={p} className="border-b border-hairline py-3">
                  <h3 className="text-[0.9375rem] font-semibold">{p}</h3>
                  <Placeholder />
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="rights-heading">
            <h2 id="rights-heading" className="mb-4 text-[1.125rem] font-semibold">
              Your rights
            </h2>
            <ul className="flex flex-col border-t border-hairline">
              {rights.map((r) => (
                <li key={r} className="border-b border-hairline py-3">
                  <h3 className="text-[0.9375rem] font-semibold">{r}</h3>
                  <Placeholder />
                </li>
              ))}
            </ul>
          </section>
        </Shell>
      </main>
    </PublicChrome>
  );
}
