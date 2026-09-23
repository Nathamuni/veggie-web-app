import type { DietMode } from "@/lib/fixtures";

const styles: Record<string, string> = {
  vegetarian: "bg-curry-leaf-tint text-curry-leaf",
  vegan: "bg-kattam-blue-tint text-kattam-blue",
  neutral: "bg-surface text-ink border border-hairline",
  warning: "bg-rust-tint text-rust",
};

export function ModeTag({
  mode,
  label,
}: {
  mode: DietMode | "neutral" | "warning";
  label?: string;
}) {
  const text = label ?? (mode === "vegetarian" ? "Vegetarian" : mode === "vegan" ? "Vegan" : "");
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[0.6875rem] font-medium uppercase tracking-wide ${styles[mode]}`}
    >
      {text}
    </span>
  );
}
