import Link from "next/link";
import { ModeTag } from "@/components/ui/ModeTag";
import { user } from "@/lib/fixtures";

/**
 * §4.1 context controls: selected location, diet mode, and the way into
 * secondary screens (More) and settings. Diet mode always renders through
 * ModeTag so vegetarian and vegan are never visually conflated.
 */
export function AppHeader() {
  return (
    <header className="border-b border-hairline bg-paper lg:hidden">
      <div className="mx-auto flex max-w-[480px] items-center justify-between gap-2 px-4 py-3 md:max-w-[720px] md:px-8">
        <Link href="/app" className="text-[1.125rem] font-semibold">
          Veggie
        </Link>
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href="/app/settings#location"
            className="truncate font-mono text-[0.75rem] text-ink-soft underline-offset-4 hover:underline"
            aria-label={`Location: ${user.area}, ${user.city}. Change in settings`}
          >
            {user.city} ▾
          </Link>
          <Link href="/app/settings#diet-mode" aria-label="Diet mode. Change in settings">
            <ModeTag mode={user.dietMode} />
          </Link>
          <Link
            href="/app/more"
            className="rounded-[4px] border border-hairline bg-surface px-2.5 py-1.5 font-mono text-[0.6875rem] uppercase tracking-wide text-ink"
          >
            More
          </Link>
        </div>
      </div>
    </header>
  );
}
