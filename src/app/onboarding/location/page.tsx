import { OnboardingStep } from "@/components/ui/OnboardingStep";
import { LocationPicker } from "@/components/ui/LocationPicker";
import { user } from "@/lib/fixtures";

export default function LocationStep() {
  return (
    <OnboardingStep
      step={6}
      total={7}
      back="/onboarding/preferences"
      title="Where do you usually eat?"
      subtitle="Pick the city and area you eat in most. You can change it any time."
      continueHref="/onboarding/plan"
    >
      <LocationPicker defaultCity={user.city} defaultArea={user.area} />

      <p className="text-[0.8125rem] text-ink-soft">
        ⓘ We never store a location history you didn&rsquo;t ask for.
      </p>
    </OnboardingStep>
  );
}
