"use client";

import { useState } from "react";
import { OnboardingStep } from "@/components/ui/OnboardingStep";
import { user } from "@/lib/fixtures";

const regions = [
  { name: "South", options: ["Tamil", "Kerala", "Andhra", "Chettinad", "Karnataka", "Telangana"] },
  { name: "North", options: ["Punjabi", "Rajasthani", "Gujarati"] },
  { name: "West · East · Intl", options: ["Maharashtrian", "Bengali", "Continental"] },
];

const spiceLevels = ["Mild", "Medium", "Medium-high", "Fiery"];
const textureOptions = ["Crispy", "Soft / mushy", "Chewy", "Creamy", "Crunchy", "Juicy"];

function TagInput({
  tags,
  onAdd,
  onRemove,
  placeholder,
}: {
  tags: string[];
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");
  return (
    <div className="flex flex-col gap-2">
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => onRemove(t)}
              className="rounded-full border border-ink bg-ink px-3 py-1 text-[0.75rem] text-surface"
            >
              {t} ✕
            </button>
          ))}
        </div>
      ) : null}
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && draft.trim()) {
            e.preventDefault();
            onAdd(draft.trim());
            setDraft("");
          }
        }}
        placeholder={placeholder}
        className="rounded-[6px] border border-hairline bg-surface px-3 py-2 text-[0.8125rem] outline-none focus:border-turmeric"
      />
    </div>
  );
}

export default function CuisineStep() {
  const [cuisines, setCuisines] = useState<string[]>([...user.cuisines]);
  const [spiceIndex, setSpiceIndex] = useState(
    Math.max(0, spiceLevels.indexOf(user.spiceLevel))
  );
  const [textures, setTextures] = useState<string[]>(["Crispy", "Crunchy"]);
  const [favouriteDishes, setFavouriteDishes] = useState<string[]>([
    "Chettinad chicken curry",
    "Mutton biryani",
  ]);
  const [dislikedFoods, setDislikedFoods] = useState<string[]>(["Bitter gourd", "Raw onion"]);

  function toggleTexture(t: string) {
    setTextures((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function toggleCuisine(c: string) {
    setCuisines((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  const spicePct = (spiceIndex / (spiceLevels.length - 1)) * 100;

  return (
    <OnboardingStep
      step={4}
      total={7}
      back="/onboarding/diet"
      title="Which food do you actually eat?"
      subtitle="Pick at least one — two or three is even better."
      continueHref="/onboarding/preferences"
    >
      <input
        type="search"
        placeholder="🔍 Search cuisines"
        className="rounded-[6px] border border-hairline bg-surface px-3 py-2.5 text-[0.875rem] outline-none focus:border-turmeric"
      />

      <div className="flex flex-col gap-4">
        {regions.map((r) => (
          <div key={r.name}>
            <p className="mb-2 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
              {r.name} ▸
            </p>
            <div className="flex flex-wrap gap-2">
              {r.options.map((c) => {
                const selected = cuisines.includes(c);
                return (
                  <button
                    type="button"
                    key={c}
                    onClick={() => toggleCuisine(c)}
                    className={`rounded-full border px-3 py-1.5 text-[0.8125rem] ${
                      selected
                        ? "border-ink bg-ink text-surface"
                        : "border-hairline bg-surface text-ink"
                    }`}
                  >
                    {c}
                    {selected ? " ✓" : ""}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="text-[0.8125rem] font-medium">Spice level</span>
        </div>
        <div className="flex items-center gap-2 text-[0.75rem] text-ink-soft">
          <span>mild</span>
          <div className="relative h-6 flex-1">
            <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-hairline" />
            <div
              className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-ink bg-surface transition-[left]"
              style={{ left: `${spicePct}%` }}
            />
            <div className="absolute inset-0 flex">
              {spiceLevels.map((level, i) => (
                <button
                  key={level}
                  type="button"
                  aria-label={level}
                  onClick={() => setSpiceIndex(i)}
                  className="flex-1"
                />
              ))}
            </div>
          </div>
          <span>fiery</span>
        </div>
        <p className="mt-1 text-right font-mono text-[0.75rem] text-ink">
          {spiceLevels[spiceIndex]}
        </p>
      </div>

      <div className="border-t border-hairline pt-4">
        <p className="mb-3 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
          Optional
        </p>

        <div className="mb-4">
          <p className="mb-1.5 text-[0.8125rem] font-medium">Textures you like</p>
          <div className="flex flex-wrap gap-2">
            {textureOptions.map((t) => {
              const selected = textures.includes(t);
              return (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggleTexture(t)}
                  className={`rounded-full border px-3 py-1.5 text-[0.8125rem] ${
                    selected ? "border-ink bg-ink text-surface" : "border-hairline bg-surface text-ink"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-4">
          <p className="mb-1.5 text-[0.8125rem] font-medium">Favourite dishes</p>
          <p className="mb-1.5 text-[0.75rem] text-ink-soft">
            Meat dishes you actually miss — this is what the swap engine targets.
          </p>
          <TagInput
            tags={favouriteDishes}
            onAdd={(v) => setFavouriteDishes((prev) => [...prev, v])}
            onRemove={(v) => setFavouriteDishes((prev) => prev.filter((x) => x !== v))}
            placeholder="Type a dish and press Enter"
          />
        </div>

        <div>
          <p className="mb-1.5 text-[0.8125rem] font-medium">Foods you dislike</p>
          <TagInput
            tags={dislikedFoods}
            onAdd={(v) => setDislikedFoods((prev) => [...prev, v])}
            onRemove={(v) => setDislikedFoods((prev) => prev.filter((x) => x !== v))}
            placeholder="Type a food and press Enter"
          />
        </div>
      </div>
    </OnboardingStep>
  );
}
