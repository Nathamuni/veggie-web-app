"use client";

import { useState } from "react";
import { OnboardingStep } from "@/components/ui/OnboardingStep";
import { user } from "@/lib/fixtures";

const goals = [
  "Reduce meat",
  "Stop red meat",
  "Become vegetarian",
  "Become vegan",
  "Increase vegetarian meals",
  "Increase vegan meals",
];

export default function GoalStep() {
  const [goal, setGoal] = useState(user.goal as string);

  return (
    <OnboardingStep
      step={1}
      total={7}
      back="/auth/sign-up"
      title="What should Veggie help you do?"
      continueHref="/onboarding/baseline"
    >
      <div className="flex flex-col gap-2.5">
        {goals.map((g) => {
          const selected = g === goal;
          return (
            <label
              key={g}
              className={`flex items-center gap-3 rounded-[6px] border px-4 py-3 text-[0.9375rem] cursor-pointer ${
                selected ? "border-2 border-ink font-medium" : "border-hairline bg-surface"
              }`}
            >
              <input
                type="radio"
                name="goal"
                checked={selected}
                onChange={() => setGoal(g)}
                className="accent-ink"
              />
              {g}
            </label>
          );
        })}
      </div>
      <p className="text-[0.8125rem] text-ink-soft">Pick one. You can change this any time.</p>
    </OnboardingStep>
  );
}
