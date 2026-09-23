"use client";

import { useState } from "react";
import Link from "next/link";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ModeTag } from "@/components/ui/ModeTag";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { LocationPicker } from "@/components/ui/LocationPicker";
import { user } from "@/lib/fixtures";
import type { DietMode } from "@/lib/fixtures";

const cuisineOptions = [
  "Tamil",
  "Kerala",
  "Andhra",
  "Telangana",
  "Karnataka",
  "Chettinad",
  "Punjabi",
  "Gujarati",
  "North Indian",
  "Maharashtrian",
  "Bengali",
  "Rajasthani",
  "Continental",
];

const commonAllergens = ["Peanut", "Tree nuts", "Dairy", "Gluten", "Soy", "Shellfish", "Sesame"];

const budgetOptions = ["<₹100", "₹100–200", "₹200+"];
const cookTimeOptions = ["<20 min", "20–45 min", "45+ min"];

type ConfirmStep = "idle" | "confirm" | "done";
type ConsentKey = "personalise" | "productEmails" | "research";

const consentCopy: Record<ConsentKey, { label: string; helper: string }> = {
  personalise: {
    label: "Personalise my food recommendations",
    helper: "Uses your logged meals and preferences to tailor what's suggested.",
  },
  productEmails: {
    label: "Product emails",
    helper: "Occasional updates about new features. No marketing lists.",
  },
  research: {
    label: "Research / analytics",
    helper: "Anonymised usage patterns, used only to improve recommendations generally.",
  },
};

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
      <p className="mb-1.5 text-[0.8125rem] font-medium">{label}</p>
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

function ConsentRow({
  label,
  helper,
  checked,
  required = false,
  onToggle,
}: {
  label: string;
  helper: string;
  checked: boolean;
  required?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[0.875rem] font-medium">
          {label}
          {required ? (
            <span className="ml-2 font-mono text-[0.625rem] uppercase tracking-wide text-ink-soft">
              Required
            </span>
          ) : null}
        </p>
        <p className="mt-0.5 text-[0.75rem] text-ink-soft">{helper}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        disabled={required}
        onChange={onToggle}
        aria-label={label}
        className={`mt-1 h-4 w-4 shrink-0 accent-turmeric ${required ? "opacity-50" : ""}`}
      />
    </div>
  );
}

