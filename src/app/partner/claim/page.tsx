"use client";

import { useMemo, useState } from "react";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ClaimStepper } from "../_components/ClaimStepper";
import { StatusTag, SyntheticNote } from "../_components/StatusTag";
import {
  demoPartnerId,
  opsListings,
  partnerClaims,
  type OpsListing,
} from "@/lib/fixtures/operations";

// Demo-only claim flow. Nothing is uploaded or persisted: the file input
// only reads the chosen file's name locally.
const existingClaim = partnerClaims.find((c) => c.claimantId === demoPartnerId)!;
const existingListing = opsListings.find((l) => l.id === existingClaim.listingId)!;

type Step = "select" | "proof" | "rights" | "submitted";
const stepNumber: Record<Exclude<Step, "submitted">, number> = { select: 1, proof: 2, rights: 3 };

const inputCls =
  "rounded-[6px] border border-hairline bg-surface px-3 py-2.5 text-[0.9375rem] outline-none focus:border-2 focus:border-turmeric";

export default function PartnerClaim() {
  const [step, setStep] = useState<Step>("select");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<OpsListing | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [affirmed, setAffirmed] = useState(false);

  const claimedIds = useMemo(() => new Set(partnerClaims.map((c) => c.listingId)), []);
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return opsListings
      .filter((l) => l.status !== "merged" && `${l.name} ${l.area}`.toLowerCase().includes(q))
      .slice(0, 5);
  }, [query]);

  function reset() {
    setStep("select");
    setQuery("");
    setSelected(null);
    setFileName(null);
    setAffirmed(false);
  }

  return (
    <main className="flex-1 pb-10">
      <Shell>
        <PageTitle eyebrow="Partner · Claim">Claim a listing</PageTitle>

        <div className="lg:grid lg:grid-cols-[360px_minmax(0,560px)] lg:items-start lg:gap-8">
          <section aria-labelledby="current-claim" className="mb-6">
            <Card>
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 id="current-claim" className="text-[1.125rem] font-semibold leading-tight">
                    {existingListing.name}
                  </h2>
                  <p className="mt-0.5 text-[0.8125rem] text-ink-soft">
                    {existingClaim.id} · {existingClaim.proof}
                  </p>
                </div>
                <StatusTag label="Verified" />
              </div>
              <ClaimStepper status={existingClaim.status} />
            </Card>
          </section>

          <section aria-labelledby="new-claim">
            <CardTitle>
              <span id="new-claim">Claim another listing</span>
            </CardTitle>
            {step !== "submitted" ? (
              <p className="mb-3 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
                Step {stepNumber[step]} of 3
              </p>
            ) : null}

            {step === "select" ? (
              <Card>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[0.8125rem] font-medium">Search listings by name or area</span>
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. Sample, Adyar"
                    className={inputCls}
                  />
                </label>
                {query.trim() && matches.length === 0 ? (
                  <p className="mt-3 text-[0.8125rem] text-ink-soft">
                    No listings match &ldquo;{query}&rdquo;. New listings are added by the Veggie team.
                  </p>
                ) : null}
                {matches.length > 0 ? (
                  <fieldset className="mt-3">
                    <legend className="sr-only">Choose a listing</legend>
                    <ul className="flex flex-col">
                      {matches.map((l) => {
                        const taken = claimedIds.has(l.id);
                        return (
                          <li key={l.id} className="border-t border-hairline py-2 first:border-t-0">
                            <label className={`flex items-center gap-3 ${taken ? "text-ink-soft" : ""}`}>
                              <input
                                type="radio"
                                name="listing"
                                disabled={taken}
                                checked={selected?.id === l.id}
                                onChange={() => setSelected(l)}
                                className="h-4 w-4 accent-turmeric"
                              />
                              <span className="min-w-0">
                                <span className="block text-[0.875rem] font-medium">{l.name}</span>
                                <span className="block text-[0.75rem] text-ink-soft">
                                  {l.area}
                                  {taken ? " · already has a claim in progress" : ""}
                                </span>
                              </span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </fieldset>
                ) : null}
                <Button type="button" className="mt-4 w-full" disabled={!selected} onClick={() => setStep("proof")}>
                  Continue
                </Button>
              </Card>
            ) : null}

            {step === "proof" && selected ? (
              <Card>
                <p className="text-[0.875rem]">
                  Claiming <span className="font-medium">{selected.name}</span>, {selected.area}
                </p>
                <label className="mt-3 flex flex-col gap-1.5">
                  <span className="text-[0.8125rem] font-medium">Proof of ownership</span>
                  <span id="proof-help" className="text-[0.75rem] text-ink-soft">
                    Trade licence, food safety registration or a utility bill in the business name. Prototype:
                    the file stays on your device and is not uploaded.
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    aria-describedby="proof-help"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                    className="w-full min-w-0 text-[0.8125rem] file:mr-3 file:rounded-[4px] file:border file:border-hairline file:bg-surface file:px-3 file:py-1.5 file:text-ink"
                  />
                </label>
                {fileName ? (
                  <p className="mt-2 break-all font-mono text-[0.75rem] text-ink-soft">Selected: {fileName}</p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button type="button" disabled={!fileName} onClick={() => setStep("rights")}>
                    Continue
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setStep("select")}>
                    Back
                  </Button>
                </div>
              </Card>
            ) : null}

            {step === "rights" && selected ? (
              <Card>
                <p className="text-[0.875rem]">
                  Before we review your claim for <span className="font-medium">{selected.name}</span>:
                </p>
                <label className="mt-3 flex items-start gap-2 text-[0.9375rem]">
                  <input
                    type="checkbox"
                    checked={affirmed}
                    onChange={(e) => setAffirmed(e.target.checked)}
                    className="mt-1 h-4 w-4 shrink-0 accent-turmeric"
                  />
                  I hold the rights to content I upload
                </label>
                <p className="mt-2 text-[0.75rem] text-ink-soft">
                  Covers menu text, dish photos and documents. Ratings and reviews from users remain theirs and
                  cannot be edited by owners.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button type="button" disabled={!affirmed} onClick={() => setStep("submitted")}>
                    Submit claim
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setStep("proof")}>
                    Back
                  </Button>
                </div>
              </Card>
            ) : null}

            {step === "submitted" && selected ? (
              <Card>
                <p role="status" className="text-[0.9375rem] font-medium">
                  Claim submitted for {selected.name}
                </p>
                <p className="mb-3 mt-1 text-[0.8125rem] text-ink-soft">
                  The Veggie team reviews ownership proof before any change goes live. Prototype — not persisted.
                </p>
                <ClaimStepper status="submitted" />
                <Button type="button" variant="secondary" className="mt-4" onClick={reset}>
                  Start another claim
                </Button>
              </Card>
            ) : null}
          </section>

        </div>

        <div className="mt-6">
          <SyntheticNote>Listings and claim ids are synthetic.</SyntheticNote>
        </div>
      </Shell>
    </main>
  );
}
