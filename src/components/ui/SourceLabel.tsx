import type { ReactNode } from "react";

export function SourceLabel({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
      {children}
    </span>
  );
}

export function Figure({
  value,
  source,
}: {
  value: string;
  source?: string | null;
}) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-mono text-[0.9375rem] font-medium text-ink">{value}</span>
      {source ? <SourceLabel>· {source}</SourceLabel> : null}
    </span>
  );
}

export function DataUnavailable() {
  return <span className="font-mono text-[0.8125rem] text-ink-soft italic">data unavailable</span>;
}
