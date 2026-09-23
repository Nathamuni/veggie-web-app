import type { ReactNode } from "react";

/**
 * Page content column. Phone-first; widens at tablet and desktop.
 * - "wide" (default): screens with lists, grids or a main + aside split.
 * - "narrow": single-task forms and reading (onboarding, auth, log flows) —
 *   stays at a comfortable form/line length on every screen.
 */
const widths = {
  wide: "max-w-[480px] md:max-w-[720px] lg:max-w-[1080px]",
  narrow: "max-w-[480px] md:max-w-[560px]",
} as const;

export function Shell({
  children,
  width = "wide",
}: {
  children: ReactNode;
  width?: keyof typeof widths;
}) {
  return <div className={`mx-auto w-full px-4 md:px-8 ${widths[width]}`}>{children}</div>;
}

export function PageTitle({ children, eyebrow }: { children: ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-5 mt-6 lg:mb-8 lg:mt-10">
      {eyebrow ? (
        <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-[clamp(1.75rem,5vw,2.25rem)] font-semibold leading-tight tracking-tight">
        {children}
      </h1>
    </div>
  );
}
