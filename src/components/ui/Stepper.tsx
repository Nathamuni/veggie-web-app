"use client";

/** − value + control for a small whole number. Submits as a normal form field. */
export function Stepper({
  name,
  value,
  onChange,
  min,
  max,
  label,
  unit,
}: {
  name: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  label: string;
  unit?: string;
}) {
  const btn =
    "flex h-12 w-12 items-center justify-center rounded-[6px] border border-hairline bg-surface text-[1.25rem] transition-colors hover:border-ink-soft disabled:opacity-30";
  return (
    <div className="flex items-center gap-3" role="group" aria-label={label}>
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Fewer ${label}`}>
        −
      </button>
      <output aria-live="polite" className="min-w-[4.5rem] text-center">
        <span className="font-mono text-[1.75rem] font-semibold">{value}</span>
        {unit ? <span className="block font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">{unit}</span> : null}
      </output>
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`More ${label}`}>
        +
      </button>
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
