"use client";

import { useState } from "react";
import { OnboardingStep } from "@/components/ui/OnboardingStep";
import { user } from "@/lib/fixtures";

const modes = [
  {
    id: "vegetarian",
    title: "Vegetarian",
    detail: "No meat or fish. Egg & dairy: next step.",
    border: "border-curry-leaf",
    accent: "accent-curry-leaf",
  },
  {
    id: "vegan",
    title: "Vegan",
    detail: "No animal products.",
    border: "border-kattam-blue",
    accent: "accent-kattam-blue",
  },
  {
    id: "reduce",
    title: "Reduce meat",
    detail: "Fewer meat meals, no hard rule yet.",
    border: "border-ink",
    accent: "accent-ink",
  },
];

export default function DietModeStep() {
  const [mode, setMode] = useState(user.dietMode as string);

  return (
    <OnboardingStep
      step={3}
      total={7}
      back="/onboarding/baseline"
      title="Which mode should we filter every suggestion by?"
      continueHref="/onboarding/cuisine"
    >
      <div className="flex flex-col gap-2.5">
        {modes.map((m) => {
          const selected = m.id === mode;
          return (
            <label
              key={m.id}
              className={`flex items-start gap-3 rounded-[6px] border px-4 py-3.5 cursor-pointer ${
                selected ? `border-2 ${m.border}` : "border-hairline bg-surface"
              }`}
            >
              <input
                type="radio"
                name="diet-mode"
                checked={selected}
                onChange={() => setMode(m.id)}
                className={`mt-1 ${m.accent}`}
              />
              <span>
                <span className="block text-[0.9375rem] font-medium">{m.title}</span>
                <span className="block text-[0.8125rem] text-ink-soft">{m.detail}</span>
              </span>
            </label>
          );
        })}
      </div>
      <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
        never nullable — hard filter
      </p>
    </OnboardingStep>
  );
}
