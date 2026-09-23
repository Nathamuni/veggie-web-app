import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { user } from "@/lib/fixtures";

export default function SignUpPage() {
  return (
    <main className="flex-1 pb-16">
      <Shell width="narrow">
        {/* md+: the form sits in a hairline-bordered sheet on the paper background. */}
        <div className="md:mt-12 md:rounded-[6px] md:border md:border-hairline md:bg-surface md:px-8 md:pb-8 md:pt-2">
          <PageTitle eyebrow="Create account">Join Veggie</PageTitle>

          <form className="flex flex-col gap-5">
            <label className="flex flex-col gap-1.5">
              <span className="text-[0.8125rem] font-medium text-ink">
                Email
              </span>
              <input
                type="email"
                defaultValue={user.email}
                className="rounded-[6px] border border-hairline bg-surface px-3 py-2.5 text-[0.9375rem] text-ink outline-none focus:border-turmeric"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[0.8125rem] font-medium text-ink">
                Password
              </span>
              <input
                type="password"
                defaultValue="synthetic-demo-only"
                className="rounded-[6px] border border-hairline bg-surface px-3 py-2.5 text-[0.9375rem] text-ink outline-none focus:border-turmeric"
              />
              <span className="font-mono text-[0.6875rem] text-curry-leaf">
                ▓▓▓▓▓░ strong
              </span>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[0.8125rem] font-medium text-ink">
                Display name
              </span>
              <span className="font-mono text-[0.6875rem] text-ink-soft">
                optional
              </span>
              <input
                type="text"
                defaultValue={user.displayName}
                className="rounded-[6px] border border-hairline bg-surface px-3 py-2.5 text-[0.9375rem] text-ink outline-none focus:border-turmeric"
              />
            </label>

            <div className="flex flex-col gap-3 border-t border-hairline pt-4">
              <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
                Consent — itemised, never bundled
              </p>
              <Consent
                label={
                  <>
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="underline underline-offset-2"
                    >
                      Terms
                    </Link>{" "}
                    &amp;{" "}
                    <Link
                      href="/privacy"
                      className="underline underline-offset-2"
                    >
                      Privacy Policy
                    </Link>
                  </>
                }
                required
                defaultChecked
              />
              <Consent
                label="Personalise my food recommendations"
                required
                defaultChecked
              />
              <Consent label="Product emails (optional)" />
              <Consent label="I am 18 or older" required defaultChecked />
            </div>

            <Button type="button" className="mt-2" href="/onboarding/goal">
              Create account
            </Button>
            <p className="text-center text-[0.8125rem] text-ink-soft">
              Already have an account?{" "}
              <Link
                href="/auth/sign-in"
                className="text-ink underline underline-offset-2"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </Shell>
    </main>
  );
}

function Consent({
  label,
  required,
  defaultChecked,
}: {
  label: ReactNode;
  required?: boolean;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-start gap-2.5 text-[0.8125rem] text-ink">
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 accent-turmeric"
      />
      <span>
        {label}
        {required ? <span className="text-rust"> *</span> : null}
      </span>
    </label>
  );
}
