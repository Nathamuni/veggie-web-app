import Link from "next/link";
import type { ReactNode } from "react";
import { Shell } from "@/components/ui/Shell";
import { StepProgress } from "@/components/ui/ProgressBar";

/** Frame for one onboarding question: back, step count, the question, then the form. */
export function OnboardingStep({
  step,
  total,
  back,
  title,
  subtitle,
  children,
}: {
  step?: number;
  total?: number;
  back?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <main className="flex-1 pb-24">
      <Shell width="narrow">
        {/* md+: the step sits in a hairline-bordered sheet on the paper background. */}
        <div className="md:mt-12 md:rounded-[6px] md:border md:border-hairline md:bg-surface md:px-8 md:pb-8">
          <div className="flex min-h-11 items-center gap-3 pt-5 md:pt-8">
            {back ? (
              <Link href={back} aria-label="Back to the previous step" className="-ml-2 flex h-11 w-11 items-center justify-center text-ink">
                ←
              </Link>
            ) : null}
            {step && total ? (
              <div className="flex-1">
                <StepProgress step={step} total={total} />
              </div>
            ) : null}
          </div>

          <div className="mb-5 mt-4">
            <h1 className="text-[1.5rem] font-semibold leading-tight tracking-tight">{title}</h1>
            {subtitle ? <p className="mt-1.5 text-[0.875rem] text-ink-soft">{subtitle}</p> : null}
          </div>

          {children}
        </div>
      </Shell>
    </main>
  );
}
