"use client";

import { useState } from "react";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ModeTag } from "@/components/ui/ModeTag";
import { DataUnavailable, Figure } from "@/components/ui/SourceLabel";
import { StatusTag, SyntheticNote } from "../_components/StatusTag";
import {
  demoPartnerId,
  partnerClaims,
  partnerKitchen,
  partnerMenu,
  type DishDietBase,
  type KitchenDeclarations,
  type PartnerMenuItem,
} from "@/lib/fixtures/operations";

// Edits are local component state. A saved edit never replaces the live
// values — it sits beside them as "pending admin review" (PRD S28).
const listingId = partnerClaims.find((c) => c.claimantId === demoPartnerId)!.listingId;

type Draft = Pick<PartnerMenuItem, "name" | "priceRupees" | "dietBase" | "containsDairy" | "jainAvailable">;

const dietOptions: { value: DishDietBase; label: string; help: string }[] = [
  { value: "vegan", label: "Vegan", help: "No meat, fish, egg, dairy, ghee or honey" },
  { value: "vegetarian", label: "Vegetarian", help: "No meat, fish or egg; may contain dairy" },
  { value: "egg", label: "Contains egg", help: "Not vegetarian or vegan for most users" },
];

const inputCls =
  "w-full rounded-[6px] border border-hairline bg-surface px-2.5 py-2 text-[0.875rem] outline-none focus:border-2 focus:border-turmeric";

function DietTags({ d }: { d: Draft }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      {d.dietBase === "vegan" ? <ModeTag mode="vegan" /> : null}
      {d.dietBase === "vegetarian" ? <ModeTag mode="vegetarian" /> : null}
      {d.dietBase === "egg" ? <ModeTag mode="neutral" label="Contains egg" /> : null}
      {d.containsDairy ? <ModeTag mode="neutral" label="Contains dairy" /> : null}
      {d.jainAvailable ? <ModeTag mode="neutral" label="Jain option" /> : null}
    </span>
  );
}

function toDraft(d: PartnerMenuItem): Draft {
  return {
    name: d.name,
    priceRupees: d.priceRupees,
    dietBase: d.dietBase,
    containsDairy: d.containsDairy,
    jainAvailable: d.jainAvailable,
  };
}

