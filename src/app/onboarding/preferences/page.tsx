"use client";

import { useState } from "react";
import { OnboardingStep } from "@/components/ui/OnboardingStep";
import { user } from "@/lib/fixtures";

const commonAllergens = ["Peanut", "Tree nuts", "Dairy", "Gluten", "Soy", "Shellfish", "Sesame"];

function AllergyPicker({
  allergies,
  onToggle,
  onAddCustom,
}: {
  allergies: string[];
  onToggle: (a: string) => void;
  onAddCustom: (a: string) => void;
}) {
  const [draft, setDraft] = useState("");
  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {commonAllergens.map((a) => {
          const selected = allergies.includes(a);
          return (
            <button
              type="button"
              key={a}
              onClick={() => onToggle(a)}
              className={`rounded-full border px-3 py-1 text-[0.75rem] ${
                selected ? "border-rust bg-rust-tint text-rust" : "border-hairline bg-surface text-ink-soft"
              }`}
            >
              {a}
              {selected ? " ✕" : ""}
            </button>
          );
        })}
        {allergies
          .filter((a) => !commonAllergens.includes(a))
          .map((a) => (
            <button
              type="button"
              key={a}
              onClick={() => onToggle(a)}
              className="rounded-full border border-rust bg-rust-tint px-3 py-1 text-[0.75rem] text-rust"
            >
              {a} ✕
            </button>
          ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && draft.trim()) {
              e.preventDefault();
              onAddCustom(draft.trim());
              setDraft("");
            }
          }}
          placeholder="Type an allergy and press Enter"
          className="flex-1 rounded-[6px] border border-hairline bg-surface px-3 py-2 text-[0.8125rem] outline-none focus:border-turmeric"
        />
      </div>
    </div>
  );
}

function ChoiceRow({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[0.8125rem] font-medium">
        {label} <span className="text-rust">*</span>
      </p>
      <div className="flex gap-2">
        {options.map((o) => (
          <button
            type="button"
            key={o}
            onClick={() => onSelect(o)}
            className={`flex-1 rounded-[6px] border px-3 py-2 text-center text-[0.8125rem] ${
              o === selected
                ? "border-2 border-ink font-medium"
                : "border-hairline bg-surface text-ink-soft"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PreferencesStep() {
  const [noAllergies, setNoAllergies] = useState(user.allergies.length === 0);
  const [allergies, setAllergies] = useState<string[]>([...user.allergies]);
  const [eatsEggs, setEatsEggs] = useState(user.eatsEggs);
  const [eatsDairy, setEatsDairy] = useState(user.eatsDairy);
  const [jain, setJain] = useState(user.jain ? "Yes" : "No");
  const [budget, setBudget] = useState<string>(user.budgetBand);
  const [cookTime, setCookTime] = useState("20–45m");
  const [skill, setSkill] = useState<string>(user.cookingSkill);

  return (
    <OnboardingStep
      step={5}
      total={7}
      back="/onboarding/cuisine"
      title="Anything we should know before recommending?"
      continueHref="/onboarding/location"
    >
      <div>
        <p className="mb-1.5 text-[0.8125rem] font-medium">
          Allergies <span className="text-rust">*</span>
        </p>
        <label className="flex items-center gap-2 text-[0.875rem]">
          <input
            type="checkbox"
            checked={noAllergies}
            onChange={(e) => {
              setNoAllergies(e.target.checked);
              if (e.target.checked) setAllergies([]);
            }}
            className="accent-turmeric"
          />
          I have no allergies
        </label>
        <p className="mt-1 text-[0.75rem] text-ink-soft">
          ⓘ Silence is never accepted — tell us or tick &ldquo;none&rdquo;.
        </p>
        {!noAllergies ? (
          <AllergyPicker
            allergies={allergies}
            onToggle={(a) =>
              setAllergies((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]))
            }
            onAddCustom={(a) => setAllergies((prev) => (prev.includes(a) ? prev : [...prev, a]))}
          />
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChoiceRow label="Eggs" options={["Yes", "No"]} selected={eatsEggs ? "Yes" : "No"} onSelect={(v) => setEatsEggs(v === "Yes")} />
        <ChoiceRow label="Dairy" options={["Yes", "No"]} selected={eatsDairy ? "Yes" : "No"} onSelect={(v) => setEatsDairy(v === "Yes")} />
      </div>

      <ChoiceRow label="Jain / no onion-garlic" options={["Yes", "No"]} selected={jain} onSelect={setJain} />
      <ChoiceRow
        label="Budget per meal"
        options={["<₹100", "₹100–200", "₹200+"]}
        selected={budget}
        onSelect={setBudget}
      />
      <ChoiceRow
        label="Time to cook"
        options={["<20m", "20–45m", "45m+"]}
        selected={cookTime}
        onSelect={setCookTime}
      />
      <ChoiceRow
        label="Cooking skill"
        options={["New", "Confident", "Skilled"]}
        selected={skill}
        onSelect={setSkill}
      />
    </OnboardingStep>
  );
}
