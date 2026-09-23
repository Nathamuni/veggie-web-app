import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/restaurants", label: "Restaurants" },
  { href: "/recipes", label: "Recipes" },
  { href: "/impact-methodology", label: "Impact method" },
  { href: "/about", label: "About" },
];

const footerLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/impact-methodology", label: "Impact methodology" },
];

/** Shared header + footer for signed-out, public pages. */
export function PublicChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicHeader />
      {children}
      <PublicFooter />
    </>
  );
}

export function PublicHeader() {
  return (
    <header className="border-b border-hairline bg-paper md:px-8">
      <div className="mx-auto max-w-[480px] px-4 py-3 md:max-w-[720px] md:px-0 lg:max-w-[1080px]">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 md:flex-nowrap md:gap-x-6">
          <Link href="/" className="text-[1.125rem] font-semibold md:inline-flex md:min-h-11 md:items-center">
            Veggie
          </Link>
          <div className="flex items-center gap-3 md:order-3">
            <Link
              href="/auth/sign-in"
              className="text-[0.8125rem] text-ink underline-offset-4 hover:underline md:inline-flex md:min-h-11 md:items-center"
            >
              Sign in
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded-[4px] border border-hairline bg-surface px-2.5 py-1.5 font-mono text-[0.6875rem] uppercase tracking-wide text-ink hover:border-ink-soft md:inline-flex md:min-h-11 md:items-center md:whitespace-nowrap md:px-3 md:transition-colors"
            >
              Start my journey
            </Link>
          </div>
          <nav aria-label="Public" className="w-full md:order-2 md:w-auto md:flex-1">
            <ul className="flex flex-wrap gap-x-4 gap-y-1 md:gap-x-3 lg:gap-x-5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft underline-offset-4 hover:text-ink hover:underline md:inline-flex md:min-h-11 md:items-center md:whitespace-nowrap"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-hairline px-4 py-8 md:px-8">
      <div className="mx-auto max-w-[480px] md:grid md:max-w-[720px] md:grid-cols-[auto_1fr] md:items-center md:gap-x-8 lg:max-w-[1080px]">
        <Button href="/auth/sign-up" variant="secondary" className="w-full md:w-auto">
          Start my journey
        </Button>
        <nav aria-label="Legal and methodology" className="mt-6 md:mt-0 md:justify-self-end">
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            {footerLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[0.8125rem] text-ink-soft underline underline-offset-2 hover:text-ink md:inline-flex md:min-h-11 md:items-center"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-4 text-[0.75rem] text-ink-soft md:col-span-2 md:mt-6">
          Veggie is wellness support, not a medical or diagnostic product.
        </p>
      </div>
    </footer>
  );
}
