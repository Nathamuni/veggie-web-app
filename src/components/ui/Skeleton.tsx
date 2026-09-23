import { Shell } from "@/components/ui/Shell";

/** §4.2 loading state: layout-shaped placeholders, never stale numbers shown as final. */
export function SkeletonPage({ label, blocks = 4 }: { label: string; blocks?: number }) {
  return (
    <main className="flex-1 pb-8" aria-busy="true">
      <Shell>
        <p className="sr-only" role="status">
          {label}
        </p>
        <div className="mb-5 mt-6 h-8 w-2/3 animate-pulse rounded-[4px] bg-hairline motion-reduce:animate-none" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: blocks }, (_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-[6px] border border-hairline bg-surface motion-reduce:animate-none"
            />
          ))}
        </div>
      </Shell>
    </main>
  );
}
