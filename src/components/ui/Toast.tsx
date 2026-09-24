"use client";

import { useEffect, useState } from "react";

const EVENT = "veggie:toast";

/** Show a short confirmation from anywhere in the app. */
export function toast(message: string) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: message }));
}

export function Toaster() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onToast = (e: Event) => {
      setMessage((e as CustomEvent<string>).detail);
      clearTimeout(timer);
      timer = setTimeout(() => setMessage(null), 3200);
    };
    window.addEventListener(EVENT, onToast);
    return () => {
      window.removeEventListener(EVENT, onToast);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-center px-4 lg:bottom-8"
    >
      {message ? (
        <p className="rounded-[6px] bg-ink px-4 py-2.5 text-[0.875rem] text-surface motion-safe:animate-[toast-in_180ms_ease-out]">
          {message}
        </p>
      ) : null}
    </div>
  );
}
