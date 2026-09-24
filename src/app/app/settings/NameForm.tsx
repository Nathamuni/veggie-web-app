"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { updateDisplayName } from "@/app/actions/profile";

export function NameForm({ defaultName }: { defaultName: string }) {
  const [state, action, pending] = useActionState(updateDisplayName, undefined);
  return (
    <form action={action} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-[0.8125rem] font-medium">First name</span>
        <input
          name="displayName"
          defaultValue={defaultName}
          maxLength={60}
          autoComplete="given-name"
          className="rounded-[6px] border border-hairline bg-surface px-3 py-2.5 text-[0.9375rem] outline-none focus:border-turmeric"
        />
      </label>
      {state?.error ? <p role="alert" className="text-[0.875rem] text-rust">{state.error}</p> : null}
      <div className="flex items-center gap-3">
        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
        {state?.saved && !pending ? <span role="status" className="text-[0.875rem] text-curry-leaf">✓ Saved</span> : null}
      </div>
    </form>
  );
}
