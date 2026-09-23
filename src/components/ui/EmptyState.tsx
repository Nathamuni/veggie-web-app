import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

/** §4.2 empty / no-results state: say why it is empty, then offer the next action. */
export function EmptyState({
  title,
  reason,
  actionHref,
  actionLabel,
  children,
}: {
  title: string;
  reason: string;
  actionHref?: string;
  actionLabel?: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-[6px] border border-dashed border-hairline bg-surface px-4 py-6 text-center">
      <p className="text-[0.9375rem] font-semibold">{title}</p>
      <p className="mx-auto mt-1 max-w-[32ch] text-[0.8125rem] text-ink-soft">{reason}</p>
      {actionHref && actionLabel ? (
        <Button href={actionHref} variant="secondary" className="mt-4">
          {actionLabel}
        </Button>
      ) : null}
      {children}
    </div>
  );
}
