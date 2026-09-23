import type { Metadata } from "next";
import Link from "next/link";
import { PublicChrome } from "@/components/ui/PublicChrome";
import { Shell, PageTitle } from "@/components/ui/Shell";

export const metadata: Metadata = {
  title: "About · Veggie",
};

export default function AboutPage() {
  return (
    <PublicChrome>
      <main className="flex-1 pb-10">
        <Shell width="narrow">
          <PageTitle eyebrow="About">Why Veggie exists</PageTitle>
          <div className="flex flex-col gap-4 text-[0.9375rem] leading-relaxed text-ink-soft">
            <p>
              Most people who want to eat less meat already know why. What stops them is
              practical: the replacement doesn&apos;t fill them up, doesn&apos;t taste like
              home, costs more, or isn&apos;t on the menu where their friends want to eat.
            </p>
            <p>
              Veggie is built around those reasons. It recommends regionally familiar
              vegetarian and vegan meals, learns which ones actually satisfy you, and tracks
              progress without streaks or guilt.
            </p>
            <p>
              We treat vegetarian and vegan as separate paths, show &ldquo;data
              unavailable&rdquo; rather than guessing, and explain every estimate we show.
            </p>
          </div>

          <section aria-labelledby="status-heading" className="mt-8 border-t border-hairline pt-6">
            <h2 id="status-heading" className="mb-2 text-[1.125rem] font-semibold">
              Where we are
            </h2>
            <p className="text-[0.8125rem] leading-relaxed text-ink-soft">
              Veggie is an early prototype. Every restaurant, recipe, rating and number you
              see here is synthetic demo data, used only to show how the product will work.
            </p>
            <p className="mt-4 text-[0.8125rem] text-ink-soft">
              <Link href="/how-it-works" className="text-ink underline underline-offset-2">
                See how it works
              </Link>
            </p>
          </section>
        </Shell>
      </main>
    </PublicChrome>
  );
}
