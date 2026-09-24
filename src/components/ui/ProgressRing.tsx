/** A single progress ring — the week's plant meals against the target. */
export function ProgressRing({
  value,
  max,
  size = 96,
  label,
}: {
  value: number;
  max: number;
  size?: number;
  label: string;
}) {
  const stroke = Math.max(6, Math.round(size / 12));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={label}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-hairline)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-turmeric)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          className="motion-safe:transition-[stroke-dashoffset] motion-safe:duration-700"
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono font-semibold leading-none" style={{ fontSize: size / 4 }}>
          {value}
        </span>
        <span className="font-mono text-ink-soft" style={{ fontSize: Math.max(10, size / 9) }}>
          of {max}
        </span>
      </span>
    </div>
  );
}
