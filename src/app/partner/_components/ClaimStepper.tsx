import type { ClaimStatus } from "@/lib/fixtures/operations";

/**
 * Verification status stepper: Submitted → Under review → Verified/Rejected.
 * Each step states its own state in text, so nothing relies on colour.
 */
export function ClaimStepper({ status }: { status: ClaimStatus }) {
  const order: ClaimStatus[] = ["submitted", "under_review", "verified"];
  const reached = status === "rejected" ? 2 : order.indexOf(status);
  const steps = [
    { label: "Submitted" },
    { label: "Under review" },
    { label: status === "rejected" ? "Rejected" : "Verified" },
  ];

  return (
    <ol className="flex flex-col gap-0" aria-label="Verification status">
      {steps.map((s, i) => {
        const state = i < reached ? "done" : i === reached ? "current" : "upcoming";
        const final = i === 2 && state !== "upcoming";
        return (
          <li
            key={s.label}
            aria-current={state === "current" ? "step" : undefined}
            className="flex items-start gap-3 border-l-2 pb-3 pl-3 last:pb-0"
            style={{
              borderColor:
                state === "upcoming" ? "var(--color-hairline)" : status === "rejected" && final ? "var(--color-rust)" : "var(--color-turmeric)",
            }}
          >
            <div className="min-w-0">
              <p className={`text-[0.875rem] ${state === "upcoming" ? "text-ink-soft" : "font-medium"}`}>
                {i + 1}. {s.label}
              </p>
              <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
                {state === "done" ? "complete" : state === "current" ? (final ? "outcome" : "in progress") : "not yet"}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
