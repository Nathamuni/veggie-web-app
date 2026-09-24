/** Marks a section that still runs on sample data, so nobody mistakes it for live. */
export function PreviewNotice({ children = "Preview — this section uses sample data" }: { children?: string }) {
  return (
    <aside aria-label="Preview notice" className="bg-rust py-1 text-center font-mono text-[11px] tracking-wide text-surface">
      {children}
    </aside>
  );
}
