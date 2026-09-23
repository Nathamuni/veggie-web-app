"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { user } from "@/lib/fixtures";

const inputCls =
  "rounded-[6px] border border-hairline bg-surface px-3 py-2.5 text-[0.9375rem] text-ink outline-none focus:border-turmeric";

export default function SignInPage() {
  const router = useRouter();

  return (
    <main className="flex-1 pb-16">
      <Shell width="narrow">
        {/* md+: the form sits in a hairline-bordered sheet on the paper background. */}
        <div className="md:mt-12 md:rounded-[6px] md:border md:border-hairline md:bg-surface md:px-8 md:pb-8 md:pt-2">
          <PageTitle eyebrow="Welcome back">Sign in</PageTitle>

          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              // Prototype: no real auth — any submission continues to the app.
              router.push("/app");
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
                defaultValue={user.email}
                className={inputCls}
              />
            </label>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <label
                  htmlFor="password"
                  className="text-[0.8125rem] font-medium text-ink"
                >
                  Password
                </label>
                <Link
                  href="/auth/recover"
                  className="text-[0.8125rem] text-ink underline underline-offset-2"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                name="password"
                autoComplete="current-password"
                required
                defaultValue="synthetic-demo-only"
                className={inputCls}
              />
            </div>

            <Button type="submit" className="mt-2">
              Sign in
            </Button>
            <p className="text-center text-[0.8125rem] text-ink-soft">
              New to Veggie?{" "}
              <Link
                href="/auth/sign-up"
                className="text-ink underline underline-offset-2"
              >
                Create an account
              </Link>
            </p>
            <p className="text-center font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
              Prototype — no real sign-in happens
            </p>
          </form>
        </div>
      </Shell>
    </main>
  );
}
