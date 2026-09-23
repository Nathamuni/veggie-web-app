"use client";

import { useState } from "react";

// Optional, user-initiated only. Shares counts the user can see — no personal log detail.
export function ShareSummary({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={share}
        className="w-full rounded-[6px] border border-hairline bg-surface px-4 py-3 text-[0.875rem] text-ink"
      >
        Share optional summary
      </button>
      <p role="status" className="mt-1 text-center text-[0.75rem] text-ink-soft">
        {state === "copied" ? "Summary copied." : state === "failed" ? "Couldn't share — nothing was sent." : ""}
      </p>
    </div>
  );
}
