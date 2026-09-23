"use client";

import { useEffect } from "react";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex-1 pb-16">
      <Shell>
        <PageTitle eyebrow="Something broke">That didn&apos;t load</PageTitle>
        <p className="text-[0.9375rem] text-ink-soft">
          Nothing you logged has been lost. Try again, or head back home.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Button type="button" onClick={() => retry()}>
            Try again
          </Button>
          <Button href="/app" variant="secondary">
            Go to home
          </Button>
        </div>
      </Shell>
    </main>
  );
}