export default function SettingsPage() {
  const [goal, setGoal] = useState<string>(user.goal);
  const [dietMode, setDietMode] = useState<DietMode>(user.dietMode);
  const [cuisines, setCuisines] = useState<string[]>([...user.cuisines]);
  const [noAllergies, setNoAllergies] = useState(user.allergies.length === 0);
  const [allergies, setAllergies] = useState<string[]>([...user.allergies]);
  const [eatsEggs, setEatsEggs] = useState(user.eatsEggs);
  const [eatsDairy, setEatsDairy] = useState(user.eatsDairy);
  const [jain, setJain] = useState(user.jain);
  const [budget, setBudget] = useState(user.budgetBand);
  const [cookTime, setCookTime] = useState(user.cookingTime);

  const [consent, setConsent] = useState<Record<ConsentKey, boolean>>({
    personalise: true,
    productEmails: false,
    research: false,
  });

  const [exportStep, setExportStep] = useState<ConfirmStep>("idle");
  const [deleteStep, setDeleteStep] = useState<ConfirmStep>("idle");

  function toggleCuisine(c: string) {
    setCuisines((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  function toggleAllergy(a: string) {
    setAllergies((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }

  const cuisineChips = Array.from(new Set([...cuisineOptions, ...cuisines]));

  const completedFields = [
    goal.trim().length > 0,
    true, // diet mode always has a value
    cuisines.length > 0,
    noAllergies || allergies.length > 0,
    true, // eggs preference always has a value
    true, // dairy preference always has a value
    true, // jain preference always has a value
    budget.trim().length > 0,
    cookTime.trim().length > 0,
    true, // location is always present (static)
  ];
  const completedCount = completedFields.filter(Boolean).length;

  return (
    <main className="flex-1 pb-8">
      <Shell>
        <Link href="/app" className="mt-5 inline-block text-ink">
          ← Home
        </Link>
        <PageTitle eyebrow="You">Profile &amp; Settings</PageTitle>

        <div className="mb-6 xl:max-w-[520px]">
          <ProgressBar value={completedCount} max={10} label="Profile completeness" />
        </div>

        <div className="flex flex-col gap-4 xl:block xl:columns-2 xl:gap-6 xl:*:mb-6 xl:*:break-inside-avoid">
          <Card>
            <CardTitle>
              <span id="diet-mode" className="scroll-mt-4">Goal &amp; diet mode</span>
            </CardTitle>
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[0.8125rem] font-medium">Goal</span>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="rounded-[6px] border border-hairline bg-surface px-3 py-2.5 text-[0.875rem] outline-none focus:border-turmeric"
                />
              </label>
              <div>
                <p className="mb-1.5 text-[0.8125rem] font-medium">Diet mode</p>
                <div className="flex gap-2">
                  {(["vegetarian", "vegan"] as DietMode[]).map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setDietMode(m)}
                      className={`flex flex-1 items-center justify-center rounded-[6px] border px-3 py-2 ${
                        dietMode === m ? "border-2 border-ink" : "border-hairline"
                      }`}
                    >
                      <ModeTag mode={m} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardTitle>Cuisines</CardTitle>
            <div className="flex flex-wrap gap-2">
              {cuisineChips.map((c) => {
                const selected = cuisines.includes(c);
                return (
                  <button
                    type="button"
                    key={c}
                    onClick={() => toggleCuisine(c)}
                    className={`rounded-full border px-3 py-1 text-[0.75rem] ${
                      selected
                        ? "border-2 border-ink font-medium text-ink"
                        : "border-hairline bg-surface text-ink-soft"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardTitle>Allergies &amp; preferences</CardTitle>
            <div className="flex flex-col gap-4">
              <div>
                <p className="mb-1.5 text-[0.8125rem] font-medium">Allergies</p>
                <label className="mb-2 flex items-center gap-2 text-[0.875rem]">
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
                {!noAllergies ? (
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set([...commonAllergens, ...allergies])).map((a) => {
                      const selected = allergies.includes(a);
                      return (
                        <button
                          type="button"
                          key={a}
                          onClick={() => toggleAllergy(a)}
                          className={`rounded-full border px-3 py-1 text-[0.75rem] ${
                            selected
                              ? "border-rust bg-rust-tint text-rust"
                              : "border-hairline bg-surface text-ink-soft"
                          }`}
                        >
                          {a}
                          {selected ? " ✕" : ""}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ChoiceRow
                  label="Eggs"
                  options={["Yes", "No"]}
                  selected={eatsEggs ? "Yes" : "No"}
                  onSelect={(v) => setEatsEggs(v === "Yes")}
                />
                <ChoiceRow
                  label="Dairy"
                  options={["Yes", "No"]}
                  selected={eatsDairy ? "Yes" : "No"}
                  onSelect={(v) => setEatsDairy(v === "Yes")}
                />
              </div>
              <ChoiceRow
                label="Jain / no onion-garlic"
                options={["Yes", "No"]}
                selected={jain ? "Yes" : "No"}
                onSelect={(v) => setJain(v === "Yes")}
              />
              <ChoiceRow label="Budget per meal" options={budgetOptions} selected={budget} onSelect={setBudget} />
              <ChoiceRow label="Time to cook" options={cookTimeOptions} selected={cookTime} onSelect={setCookTime} />
            </div>
          </Card>

          <Card>
            <CardTitle>
              <span id="location" className="scroll-mt-4">Location</span>
            </CardTitle>
            <LocationPicker defaultCity={user.city} defaultArea={user.area} />
          </Card>

          <Card>
            <CardTitle>Consent</CardTitle>
            <div className="flex flex-col gap-4">
              <ConsentRow
                label="Terms &amp; Privacy"
                helper="Needed to use Veggie at all — can't be turned off."
                checked
                required
              />
              {(Object.keys(consentCopy) as ConsentKey[]).map((key) => (
                <ConsentRow
                  key={key}
                  label={consentCopy[key].label}
                  helper={consentCopy[key].helper}
                  checked={consent[key]}
                  onToggle={() => setConsent((prev) => ({ ...prev, [key]: !prev[key] }))}
                />
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle>Your data</CardTitle>
            <div className="flex flex-col gap-4">
              <div>
                <p className="mb-1 text-[0.875rem] font-medium">Export my data</p>
                <p className="mb-2 text-[0.75rem] text-ink-soft">
                  Download a copy of everything logged under this profile.
                </p>
                {exportStep === "idle" ? (
                  <Button variant="secondary" onClick={() => setExportStep("confirm")}>
                    Export my data
                  </Button>
                ) : null}
                {exportStep === "confirm" ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[0.8125rem]">Are you sure?</span>
                    <Button variant="secondary" onClick={() => setExportStep("done")}>
                      Confirm
                    </Button>
                    <Button variant="ghost" onClick={() => setExportStep("idle")}>
                      Cancel
                    </Button>
                  </div>
                ) : null}
                {exportStep === "done" ? (
                  <p className="text-[0.8125rem] font-medium text-ink">Request received (prototype).</p>
                ) : null}
              </div>

              <div className="border-t border-hairline pt-4">
                <p className="mb-1 text-[0.875rem] font-medium text-rust">Delete account</p>
                <p className="mb-2 text-[0.75rem] text-ink-soft">
                  Permanently removes your profile and logged data.
                </p>
                {deleteStep === "idle" ? (
                  <button
                    type="button"
                    onClick={() => setDeleteStep("confirm")}
                    className="inline-flex items-center justify-center gap-2 rounded-[4px] border border-rust bg-surface px-5 py-3 text-[0.9375rem] font-semibold text-rust transition-colors hover:bg-rust-tint"
                  >
                    Delete account
                  </button>
                ) : null}
                {deleteStep === "confirm" ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[0.8125rem] text-rust">Are you sure? This can&rsquo;t be undone.</span>
                    <button
                      type="button"
                      onClick={() => setDeleteStep("done")}
                      className="inline-flex items-center justify-center rounded-[4px] border border-rust bg-rust-tint px-4 py-2 text-[0.8125rem] font-semibold text-rust"
                    >
                      Confirm
                    </button>
                    <Button variant="ghost" onClick={() => setDeleteStep("idle")}>
                      Cancel
                    </Button>
                  </div>
                ) : null}
                {deleteStep === "done" ? (
                  <p className="text-[0.8125rem] font-medium text-rust">Request received (prototype).</p>
                ) : null}
              </div>
            </div>
          </Card>
        </div>
      </Shell>
    </main>
  );
}
