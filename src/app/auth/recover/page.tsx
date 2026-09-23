"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Shell, PageTitle } from "@/components/ui/Shell";

export default function RecoverPage() {
  const [sent, setSent] = useState(false);

  return (
    <main className="flex-1 pb-16">
      <Shell width="narrow">
        {/* md+: the form sits in a hairline-bordered sheet on the paper background. */}
        <div className="md:mt-12 md:rounded-[6px] md:border md:border-hairline md:bg-surface md:px-8 md:pb-8 md:pt-2">
          {sent ? (
            <div role="status">
              <PageTitle eyebrow="Password recovery">
                Check your inbox
              </PageTitle>
              <p className="text-[0.9375rem] leading-relaxed text-ink-soft">
                If an account exists for that email, we&apos;ve sent a link to
                reset your password. It may take a few minutes to arrive — check
                your spam folder too.
              </p>
              <p className="mt-3 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
                Prototype — no email is actually sent
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <Button href="/auth/sign-in" variant="secondary">
                  Back to sign in
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setSent(false)}
                >
                  Use a different email
                </Button>
              </div>
            </div>
          ) : (
            <>
              <PageTitle eyebrow="Password recovery">
                Reset your password
              </PageTitle>
              <p className="mb-5 text-[0.875rem] text-ink-soft">
                Enter the email you signed up with and we&apos;ll send you a
                reset link.
              </p>
              <form
                className="flex flex-col gap-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <label className="flex flex-col gap-1.5">
                  <span className="text-[0.8125rem] font-medium text-ink">
                    Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    className="rounded-[6px] border border-hairline bg-surface px-3 py-2.5 text-[0.9375rem] text-ink outline-none focus:border-turmeric"
                  />
                </label>
                <Button type="submit" className="mt-2">
                  Send reset link
                </Button>
                <p className="text-center text-[0.8125rem] text-ink-soft">
                  Remembered it?{" "}
                  <Link
                    href="/auth/sign-in"
                    className="text-ink underline underline-offset-2"
                  >
                    Back to sign in
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </Shell>
    </main>
  );
}
