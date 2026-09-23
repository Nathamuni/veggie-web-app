import { Shell, PageTitle } from "@/components/ui/Shell";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex-1 pb-16">
      <Shell>
        <PageTitle eyebrow="404">Not on the menu</PageTitle>
        <p className="text-[0.9375rem] text-ink-soft">
          We couldn&apos;t find that page. It may have moved, or the item was removed.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Button href="/app">Go to home</Button>
          <Button href="/" variant="secondary">
            Veggie front page
          </Button>
        </div>
      </Shell>
    </main>
  );
}
