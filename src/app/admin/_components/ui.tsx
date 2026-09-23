import type { ButtonHTMLAttributes, ReactNode } from "react";

/** Admin content column: phone width by default, wider on tablet, console width on desktop. */
export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[480px] px-4 md:max-w-[960px] md:px-8 lg:max-w-[1200px]">{children}</div>
  );
}

/**
 * md+ list view: a ruled table. Pair with the card list wrapped in `md:hidden` (or `lg:hidden` with from="lg")
 * so phones keep the card layout. Scrolls inside its own box, never the page.
 */
export function DataTable({
  caption,
  head,
  children,
  from = "md",
}: {
  caption: string;
  head: string[];
  children: ReactNode;
  /** Breakpoint the table takes over from the card list (wide tables: "lg"). */
  from?: "md" | "lg";
}) {
  return (
    <div
      className={`hidden overflow-x-auto rounded-[6px] border border-hairline bg-surface ${from === "lg" ? "lg:block" : "md:block"}`}
    >
      <table className="w-full border-collapse text-left text-[0.8125rem]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                scope="col"
                className="px-3 py-2 font-mono text-[0.6875rem] font-medium uppercase tracking-wide text-ink-soft"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

/** Table row with a hairline top rule. */
export function Tr({ children }: { children: ReactNode }) {
  return <tr className="border-t border-hairline align-top">{children}</tr>;
}

export function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`px-3 py-2.5 ${className}`}>{children}</td>;
}

/** Row actions inside a table cell (no top margin). */
export function CellActions({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

/** Compact secondary button for list-row actions (Approve / Merge / …). */
export function RowAction({
  children,
  tone = "default",
  className = "",
  ...rest
}: { children: ReactNode; tone?: "default" | "destructive" } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-8 items-center rounded-[4px] border bg-surface px-3 py-1.5 text-[0.8125rem] disabled:pointer-events-none disabled:opacity-40 ${
        tone === "destructive" ? "border-rust-tint text-rust hover:border-rust" : "border-hairline text-ink hover:border-ink-soft"
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function RowActions({ children }: { children: ReactNode }) {
  return <div className="mt-3 flex flex-wrap gap-2">{children}</div>;
}

export function Lede({ children }: { children: ReactNode }) {
  return <p className="-mt-3 mb-5 max-w-[60ch] text-[0.8125rem] text-ink-soft">{children}</p>;
}
