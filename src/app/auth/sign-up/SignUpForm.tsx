"use client";

import Link from "next/link";
import { useActionState, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { signUp } from "@/app/actions/auth";
import { inputCls } from "../sign-in/SignInForm";

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^a-zA-Z0-9]/.test(pw)) s++;
  return s;
}
const strengthLabel = ["too short", "weak", "okay", "good", "strong", "very strong"];

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUp, undefined);
  const [pw, setPw] = useState("");
  const errs = state?.fieldErrors ?? {};
  const s = strength(pw);

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      {state?.error ? (
        <p role="alert" className="rounded-[6px] border border-rust bg-rust-tint px-3 py-2.5 text-[0.875rem] text-rust">
          {state.error}{" "}
          <Link href="/auth/sign-in" className="underline underline-offset-2">
            Sign in
          </Link>
        </p>
      ) : null}

      <label className="flex flex-col gap-1.5">
        <span className="text-[0.8125rem] font-medium text-ink">Your first name</span>
        <input type="text" name="displayName" autoComplete="given-name" maxLength={60} className={inputCls} />
        <span className="text-[0.75rem] text-ink-soft">Optional — so we can say hello.</span>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[0.8125rem] font-medium text-ink">Email</span>
        <input type="email" name="email" autoComplete="email" required defaultValue={state?.email} className={inputCls} aria-invalid={!!errs.email} />
        <FieldError messages={errs.email} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[0.8125rem] font-medium text-ink">Password</span>
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className={inputCls}
          aria-invalid={!!errs.password}
          aria-describedby="pw-strength"
        />
        <span id="pw-strength" className={`font-mono text-[0.6875rem] ${s >= 3 ? "text-curry-leaf" : "text-ink-soft"}`}>
          {pw ? `${"▓".repeat(s)}${"░".repeat(5 - s)} ${strengthLabel[s]}` : "At least 8 characters"}
        </span>
        <FieldError messages={errs.password} />
      </label>

      <fieldset className="flex flex-col gap-3 border-t border-hairline pt-4">
        <legend className="sr-only">Consent</legend>
        <Consent name="terms" required error={errs.terms}>
          I agree to the{" "}
          <Link href="/terms" className="underline underline-offset-2">Terms</Link> &amp;{" "}
          <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link>
        </Consent>
        <Consent name="personalise" required error={errs.personalise}>
          Use what I log to personalise my meal suggestions
        </Consent>
        <Consent name="adult" required error={errs.adult}>
          I am 18 or older
        </Consent>
        <Consent name="marketing">Occasional product emails (optional)</Consent>
      </fieldset>

      <Button type="submit" className="mt-2" disabled={pending}>
        {pending ? "Creating your account…" : "Create account"}
      </Button>
      <p className="text-center text-[0.8125rem] text-ink-soft">
        Already have an account?{" "}
        <Link href="/auth/sign-in" className="text-ink underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </form>
  );
}

function FieldError({ messages }: { messages?: string[] }) {
  return messages?.length ? <span className="text-[0.8125rem] text-rust">{messages[0]}</span> : null;
}

function Consent({ name, required, error, children }: { name: string; required?: boolean; error?: string[]; children: ReactNode }) {
  return (
    <div>
      <label className="flex items-start gap-2.5 text-[0.8125rem] text-ink">
        <input type="checkbox" name={name} className="mt-0.5 h-4 w-4 accent-turmeric" aria-invalid={!!error} />
        <span>
          {children}
          {required ? <span className="text-rust"> *</span> : null}
        </span>
      </label>
      <FieldError messages={error} />
    </div>
  );
}
