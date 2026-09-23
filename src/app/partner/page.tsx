"use client";

import { useState } from "react";
import Link from "next/link";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusTag, SyntheticNote } from "./_components/StatusTag";
import {
  classificationLabels,
  correctionRequests,
  demoPartnerId,
  opsListings,
  partnerClaims,
  partnerKitchen,
  partnerMenu,
} from "@/lib/fixtures/operations";

// Demo-only: the signed-in partner owns the one verified claim in the
// fixtures. Responses below are local component state — nothing persists.
const activeClaim = partnerClaims.find((c) => c.claimantId === demoPartnerId)!;
const listing = opsListings.find((l) => l.id === activeClaim.listingId)!;
const menu = partnerMenu.filter((d) => d.listingId === listing.id);

type HealthCheck = { label: string; ok: boolean; detail: string };

const missingPrices = menu.filter((d) => d.priceRupees === null).length;
const withPhotos = menu.filter((d) => d.photoCount > 0).length;

const health: HealthCheck[] = [
  {
    label: "Ownership",
    ok: activeClaim.status === "verified",
    detail: activeClaim.status === "verified" ? "Claim verified" : "Claim not yet verified",
  },
  {
    label: "Diet declarations",
    ok: true,
    detail: `All ${menu.length} dishes declare vegan, vegetarian or egg`,
  },
  {
    label: "Prices",
    ok: missingPrices === 0,
    detail: missingPrices === 0 ? "Every dish has a price" : `${missingPrices} dish without a declared price`,
  },
  {
    label: "Kitchen declarations",
    ok: true,
    detail: `Separate utensils: ${partnerKitchen.separateUtensils ? "yes" : "no"} · Shared fryer: ${
      partnerKitchen.sharedFryer ? "yes" : "no"
    }`,
  },
  {
    label: "Photos",
    ok: withPhotos === menu.length,
    detail: `${withPhotos} of ${menu.length} dishes have a photo`,
  },
  { label: "Opening hours", ok: false, detail: "data unavailable — not yet declared" },
];

const sections = [
  { href: "/partner/claim", label: "Claim", desc: "Verification status, or claim another listing" },
  { href: "/partner/menu", label: "Menu", desc: "Dishes, diet and kitchen declarations" },
  { href: "/partner/analytics", label: "Analytics", desc: "Views, saves, direction taps, ratings (read-only)" },
];

export default function PartnerOverview() {
  const [responding, setResponding] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<Record<string, boolean>>({});

  const open = correctionRequests.filter((c) => c.listingId === listing.id && !sent[c.id]);

  function send(id: string) {
    if (!drafts[id]?.trim()) return;
    setSent((prev) => ({ ...prev, [id]: true }));
    setResponding(null);
  }

  return (
    <main className="flex-1 pb-10">
      <Shell>
        <PageTitle eyebrow="Partner overview">{listing.name}</PageTitle>
        <p className="-mt-3 mb-5 text-[0.8125rem] text-ink-soft">
          {listing.area} · {classificationLabels[listing.classification]} · synthetic listing
        </p>

        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-8">
          <div className="min-w-0">
            <section aria-labelledby="claim-heading" className="mb-6">
              <Card>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 id="claim-heading" className="text-[1.125rem] font-semibold leading-tight">
                      Claim status
                    </h2>
                    <p className="mt-1 text-[0.8125rem] text-ink-soft">
                      {activeClaim.id} · submitted {activeClaim.submittedAt}
                    </p>
                  </div>
                  <StatusTag
                    label={activeClaim.status === "verified" ? "Verified" : activeClaim.status.replace("_", " ")}
                    tone={activeClaim.status === "rejected" ? "negative" : "neutral"}
                  />
                </div>
                <Link
                  href="/partner/claim"
                  className="mt-3 inline-block text-[0.8125rem] text-ink underline underline-offset-4"
                >
                  View verification steps
                </Link>
              </Card>
            </section>

            <section aria-labelledby="health-heading" className="mb-6">
              <CardTitle>
                <span id="health-heading">Listing health</span>
              </CardTitle>
              <Card>
                <ul className="flex flex-col">
                  {health.map((h) => (
                    <li
                      key={h.label}
                      className="flex items-start justify-between gap-3 border-t border-hairline py-2.5 first:border-t-0 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="text-[0.875rem] font-medium">{h.label}</p>
                        <p className="text-[0.8125rem] text-ink-soft">{h.detail}</p>
                      </div>
                      <StatusTag label={h.ok ? "OK" : "Needs attention"} tone={h.ok ? "neutral" : "negative"} />
                    </li>
                  ))}
                </ul>
              </Card>
            </section>

          </div>
          <div className="min-w-0">
            <section aria-labelledby="corrections-heading" className="mb-6">
              <CardTitle>
                <span id="corrections-heading">Pending correction requests</span>
              </CardTitle>
              <p className="mb-3 text-[0.8125rem] text-ink-soft">
                Users report possible errors. Your response goes to the Veggie team for review before the listing
                changes.
              </p>
              {open.length === 0 ? (
                <EmptyState
                  title="No open correction requests"
                  reason="Responses you sent are with the Veggie team for review."
                />
              ) : (
                <ul className="flex flex-col gap-3">
                  {open.map((c) => (
                    <li key={c.id}>
                      <Card>
                        <p className="text-[0.875rem] font-medium">{c.subject}</p>
                        <p className="mt-0.5 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
                          {c.id} · from {c.reporterId} · {c.receivedAt}
                        </p>
                        <p className="mt-2 text-[0.9375rem]">&ldquo;{c.message}&rdquo;</p>
                        {responding === c.id ? (
                          <div className="mt-3 flex flex-col gap-2">
                            <label className="flex flex-col gap-1.5">
                              <span className="text-[0.8125rem] font-medium">Your response</span>
                              <textarea
                                rows={3}
                                value={drafts[c.id] ?? ""}
                                onChange={(e) => setDrafts((prev) => ({ ...prev, [c.id]: e.target.value }))}
                                className="rounded-[6px] border border-hairline bg-surface px-3 py-2.5 text-[0.9375rem] outline-none focus:border-2 focus:border-turmeric"
                              />
                            </label>
                            <div className="flex flex-wrap gap-2">
                              <Button type="button" onClick={() => send(c.id)} disabled={!drafts[c.id]?.trim()}>
                                Send response
                              </Button>
                              <Button type="button" variant="ghost" onClick={() => setResponding(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="secondary"
                            className="mt-3"
                            onClick={() => setResponding(c.id)}
                          >
                            Respond
                          </Button>
                        )}
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
              {Object.keys(sent).length > 0 ? (
                <p role="status" className="mt-3 text-[0.8125rem] text-ink-soft">
                  {Object.keys(sent).length} response(s) sent — pending admin review (prototype, not persisted).
                </p>
              ) : null}
            </section>

          </div>
        </div>

        <nav aria-label="Partner shortcuts" className="mb-4">
          <CardTitle>Manage</CardTitle>
          <ul className="flex flex-col gap-2 md:grid md:grid-cols-3">
            {sections.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="block h-full rounded-[6px] border border-hairline bg-surface p-4 transition-colors hover:border-ink-soft"
                >
                  <span className="text-[0.9375rem] font-semibold">{s.label} →</span>
                  <span className="mt-0.5 block text-[0.8125rem] text-ink-soft">{s.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <SyntheticNote>All listing, request and account data on this page is synthetic.</SyntheticNote>
      </Shell>
    </main>
  );
}
