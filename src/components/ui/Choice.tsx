import type { ReactNode } from "react";

/**
 * A radio or checkbox drawn as a tappable row or chip. The native input stays
 * in the DOM (visually hidden), so keyboard, forms and screen readers work.
 */
export function ChoiceRow({
  type = "radio",
  name,
  value,
  defaultChecked,
  label,
  hint,
}: {
  type?: "radio" | "checkbox";
  name: string;
  value: string;
  defaultChecked?: boolean;
  label: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <label className="flex min-h-14 cursor-pointer items-center gap-3 rounded-[6px] border border-hairline bg-surface px-4 py-3 transition-colors hover:border-ink-soft has-[:checked]:border-ink has-[:checked]:shadow-[inset_0_0_0_1px_var(--color-ink)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-turmeric">
      <input type={type} name={name} value={value} defaultChecked={defaultChecked} className="h-4 w-4 shrink-0 accent-ink" />
      <span className="min-w-0">
        <span className="block text-[0.9375rem] font-medium">{label}</span>
        {hint ? <span className="block text-[0.8125rem] text-ink-soft">{hint}</span> : null}
      </span>
    </label>
  );
}

export function ChoiceChip({
  type = "checkbox",
  name,
  value,
  defaultChecked,
  children,
}: {
  type?: "radio" | "checkbox";
  name: string;
  value: string;
  defaultChecked?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="relative inline-flex min-h-11 cursor-pointer items-center rounded-full border border-hairline bg-surface px-4 text-[0.875rem] transition-colors hover:border-ink-soft has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-surface has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-turmeric">
      <input type={type} name={name} value={value} defaultChecked={defaultChecked} className="sr-only" />
      {children}
    </label>
  );
}

export function FieldLabel({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <legend className="mb-2">
      <span className="block text-[0.9375rem] font-semibold">{children}</span>
      {hint ? <span className="block text-[0.8125rem] text-ink-soft">{hint}</span> : null}
    </legend>
  );
}
