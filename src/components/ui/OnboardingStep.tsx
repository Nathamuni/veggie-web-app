import Link from "next/link";
import type { ReactNode } from "react";
import { Shell } from "@/components/ui/Shell";
import { StepProgress } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";

export function OnboardingStep({
  step,
  total,
  back,
  title,
  subtitle,
  children,
  continueHref,
  continueLabel = "Continue",
}: {
  step: number;
  total: number;
  back?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  continueHref: string;
  continueLabel?: string;
}) {
  return (
    <main className="flex-1 pb-24">
      <Shell width="narrow">
        {/* md+: the step sits in a hairline-bordered sheet on the paper background. */}
        <div className="md:mt-12 md:rounded-[6px] md:border md:border-hairline md:bg-surface md:px-8 md:pb-8">
          <div className="flex items-center gap-3 pt-5 md:pt-8">
            {back ? (
              <Link href={back} aria-label="Back" className="text-ink">
                ←
              </Link>
            ) : (
              <span className="w-3" />
            )}
            <div className="flex-1">
              <StepProgress step={step} total={total} />
            </div>
          </div>

          <div className="mb-5 mt-5">
            <h1 className="text-[1.5rem] font-semibold leading-tight tracking-tight">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-1.5 text-[0.875rem] text-ink-soft">{subtitle}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-5">{children}</div>

          <div className="mt-8">
            <Button href={continueHref} className="w-full">
              {continueLabel}
            </Button>
          </div>
        </div>
      </Shell>
    </main>
  );
}
