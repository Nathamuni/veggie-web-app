"use client";

import { useActionState, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { ChoiceChip, ChoiceRow, FieldLabel } from "@/components/ui/Choice";
import { Stepper } from "@/components/ui/Stepper";
import { LocationPicker } from "@/components/ui/LocationPicker";
import { saveOnboardingStep, updateProfileSection } from "@/app/actions/profile";
import { COOK_TIMES, CUISINE_GROUPS, DIET_MODES, GOALS, SPICE_LEVELS, suggestedPlantTarget } from "@/lib/profile-options";

export type ProfileView = {
  goal: string;
  dietMode: string;
  baselineMeatMeals: number;
  weeklyPlantTarget: number;
  cuisines: string[];
  spice: string;
  maxCookMinutes: number;
  city: string | null;
  area: string | null;
};

type Mode = "onboarding" | "settings";

function Form({
  step,
  mode,
  children,
  submitLabel = "Continue",
}: {
  step: 1 | 2 | 3 | 4;
  mode: Mode;
  children: ReactNode;
  submitLabel?: string;
}) {
  const [state, action, pending] = useActionState(
    (mode === "settings" ? updateProfileSection : saveOnboardingStep).bind(null, step),
    undefined,
  );
  const settings = mode === "settings";
  return (
    <form action={action} className="flex flex-col gap-6">
      {children}
      {state?.error ? (
        <p role="alert" className="text-[0.875rem] text-rust">
          {state.error}
        </p>
      ) : null}
      <div className="flex items-center gap-3">
        <Button type="submit" variant={settings ? "secondary" : "primary"} className={settings ? "" : "w-full"} disabled={pending}>
          {pending ? "Saving…" : settings ? "Save changes" : submitLabel}
        </Button>
        {settings && state?.saved && !pending ? (
          <span role="status" className="text-[0.875rem] text-curry-leaf">
            ✓ Saved
          </span>
        ) : null}
      </div>
    </form>
  );
}

export function GoalStep({ profile, mode = "onboarding" }: { profile: ProfileView; mode?: Mode }) {
  return (
    <Form mode={mode} step={1}>
      <fieldset className="flex flex-col gap-2">
        <FieldLabel>What should Veggie help you do?</FieldLabel>
        {GOALS.map((g) => (
          <ChoiceRow key={g.id} name="goal" value={g.id} label={g.label} hint={g.hint} defaultChecked={profile.goal === g.id} />
        ))}
      </fieldset>
      <fieldset className="flex flex-col gap-2">
        <FieldLabel hint="Your meal suggestions follow this strictly.">Which dishes should we suggest?</FieldLabel>
        {DIET_MODES.map((d) => (
          <ChoiceRow key={d.id} name="dietMode" value={d.id} label={d.label} hint={d.hint} defaultChecked={profile.dietMode === d.id} />
        ))}
      </fieldset>
    </Form>
  );
}

export function WeekStep({ profile, mode = "onboarding" }: { profile: ProfileView; mode?: Mode }) {
  const alreadyVeg = profile.goal === "more_veg_meals";
  const [baseline, setBaseline] = useState(alreadyVeg ? 0 : profile.baselineMeatMeals);
  const [target, setTarget] = useState(profile.weeklyPlantTarget);
  const [touched, setTouched] = useState(false);

  return (
    <Form mode={mode} step={2}>
      {alreadyVeg ? (
        <input type="hidden" name="baselineMeatMeals" value={0} />
      ) : (
        <fieldset>
          <FieldLabel hint="Out of 21 meals — breakfast, lunch and dinner. A rough guess is fine.">
            In a usual week, how many meals have meat, fish or egg?
          </FieldLabel>
          <Stepper
            name="baselineMeatMeals"
            label="meat meals"
            unit="meals / week"
            min={0}
            max={21}
            value={baseline}
            onChange={(n) => {
              setBaseline(n);
              if (!touched) setTarget(suggestedPlantTarget(n));
            }}
          />
        </fieldset>
      )}
      <fieldset>
        <FieldLabel hint="Start small — you can raise it any time. A meat meal never resets your week.">
          Plant-based meals to aim for each week
        </FieldLabel>
        <Stepper
          name="weeklyPlantTarget"
          label="plant meals"
          unit="meals / week"
          min={1}
          max={21}
          value={target}
          onChange={(n) => {
            setTouched(true);
            setTarget(n);
          }}
        />
        <p className="mt-3 text-[0.8125rem] text-ink-soft">
          That&apos;s about {Math.max(1, Math.round(target / 7))} a day.
        </p>
      </fieldset>
    </Form>
  );
}

export function TasteStep({ profile, mode = "onboarding" }: { profile: ProfileView; mode?: Mode }) {
  return (
    <Form mode={mode} step={3}>
      <fieldset>
        <FieldLabel hint="Pick the food you grew up with or love. We'll lead with it.">Cuisines you enjoy</FieldLabel>
        <div className="flex flex-col gap-4">
          {CUISINE_GROUPS.map((g) => (
            <div key={g.name}>
              <p className="mb-2 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">{g.name}</p>
              <div className="flex flex-wrap gap-2">
                {g.options.map((c) => (
                  <ChoiceChip key={c} name="cuisines" value={c} defaultChecked={profile.cuisines.includes(c)}>
                    {c}
                  </ChoiceChip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <FieldLabel>How spicy?</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {SPICE_LEVELS.map((s) => (
            <ChoiceChip key={s.id} type="radio" name="spice" value={s.id} defaultChecked={profile.spice === s.id}>
              {s.label}
            </ChoiceChip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <FieldLabel hint="On a normal weekday, prep to plate.">Time you have to cook</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {COOK_TIMES.map((t) => (
            <ChoiceChip
              key={t.minutes}
              type="radio"
              name="maxCookMinutes"
              value={String(t.minutes)}
              defaultChecked={profile.maxCookMinutes === t.minutes}
            >
              {t.label}
            </ChoiceChip>
          ))}
        </div>
      </fieldset>
    </Form>
  );
}

export function PlaceStep({ profile, mode = "onboarding" }: { profile: ProfileView; mode?: Mode }) {
  return (
    <Form mode={mode} step={4} submitLabel="See my first week">
      <LocationPicker defaultCity={profile.city ?? "Chennai"} defaultArea={profile.area ?? ""} />
      <p className="text-[0.8125rem] text-ink-soft">
        We use this only to show veg-friendly places near you. No location history is kept.
      </p>
    </Form>
  );
}
