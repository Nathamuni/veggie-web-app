import type { ReactNode } from "react";
import { ModeTag } from "@/components/ui/ModeTag";

/**
 * Operational status chip. Status is carried by the text; colour only adds
 * rust for negative outcomes. Curry-leaf green is kept for the vegetarian
 * mode tag so a "Verified" chip is never mistaken for a diet mode.
 */
export function StatusTag({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "negative" }) {
  return <ModeTag mode={tone === "negative" ? "warning" : "neutral"} label={label} />;
}

export function SyntheticNote({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">{children}</p>
  );
}
