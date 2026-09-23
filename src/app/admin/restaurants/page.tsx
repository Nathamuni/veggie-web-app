"use client";

import { useState } from "react";
import { PageTitle } from "@/components/ui/Shell";
import { Card, CardTitle } from "@/components/ui/Card";
import { SourceLabel } from "@/components/ui/SourceLabel";
import { StatusTag } from "@/app/partner/_components/StatusTag";
import { AdminShell, CellActions, DataTable, Lede, RowAction, RowActions, Td, Tr } from "../_components/ui";
import { AuditStrip, useAudit } from "../_components/Audit";
import {
  classificationLabels,
  opsListings,
  partnerClaims,
  type ClaimStatus,
  type ListingClassification,
  type OpsListing,
  type PartnerClaim,
} from "@/lib/fixtures/operations";

const claimLabels: Record<ClaimStatus, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  verified: "Verified",
  rejected: "Rejected",
};

const listingStatusLabels: Record<OpsListing["status"], string> = {
  live: "Live",
  pending_review: "Pending review",
  suspended: "Suspended",
  merged: "Merged",
};

const classifications = Object.keys(classificationLabels) as ListingClassification[];

export default function AdminRestaurants() {
  const { record } = useAudit();
  const [listings, setListings] = useState<OpsListing[]>(opsListings);
  const [claims, setClaims] = useState<PartnerClaim[]>(partnerClaims);

  const nameOf = (id: string) => listings.find((l) => l.id === id)?.name ?? id;

  function updateListing(id: string, patch: Partial<OpsListing>, action: string) {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    record(action, `${nameOf(id)} (${id})`);
  }

  function setClaim(c: PartnerClaim, status: ClaimStatus, action: string) {
    setClaims((prev) => prev.map((x) => (x.id === c.id ? { ...x, status } : x)));
    record(action, `${nameOf(c.listingId)} — ${c.id} by ${c.claimantId}`);
  }

  function claimActions(c: PartnerClaim) {
    return (
      <>
        {c.status === "submitted" ? (
          <RowAction onClick={() => setClaim(c, "under_review", "started claim review")}>
            Start review<span className="sr-only"> of {c.id}</span>
          </RowAction>
        ) : null}
        <RowAction onClick={() => setClaim(c, "verified", "approved claim")}>
          Approve<span className="sr-only"> claim {c.id}</span>
        </RowAction>
        <RowAction tone="destructive" onClick={() => setClaim(c, "rejected", "rejected claim")}>
          Reject<span className="sr-only"> claim {c.id}</span>
        </RowAction>
      </>
    );
  }

  function listingActions(l: OpsListing) {
    return (
      <>
        {l.status === "pending_review" ? (
          <RowAction onClick={() => updateListing(l.id, { status: "live" }, "approved listing")}>
            Approve<span className="sr-only"> {l.name}</span>
          </RowAction>
        ) : null}
        {l.duplicateOfId ? (
          <RowAction
            onClick={() => updateListing(l.id, { status: "merged" }, `merged duplicate into ${l.duplicateOfId}`)}
          >
            Merge into {l.duplicateOfId}
          </RowAction>
        ) : null}
        {l.status === "suspended" ? (
          <RowAction onClick={() => updateListing(l.id, { status: "live" }, "reinstated listing")}>
            Reinstate<span className="sr-only"> {l.name}</span>
          </RowAction>
        ) : (
          <RowAction
            tone="destructive"
            onClick={() => updateListing(l.id, { status: "suspended" }, "suspended listing")}
          >
            Suspend<span className="sr-only"> {l.name}</span>
          </RowAction>
        )}
      </>
    );
  }

  function classificationSelect(l: OpsListing, selectId: string) {
    return (
      <select
        id={selectId}
        value={l.classification}
        disabled={l.status === "merged"}
        onChange={(e) => {
          const next = e.target.value as ListingClassification;
          updateListing(l.id, { classification: next }, `set classification to ${next}`);
        }}
        className="min-w-0 rounded-[6px] border border-hairline bg-surface px-2.5 py-1.5 text-[0.8125rem] outline-none focus:border-2 focus:border-turmeric disabled:opacity-40"
      >
        {classifications.map((c) => (
          <option key={c} value={c}>
            {classificationLabels[c]} ({c})
          </option>
        ))}
      </select>
    );
  }

  return (
    <main className="flex-1 pb-10">
      <AdminShell>
        <PageTitle eyebrow="Admin · Restaurants">Restaurants & claims</PageTitle>
        <Lede>
          Claims are approved only against ownership proof. Classification is an admin decision, recorded in the
          audit log; partners can declare, not classify.
        </Lede>

        <section aria-labelledby="claims-heading" className="mb-8">
          <CardTitle>
            <span id="claims-heading">Partner claims queue</span>
          </CardTitle>
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:hidden">
            {claims.map((c) => {
              const open = c.status === "submitted" || c.status === "under_review";
              const listingName = nameOf(c.listingId);
              return (
                <li key={c.id}>
                  <Card className="h-full">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[0.875rem] font-medium">{listingName}</p>
                        <p className="text-[0.75rem] text-ink-soft">
                          {c.id} · {c.claimantId} · {c.submittedAt}
                        </p>
                      </div>
                      <StatusTag label={claimLabels[c.status]} tone={c.status === "rejected" ? "negative" : "neutral"} />
                    </div>
                    <p className="mt-1.5 text-[0.8125rem] text-ink-soft">Proof: {c.proof}</p>
                    {open ? <RowActions>{claimActions(c)}</RowActions> : null}
                  </Card>
                </li>
              );
            })}
          </ul>
          <DataTable from="lg" caption="Partner claims queue" head={["Listing", "Claim", "Proof", "Status", "Actions"]}>
            {claims.map((c) => {
              const open = c.status === "submitted" || c.status === "under_review";
              return (
                <Tr key={c.id}>
                  <Td className="font-medium">{nameOf(c.listingId)}</Td>
                  <Td className="text-ink-soft">
                    <span className="block font-mono text-[0.75rem]">{c.id}</span>
                    {c.claimantId} · {c.submittedAt}
                  </Td>
                  <Td className="text-ink-soft">{c.proof}</Td>
                  <Td>
                    <StatusTag label={claimLabels[c.status]} tone={c.status === "rejected" ? "negative" : "neutral"} />
                  </Td>
                  <Td>{open ? <CellActions>{claimActions(c)}</CellActions> : <span className="text-ink-soft">—</span>}</Td>
                </Tr>
              );
            })}
          </DataTable>
        </section>

        <section aria-labelledby="places-heading">
          <CardTitle>
            <span id="places-heading">Places</span>
          </CardTitle>
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:hidden">
            {listings.map((l) => {
              const selectId = `class-${l.id}`;
              const inactive = l.status === "merged";
              return (
                <li key={l.id}>
                  <Card className="h-full">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[0.875rem] font-medium">{l.name}</p>
                        <p className="text-[0.75rem] text-ink-soft">
                          {l.area} · <SourceLabel>{l.source}</SourceLabel>
                        </p>
                      </div>
                      <StatusTag
                        label={listingStatusLabels[l.status]}
                        tone={l.status === "suspended" ? "negative" : "neutral"}
                      />
                    </div>
                    {l.duplicateOfId && !inactive ? (
                      <p className="mt-1.5 text-[0.8125rem] text-rust">
                        Possible duplicate of {nameOf(l.duplicateOfId)} ({l.duplicateOfId})
                      </p>
                    ) : null}
                    {l.status === "merged" && l.duplicateOfId ? (
                      <p className="mt-1.5 text-[0.8125rem] text-ink-soft">
                        Merged into {nameOf(l.duplicateOfId)}; ratings and history carried over.
                      </p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <label htmlFor={selectId} className="text-[0.8125rem] font-medium">
                        Classification
                      </label>
                      {classificationSelect(l, selectId)}
                    </div>
                    {!inactive ? <RowActions>{listingActions(l)}</RowActions> : null}
                  </Card>
                </li>
              );
            })}
          </ul>
          <DataTable from="lg" caption="Places" head={["Place", "Status", "Classification", "Actions"]}>
            {listings.map((l) => {
              const inactive = l.status === "merged";
              return (
                <Tr key={l.id}>
                  <Td>
                    <p className="font-medium">{l.name}</p>
                    <p className="text-[0.75rem] text-ink-soft">
                      {l.area} · <SourceLabel>{l.source}</SourceLabel>
                    </p>
                    {l.duplicateOfId && !inactive ? (
                      <p className="mt-1 text-rust">
                        Possible duplicate of {nameOf(l.duplicateOfId)} ({l.duplicateOfId})
                      </p>
                    ) : null}
                    {l.status === "merged" && l.duplicateOfId ? (
                      <p className="mt-1 text-ink-soft">
                        Merged into {nameOf(l.duplicateOfId)}; ratings and history carried over.
                      </p>
                    ) : null}
                  </Td>
                  <Td>
                    <StatusTag
                      label={listingStatusLabels[l.status]}
                      tone={l.status === "suspended" ? "negative" : "neutral"}
                    />
                  </Td>
                  <Td>
                    <label htmlFor={`class-t-${l.id}`} className="sr-only">
                      Classification for {l.name}
                    </label>
                    {classificationSelect(l, `class-t-${l.id}`)}
                  </Td>
                  <Td>{!inactive ? <CellActions>{listingActions(l)}</CellActions> : <span className="text-ink-soft">—</span>}</Td>
                </Tr>
              );
            })}
          </DataTable>
        </section>

        <AuditStrip />
      </AdminShell>
    </main>
  );
}
