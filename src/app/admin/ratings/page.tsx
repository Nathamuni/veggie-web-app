"use client";

import { useState } from "react";
import { PageTitle } from "@/components/ui/Shell";
import { Card, CardTitle } from "@/components/ui/Card";
import { SourceLabel } from "@/components/ui/SourceLabel";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusTag } from "@/app/partner/_components/StatusTag";
import { AdminShell, CellActions, DataTable, Lede, RowAction, RowActions, Td, Tr } from "../_components/ui";
import { AuditStrip, useAudit } from "../_components/Audit";
import { moderationCases, type ModerationCase, type ModerationStatus } from "@/lib/fixtures/operations";

const statusLabels: Record<ModerationStatus, string> = {
  open: "Open",
  approved: "Approved — kept",
  removed: "Removed",
  escalated: "Escalated",
};

const kindLabels: Record<ModerationCase["kind"], string> = {
  flagged_review: "Flagged review",
  correction_report: "Correction report",
};

function Row({
  c,
  setStatus,
}: {
  c: ModerationCase;
  setStatus: (c: ModerationCase, status: ModerationStatus, action: string) => void;
}) {
  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <SourceLabel>
            {kindLabels[c.kind]} · {c.id}
          </SourceLabel>
          <p className="text-[0.875rem] font-medium">{c.target}</p>
        </div>
        <StatusTag label={statusLabels[c.status]} tone={c.status === "removed" ? "negative" : "neutral"} />
      </div>
      <p className="mt-1.5 text-[0.8125rem]">{c.reason}</p>
      <p className="mt-0.5 text-[0.75rem] text-ink-soft">Reported by {c.reporterId}</p>
      {c.status === "open" || c.status === "escalated" ? (
        <RowActions>
          <CaseActions c={c} setStatus={setStatus} />
        </RowActions>
      ) : null}
    </Card>
  );
}

type SetStatus = (c: ModerationCase, status: ModerationStatus, action: string) => void;

function CaseActions({ c, setStatus }: { c: ModerationCase; setStatus: SetStatus }) {
  return (
    <>
      <RowAction onClick={() => setStatus(c, "approved", "approved (kept) content")}>
        Approve<span className="sr-only"> {c.id}</span>
      </RowAction>
      <RowAction tone="destructive" onClick={() => setStatus(c, "removed", "removed content")}>
        Remove<span className="sr-only"> {c.id}</span>
      </RowAction>
      {c.status === "open" ? (
        <RowAction onClick={() => setStatus(c, "escalated", "escalated case")}>
          Escalate<span className="sr-only"> {c.id}</span>
        </RowAction>
      ) : null}
    </>
  );
}

/** md+ ruled table of the same cases and actions the phone card list shows. */
function CaseTable({ caption, cases, setStatus }: { caption: string; cases: ModerationCase[]; setStatus: SetStatus }) {
  return (
    <DataTable from="lg" caption={caption} head={["Case", "Target", "Reason", "Status", "Actions"]}>
      {cases.map((c) => (
        <Tr key={c.id}>
          <Td>
            <SourceLabel>{kindLabels[c.kind]}</SourceLabel>
            <span className="block font-mono text-[0.75rem] text-ink-soft">{c.id}</span>
          </Td>
          <Td className="font-medium">{c.target}</Td>
          <Td className="max-w-[40ch]">
            {c.reason}
            <span className="mt-0.5 block text-[0.75rem] text-ink-soft">Reported by {c.reporterId}</span>
          </Td>
          <Td>
            <StatusTag label={statusLabels[c.status]} tone={c.status === "removed" ? "negative" : "neutral"} />
          </Td>
          <Td>
            {c.status === "open" || c.status === "escalated" ? (
              <CellActions>
                <CaseActions c={c} setStatus={setStatus} />
              </CellActions>
            ) : (
              <span className="text-ink-soft">—</span>
            )}
          </Td>
        </Tr>
      ))}
    </DataTable>
  );
}

export default function AdminRatings() {
  const { record } = useAudit();
  const [cases, setCases] = useState<ModerationCase[]>(moderationCases);

  function setStatus(c: ModerationCase, status: ModerationStatus, action: string) {
    setCases((prev) => prev.map((x) => (x.id === c.id ? { ...x, status } : x)));
    record(action, `${c.id} — ${c.target}`);
  }

  const active = cases.filter((c) => c.status === "open" || c.status === "escalated");
  const closed = cases.filter((c) => c.status === "approved" || c.status === "removed");

  return (
    <main className="flex-1 pb-10">
      <AdminShell>
        <PageTitle eyebrow="Admin · Ratings">Moderation queue</PageTitle>
        <Lede>
          Flagged reviews and user correction reports. Approve keeps the content as is; Remove takes it down;
          Escalate sends it to a senior reviewer. Owners cannot remove ratings — only this queue can.
        </Lede>

        <section aria-labelledby="open-heading" className="mb-8">
          <CardTitle>
            <span id="open-heading">Needs a decision ({active.length})</span>
          </CardTitle>
          {active.length === 0 ? (
            <EmptyState title="Queue clear" reason="No open or escalated cases in the synthetic queue." />
          ) : (
            <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:hidden">
              {active.map((c) => (
                <li key={c.id}>
                  <Row c={c} setStatus={setStatus} />
                </li>
              ))}
            </ul>
          )}
          {active.length > 0 ? <CaseTable caption="Needs a decision" cases={active} setStatus={setStatus} /> : null}
        </section>

        <section aria-labelledby="closed-heading">
          <CardTitle>
            <span id="closed-heading">Resolved ({closed.length})</span>
          </CardTitle>
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:hidden">
            {closed.map((c) => (
              <li key={c.id}>
                <Row c={c} setStatus={setStatus} />
              </li>
            ))}
          </ul>
          <CaseTable caption="Resolved" cases={closed} setStatus={setStatus} />
        </section>

        <AuditStrip />
      </AdminShell>
    </main>
  );
}
