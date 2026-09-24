"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { signIn } from "@/app/actions/auth";

export const inputCls =
  "rounded-[6px] border border-hairline bg-surface px-3 py-2.5 text-[0.9375rem] text-ink outline-none focus:border-turmeric";

export function SignInForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signIn, undefined);

  return (
    <form action={action} className="flex flex-col gap-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      {state?.error ? (
        <p role="alert" className="rounded-[6px] border border-rust bg-rust-tint px-3 py-2.5 text-[0.875rem] text-rust">
          {state.error}
        </p>
      ) : null}

      <label className="flex flex-col gap-1.5">
        <span className="text-[0.8125rem] font-medium text-ink">Email</span>
        <input type="email" name="email" autoComplete="email" required defaultValue={state?.email} className={inputCls} />
      </label>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor="password" className="text-[0.8125rem] font-medium text-ink">
            Password
          </label>
          <Link href="/auth/recover" className="text-[0.8125rem] text-ink underline underline-offset-2">
            Forgot password?
          </Link>
        </div>
        <input id="password" type="password" name="password" autoComplete="current-password" required className={inputCls} />
      </div>

      <Button type="submit" className="mt-2" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      <p className="text-center text-[0.8125rem] text-ink-soft">
        New to Veggie?{" "}
        <Link href="/auth/sign-up" className="text-ink underline underline-offset-2">
          Create an account
        </Link>
      </p>
    </form>
  );
}