function DishEditor({
  dishId: id,
  initial,
  onSave,
  onCancel,
}: {
  dishId: string;
  initial: Draft;
  onSave: (d: Draft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<Draft>(initial);

  function setDiet(value: DishDietBase) {
    // A vegan dish cannot contain dairy — clear it rather than let the two
    // declarations contradict each other.
    setDraft((prev) => ({ ...prev, dietBase: value, containsDairy: value === "vegan" ? false : prev.containsDairy }));
  }

  return (
    <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-x-6">
      <label className="flex flex-col gap-1">
        <span className="text-[0.8125rem] font-medium">Dish name</span>
        <input
          type="text"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          className={inputCls}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-[0.8125rem] font-medium">Price (₹, leave blank if not declared)</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={draft.priceRupees ?? ""}
          onChange={(e) =>
            setDraft({ ...draft, priceRupees: e.target.value === "" ? null : Math.max(0, Number(e.target.value)) })
          }
          className={`${inputCls} max-w-[10rem] font-mono`}
        />
      </label>
      <fieldset className="md:col-start-2 md:row-span-3 md:row-start-1">
        <legend className="mb-1 text-[0.8125rem] font-medium">Diet declaration</legend>
        <div className="flex flex-col gap-1.5">
          {dietOptions.map((o) => (
            <label key={o.value} className="flex items-start gap-2 text-[0.875rem]">
              <input
                type="radio"
                name={`diet-${id}`}
                checked={draft.dietBase === o.value}
                onChange={() => setDiet(o.value)}
                className="mt-1 h-4 w-4 shrink-0 accent-turmeric"
              />
              <span>
                {o.label}
                <span className="block text-[0.75rem] text-ink-soft">{o.help}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="flex items-start gap-2 text-[0.875rem]">
        <input
          type="checkbox"
          checked={draft.containsDairy}
          disabled={draft.dietBase === "vegan"}
          aria-describedby={`dairy-help-${id}`}
          onChange={(e) => setDraft({ ...draft, containsDairy: e.target.checked })}
          className="mt-1 h-4 w-4 shrink-0 accent-turmeric"
        />
        <span>
          Contains dairy (milk, curd, paneer, ghee, butter)
          <span id={`dairy-help-${id}`} className="block text-[0.75rem] text-ink-soft">
            {draft.dietBase === "vegan" ? "Not available: a vegan dish cannot contain dairy." : "Declare even small amounts, e.g. ghee tempering."}
          </span>
        </span>
      </label>
      <label className="flex items-start gap-2 text-[0.875rem]">
        <input
          type="checkbox"
          checked={draft.jainAvailable}
          onChange={(e) => setDraft({ ...draft, jainAvailable: e.target.checked })}
          className="mt-1 h-4 w-4 shrink-0 accent-turmeric"
        />
        Jain / no onion-garlic version available
      </label>
      <div className="flex flex-wrap gap-2 md:col-span-2">
        <Button type="button" disabled={!draft.name.trim()} onClick={() => onSave(draft)}>
          Submit for review
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default function PartnerMenu() {
  const live = partnerMenu.filter((d) => d.listingId === listingId);
  const [editing, setEditing] = useState<string | null>(null);
  const [pending, setPending] = useState<Record<string, Draft>>({});
  const [kitchen, setKitchen] = useState<KitchenDeclarations>(partnerKitchen);
  const [kitchenPending, setKitchenPending] = useState(false);

  const kitchenChanged =
    kitchen.separateUtensils !== partnerKitchen.separateUtensils ||
    kitchen.sharedFryer !== partnerKitchen.sharedFryer ||
    kitchen.jainKitchenAvailable !== partnerKitchen.jainKitchenAvailable;

  function toggleKitchen(key: keyof KitchenDeclarations) {
    setKitchen((prev) => ({ ...prev, [key]: !prev[key] }));
    setKitchenPending(false);
  }

  return (
    <main className="flex-1 pb-10">
      <Shell>
        <PageTitle eyebrow="Partner · Menu">Menu & declarations</PageTitle>
        <p className="-mt-3 mb-5 text-[0.8125rem] text-ink-soft">
          Edits go to the Veggie team as <span className="font-medium text-ink">pending admin review</span>. The
          live listing keeps its current values until an admin approves the change.
        </p>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-8">
          <section aria-labelledby="dishes-heading" className="mb-6">
            <CardTitle>
              <span id="dishes-heading">Dishes</span>
            </CardTitle>
            <ul className="flex flex-col gap-3">
              {live.map((d) => {
                const current = toDraft(d);
                const proposed = pending[d.id];
                return (
                  <li key={d.id}>
                    <Card>
                      {editing === d.id ? (
                        <DishEditor
                          dishId={d.id}
                          initial={proposed ?? current}
                          onCancel={() => setEditing(null)}
                          onSave={(draft) => {
                            setPending((prev) => ({ ...prev, [d.id]: draft }));
                            setEditing(null);
                          }}
                        />
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-[0.9375rem] font-medium">{d.name}</p>
                              <p className="mt-0.5">
                                {d.priceRupees === null ? (
                                  <DataUnavailable />
                                ) : (
                                  <Figure value={`₹${d.priceRupees}`} source="synthetic" />
                                )}
                              </p>
                            </div>
                            <StatusTag label="Live" />
                          </div>
                          <div className="mt-2">
                            <DietTags d={current} />
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <div
                              aria-hidden="true"
                              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px] border border-dashed border-hairline bg-paper text-[0.625rem] text-ink-soft"
                            >
                              photo
                            </div>
                            <p className="text-[0.75rem] text-ink-soft">
                              {d.photoCount === 0 ? "No photo yet" : `${d.photoCount} photo on file`} · upload is a
                              placeholder in this prototype
                            </p>
                          </div>

                          {proposed ? (
                            <div className="mt-3 rounded-[6px] border border-dashed border-hairline bg-paper p-3">
                              <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                                <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
                                  Proposed change
                                </p>
                                <StatusTag label="Pending admin review" />
                              </div>
                              <p className="text-[0.875rem]">
                                {proposed.name} ·{" "}
                                {proposed.priceRupees === null ? (
                                  <DataUnavailable />
                                ) : (
                                  <span className="font-mono text-[0.8125rem]">₹{proposed.priceRupees}</span>
                                )}
                              </p>
                              <div className="mt-1.5">
                                <DietTags d={proposed} />
                              </div>
                            </div>
                          ) : null}

                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button type="button" variant="secondary" onClick={() => setEditing(d.id)}>
                              {proposed ? "Edit proposed change" : "Edit"}
                              <span className="sr-only"> {d.name}</span>
                            </Button>
                            {proposed ? (
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() =>
                                  setPending((prev) => {
                                    const next = { ...prev };
                                    delete next[d.id];
                                    return next;
                                  })
                                }
                              >
                                Withdraw
                                <span className="sr-only"> change to {d.name}</span>
                              </Button>
                            ) : null}
                          </div>
                        </>
                      )}
                    </Card>
                  </li>
                );
              })}
            </ul>
          </section>

          <section aria-labelledby="kitchen-heading" className="mb-6">
            <CardTitle>
              <span id="kitchen-heading">Kitchen & preparation</span>
            </CardTitle>
            <Card>
              <fieldset>
                <legend className="mb-2 text-[0.8125rem] text-ink-soft">
                  Shown to users beside your listing, marked &ldquo;owner declared&rdquo;.
                </legend>
                <div className="flex flex-col gap-2 text-[0.875rem]">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={kitchen.separateUtensils}
                      onChange={() => toggleKitchen("separateUtensils")}
                      className="h-4 w-4 accent-turmeric"
                    />
                    Separate utensils for vegetarian food
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={kitchen.sharedFryer}
                      onChange={() => toggleKitchen("sharedFryer")}
                      className="h-4 w-4 accent-turmeric"
                    />
                    Fryer shared with non-vegetarian items
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={kitchen.jainKitchenAvailable}
                      onChange={() => toggleKitchen("jainKitchenAvailable")}
                      className="h-4 w-4 accent-turmeric"
                    />
                    Jain / no onion-garlic preparation available
                  </label>
                </div>
              </fieldset>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={!kitchenChanged || kitchenPending}
                  onClick={() => setKitchenPending(true)}
                >
                  Submit for review
                </Button>
                {kitchenPending ? (
                  <p role="status" className="text-[0.8125rem] text-ink-soft">
                    Pending admin review (prototype)
                  </p>
                ) : null}
              </div>
            </Card>
          </section>

        </div>

        <SyntheticNote>Dishes and prices are synthetic placeholders.</SyntheticNote>
      </Shell>
    </main>
  );
}
