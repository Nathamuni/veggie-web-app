export function ProgressBar({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label?: string;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      {label ? (
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="text-[0.8125rem] text-ink-soft">{label}</span>
          <span className="font-mono text-[0.8125rem] font-medium text-turmeric">
            {value}/{max}
          </span>
        </div>
      ) : null}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-hairline">
        <div className="h-full rounded-full bg-turmeric" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function StepProgress({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft whitespace-nowrap">
        Step {step} of {total}
      </span>
      <div className="flex flex-1 gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i < step ? "bg-turmeric" : "bg-hairline"}`}
          />
        ))}
      </div>
    </div>
  );
}
