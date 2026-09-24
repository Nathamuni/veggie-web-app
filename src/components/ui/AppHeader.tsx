import Link from "next/link";
import { ModeTag } from "@/components/ui/ModeTag";
import { Avatar } from "@/components/ui/Sidebar";
import type { DietMode } from "@/lib/fixtures";

/** Phone/tablet header: brand, where you are, your diet mode, and the way to Me. */
export function AppHeader({ name, area, dietMode }: { name: string; area: string | null; dietMode: DietMode }) {
  return (
    <header className="border-b border-hairline bg-paper lg:hidden">
      <div className="mx-auto flex max-w-[480px] items-center justify-between gap-2 px-4 py-2 md:max-w-[720px] md:px-8">
        <Link href="/app" className="text-[1.125rem] font-semibold">
          Veggie
        </Link>
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href="/app/settings#location"
            className="truncate font-mono text-[0.75rem] text-ink-soft underline-offset-4 hover:underline"
            aria-label={`Location: ${area ?? "not set"}. Change in settings`}
          >
            {area ?? "Set area"} ▾
          </Link>
          <ModeTag mode={dietMode} />
          <Link href="/app/settings" aria-label="Me — profile and settings" className="flex h-11 w-11 items-center justify-center">
            <Avatar name={name} />
          </Link>
        </div>
      </div>
    </header>
  );
}
