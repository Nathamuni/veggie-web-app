"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ModeTag } from "@/components/ui/ModeTag";
import { SourceLabel } from "@/components/ui/SourceLabel";
import { EmptyState } from "@/components/ui/EmptyState";
import { StepProgress } from "@/components/ui/ProgressBar";
import {
  user,
  swapRules,
  findSwapRule,
  type SwapAlternative,
  type SwapDimension,
  type SwapRule,
} from "@/lib/fixtures";

const dimensions: { id: SwapDimension; label: string; hint: string }[] = [
  { id: "spice", label: "Spice", hint: "Same heat level" },
  { id: "texture", label: "Texture", hint: "A bite, a crunch, a chew" },
  { id: "fullness", label: "Fullness", hint: "Still full afterwards" },
  { id: "cuisine", label: "Familiarity", hint: "Same regional plate" },
];

type Step = "craving" | "matters" | "results";

/**
 * UC-02: diet-mode hard filter FIRST (a vegan user never sees a vegetarian-only
 * item), then rank by overlap with the dimensions the user said matter. Ties
 * keep fixture order, which is the editorial order of the rule.
 */
function rankAlternatives(rule: SwapRule, chosen: SwapDimension[]): SwapAlternative[] {
  const allowed = rule.alternatives.filter((a) =>
    user.dietMode === "vegan" ? a.dietMode === "vegan" : true
  );
  return allowed
    .map((alt, index) => ({
      alt,
      index,
      score: alt.preserves.filter((d) => chosen.includes(d)).length,
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((r) => r.alt);
}

function cookHref(alt: SwapAlternative) {
  return alt.target.kind === "recipe"
    ? `/app/recipes/${alt.target.id}`
    : `/app/combos/${alt.target.id}`;
}

export default function CravingPage() {
  const [step, setStep] = useState<Step>("craving");
  const [ruleId, setRuleId] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [cravingLabel, setCravingLabel] = useState("");
  const [chosen, setChosen] = useState<SwapDimension[]>([]);
  const [pickedName, setPickedName] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // Move focus to the new step's heading so screen readers announce the change.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const rule = ruleId ? swapRules.find((r) => r.id === ruleId) ?? null : null;
  const ranked = rule ? rankAlternatives(rule, chosen) : [];

  function pickRule(r: SwapRule) {
    setRuleId(r.id);
    setCravingLabel(r.craving);
    setPickedName(null);
    setStep("matters");
  }

  function submitTyped(e: FormEvent) {
    e.preventDefault();
    const text = typed.trim();
    if (!text) return;
    const match = findSwapRule(text);
    setPickedName(null);
    if (match) {
      pickRule(match);
    } else {
      setRuleId(null);
      setCravingLabel(text);
      setStep("results");
    }
  }

  function toggleDimension(d: SwapDimension) {
    setChosen((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  }

  function restart() {
    setStep("craving");
    setRuleId(null);
    setTyped("");
    setCravingLabel("");
    setChosen([]);
    setPickedName(null);
  }

  const stepNumber = step === "craving" ? 1 : step === "matters" ? 2 : 3;
  const headingCls =
    "mb-1 text-[1.5rem] font-semibold leading-tight tracking-tight outline-none";

  return (
    <main className="flex-1 pb-8">
      <Shell>
        {step === "craving" ? (
          <Link href="/app/transition" className="mt-5 inline-block text-ink">
            ← Transition centre
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => (step === "results" && rule ? setStep("matters") : restart())}
            className="mt-5 inline-block text-ink"
          >
            ← Back
          </button>
        )}
        <PageTitle eyebrow="I'm craving…">Find a swap that satisfies</PageTitle>

        <div className="mb-5 md:max-w-[560px]">
          <StepProgress step={stepNumber} total={3} />
        </div>

        {step === "craving" ? (
          <section aria-labelledby="craving-heading" className="md:max-w-[560px]">
            <h2 id="craving-heading" ref={headingRef} tabIndex={-1} className={headingCls}>
              What are you craving?
            </h2>
            <p className="mb-4 text-[0.875rem] text-ink-soft">
              Pick one, or type the dish. No judgement — cravings are information.
            </p>
            <ul className="mb-5 flex flex-col gap-2">
              {swapRules.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => pickRule(r)}
                    className="flex w-full items-center justify-between gap-3 rounded-[6px] border border-hairline bg-surface px-4 py-3 text-left text-[0.9375rem] font-medium transition-colors hover:border-ink-soft"
                  >
                    {r.craving}
                    <span aria-hidden="true" className="text-ink-soft">
                      →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <form onSubmit={submitTyped} className="flex flex-col gap-2">
              <label htmlFor="craving-input" className="text-[0.8125rem] font-medium">
                Something else? Type it
              </label>
              <div className="flex gap-2">
                <input
                  id="craving-input"
                  type="text"
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  placeholder="e.g. prawn fry"
                  autoComplete="off"
                  className="min-w-0 flex-1 rounded-[6px] border border-hairline bg-surface px-3 py-2.5 text-[0.9375rem] text-ink focus:border-2 focus:border-turmeric focus:outline-none"
                />
                <Button type="submit" variant="secondary" disabled={!typed.trim()}>
                  Next
                </Button>
              </div>
            </form>
          </section>
        ) : null}

        {step === "matters" && rule ? (
          <section aria-labelledby="matters-heading" className="md:max-w-[560px]">
            <h2 id="matters-heading" ref={headingRef} tabIndex={-1} className={headingCls}>
              What matters most?
            </h2>
            <p className="mb-4 text-[0.875rem] text-ink-soft">
              About your {rule.craving.toLowerCase()} craving. Pick any — we&rsquo;ll keep those.
            </p>
            <fieldset className="mb-6">
              <legend className="sr-only">What matters most about this craving</legend>
              <div className="grid grid-cols-2 gap-2">
                {dimensions.map((d) => {
                  const selected = chosen.includes(d.id);
                  return (
                    <button
                      type="button"
                      key={d.id}
                      aria-pressed={selected}
                      onClick={() => toggleDimension(d.id)}
                      className={`rounded-[6px] border px-3 py-3 text-left ${
                        selected ? "border-2 border-ink bg-surface" : "border-hairline bg-surface"
                      }`}
                    >
                      <span className="block text-[0.9375rem] font-medium">
                        {d.label}
                        {selected ? " ✓" : ""}
                      </span>
                      <span className="block text-[0.75rem] text-ink-soft">{d.hint}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <Button className="w-full" onClick={() => setStep("results")}>
              {chosen.length === 0 ? "Show all swaps" : "Show my swaps"}
            </Button>
          </section>
        ) : null}

        {step === "results" ? (
          <section aria-labelledby="results-heading">
            <h2 id="results-heading" ref={headingRef} tabIndex={-1} className={headingCls}>
              {rule ? `Instead of ${rule.craving.toLowerCase()}` : "Nothing tested yet"}
            </h2>

            {!rule ? (
              <div className="mt-3 md:max-w-[560px]">
                <EmptyState
                  title="We don't have a tested swap for this yet"
                  reason={`“${cravingLabel}” isn't in our swap list. Rather than guess, try building a plate around what you have.`}
                  actionHref="/app/complete-meal"
                  actionLabel="Complete my meal"
                >
                  <div className="mt-2 flex flex-col items-center gap-1">
                    <Link
                      href="/app/recipes"
                      className="text-[0.8125rem] text-ink underline underline-offset-2"
                    >
                      Browse recipes
                    </Link>
                    <button
                      type="button"
                      onClick={restart}
                      className="text-[0.8125rem] text-ink-soft underline underline-offset-2"
                    >
                      Pick a different craving
                    </button>
                  </div>
                </EmptyState>
              </div>
            ) : ranked.length === 0 ? (
              <div className="mt-3 md:max-w-[560px]">
                <EmptyState
                  title={`No tested ${user.dietMode} swap for this yet`}
                  reason="The swaps we have for this craving don't fit your diet mode, so we're not showing them."
                  actionHref="/app/complete-meal"
                  actionLabel="Complete my meal"
                >
                  <Link
                    href="/app/recipes"
                    className="mt-2 inline-block text-[0.8125rem] text-ink underline underline-offset-2"
                  >
                    Browse recipes
                  </Link>
                </EmptyState>
              </div>
            ) : (
              <>
                <p className="mb-4 max-w-[75ch] text-[0.875rem] text-ink-soft">
                  {chosen.length > 0
                    ? `Ranked by what you said matters: ${dimensions
                        .filter((d) => chosen.includes(d.id))
                        .map((d) => d.label.toLowerCase())
                        .join(", ")}.`
                    : "Our best matches, most-similar first."}{" "}
                  Showing {user.dietMode === "vegan" ? "vegan only" : "vegetarian and vegan"}.
                </p>
                <ol className="flex flex-col gap-3 md:grid md:grid-cols-2 2xl:grid-cols-3">
                  {ranked.map((alt, i) => {
                    const picked = pickedName === alt.name;
                    return (
                      <li key={`${alt.target.kind}-${alt.target.id}`}>
                        <Card className={`md:flex md:h-full md:flex-col ${picked ? "border-2 border-ink" : ""}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <SourceLabel>
                                #{i + 1} · {alt.target.kind === "recipe" ? "Recipe" : "Combo"}
                              </SourceLabel>
                              <h3 className="mt-0.5 text-[1.125rem] font-semibold leading-tight">
                                {alt.name}
                              </h3>
                            </div>
                            <ModeTag mode={alt.dietMode} />
                          </div>
                          <p className="mt-3 text-[0.75rem] font-medium text-ink-soft">Why it works</p>
                          <ul className="mt-1 flex flex-col gap-1">
                            {alt.reasons.slice(0, 3).map((r) => (
                              <li key={r.code} className="flex gap-2 text-[0.8125rem]">
                                <span aria-hidden="true" className="text-ink-soft">
                                  –
                                </span>
                                {r.text}
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4 grid grid-cols-2 gap-2 md:mt-auto md:pt-4">
                            <Button href={cookHref(alt)} variant="secondary" className="px-3">
                              Cook
                            </Button>
                            <Button href="/app/discover" variant="secondary" className="px-3">
                              Find nearby
                            </Button>
                          </div>
                          <button
                            type="button"
                            aria-pressed={picked}
                            onClick={() => setPickedName(picked ? null : alt.name)}
                            className="mt-2 w-full py-1.5 text-[0.8125rem] text-ink underline underline-offset-2"
                          >
                            {picked ? "Picked ✓ — tap to undo" : "I'll have this"}
                          </button>
                        </Card>
                      </li>
                    );
                  })}
                </ol>

                <div aria-live="polite" className="mt-4 md:max-w-[560px]">
                  {pickedName ? (
                    <Card>
                      <p className="text-[0.875rem]">
                        Good pick. We&rsquo;ll ask how it went after you eat — whether it hit
                        the spot is what makes the next suggestion better.
                      </p>
                      <Button
                        href={`/app/log?dish=${encodeURIComponent(pickedName)}`}
                        className="mt-3 w-full"
                      >
                        Log it after the meal
                      </Button>
                    </Card>
                  ) : null}
                </div>

                <p className="mt-4">
                  <SourceLabel>Sample swaps · synthetic prototype data</SourceLabel>
                </p>
              </>
            )}
          </section>
        ) : null}
      </Shell>
    </main>
  );
}
