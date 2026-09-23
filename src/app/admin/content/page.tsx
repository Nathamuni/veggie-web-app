"use client";

import { useState, type FormEvent } from "react";
import { PageTitle } from "@/components/ui/Shell";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SourceLabel } from "@/components/ui/SourceLabel";
import { StatusTag } from "@/app/partner/_components/StatusTag";
import { AdminShell, CellActions, DataTable, Lede, RowAction, RowActions, Td, Tr } from "../_components/ui";
import { AuditStrip, useAudit } from "../_components/Audit";
import { lessons } from "@/lib/fixtures/learn";
import { barrierOptions } from "@/lib/fixtures/mealLogs";
import { cuisineTaxonomy, demoAdminId, type CuisineTaxon } from "@/lib/fixtures/operations";

const fieldCls =
  "min-w-0 rounded-[6px] border border-hairline bg-surface px-2.5 py-2 text-[0.875rem] outline-none focus:border-2 focus:border-turmeric";

const taxonLabels: Record<CuisineTaxon["status"], string> = {
  approved: "Approved",
  proposed: "Proposed",
  rejected: "Rejected",
};

export default function AdminContent() {
  const { record } = useAudit();
  const [triggers, setTriggers] = useState<Record<string, string>>(() =>
    Object.fromEntries(lessons.map((l) => [l.id, l.triggerBarrier ?? ""]))
  );
  const [taxa, setTaxa] = useState<CuisineTaxon[]>(cuisineTaxonomy);
  const [newName, setNewName] = useState("");
  const [newParent, setNewParent] = useState("");

  function setTrigger(lessonId: string, title: string, barrier: string) {
    setTriggers((prev) => ({ ...prev, [lessonId]: barrier }));
    record(barrier ? `mapped lesson to barrier "${barrier}"` : "removed lesson barrier mapping", title);
  }

  function setTaxonStatus(t: CuisineTaxon, status: CuisineTaxon["status"]) {
    setTaxa((prev) => prev.map((x) => (x.id === t.id ? { ...x, status } : x)));
    record(`${status} cuisine taxon`, `${t.name}${t.parent ? ` (under ${t.parent})` : ""}`);
  }

  function propose(e: FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    const parent = newParent || null;
    setTaxa((prev) => [
      ...prev,
      { id: `cx-local-${prev.length}`, name, parent, status: "proposed", proposedBy: demoAdminId },
    ]);
    record("proposed cuisine taxon", `${name}${parent ? ` (under ${parent})` : ""}`);
    setNewName("");
    setNewParent("");
  }

  const approvedNames = taxa.filter((t) => t.status === "approved").map((t) => t.name);

  function taxonActions(t: CuisineTaxon) {
    return (
      <>
        <RowAction
          disabled={t.proposedBy === demoAdminId}
          title={t.proposedBy === demoAdminId ? "A second admin must approve your own proposal" : undefined}
          onClick={() => setTaxonStatus(t, "approved")}
        >
          Approve<span className="sr-only"> {t.name}</span>
        </RowAction>
        <RowAction tone="destructive" onClick={() => setTaxonStatus(t, "rejected")}>
          Reject<span className="sr-only"> {t.name}</span>
        </RowAction>
      </>
    );
  }

  return (
    <main className="flex-1 pb-10">
      <AdminShell>
        <PageTitle eyebrow="Admin · Content">Content governance</PageTitle>
        <Lede>
          Lessons are surfaced when a user logs a matching barrier. Cuisine names shape recommendations, so every
          addition is proposed, then approved by a second admin.
        </Lede>

        <section aria-labelledby="lessons-heading" className="mb-8">
          <CardTitle>
            <span id="lessons-heading">Lesson mapping</span>
          </CardTitle>
          <p className="mb-3 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
            Lesson → barrier trigger → action
          </p>
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            {lessons.map((l) => {
              const selectId = `trigger-${l.id}`;
              return (
                <li key={l.id}>
                  <Card className="h-full">
                    <p className="text-[0.875rem] font-medium">{l.title}</p>
                    <SourceLabel>
                      {l.topic} · {l.dietModeRelevance === "both" ? "vegetarian + vegan" : `${l.dietModeRelevance} only`}
                    </SourceLabel>
                    <label htmlFor={selectId} className="mt-2 block text-[0.8125rem] font-medium">
                      Barrier trigger
                    </label>
                    <select
                      id={selectId}
                      value={triggers[l.id]}
                      onChange={(e) => setTrigger(l.id, l.title, e.target.value)}
                      className={`${fieldCls} mt-1 w-full`}
                    >
                      <option value="">None — lesson browsed only</option>
                      {barrierOptions.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-[0.8125rem]">
                      <span className="text-ink-soft">Action: </span>
                      {l.actionLabel} <span className="font-mono text-[0.75rem] text-ink-soft">{l.actionHref}</span>
                    </p>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="taxonomy-heading">
          <CardTitle>
            <span id="taxonomy-heading">Cuisine taxonomy</span>
          </CardTitle>
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-6">
            <div className="min-w-0">
              <ul className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-2 lg:hidden">
                {taxa.map((t) => (
                  <li key={t.id}>
                    <Card className="h-full">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[0.875rem] font-medium">{t.name}</p>
                          <p className="text-[0.75rem] text-ink-soft">
                            {t.parent ? `Under ${t.parent}` : "Top level"} · proposed by{" "}
                            <span className="font-mono">{t.proposedBy}</span>
                          </p>
                        </div>
                        <StatusTag label={taxonLabels[t.status]} tone={t.status === "rejected" ? "negative" : "neutral"} />
                      </div>
                      {t.status === "proposed" ? <RowActions>{taxonActions(t)}</RowActions> : null}
                      {t.status === "proposed" && t.proposedBy === demoAdminId ? (
                        <p className="mt-2 text-[0.75rem] text-ink-soft">
                          Your own proposal — another admin must approve it.
                        </p>
                      ) : null}
                    </Card>
                  </li>
                ))}
              </ul>
              <DataTable from="lg" caption="Cuisine taxonomy" head={["Cuisine", "Parent", "Proposed by", "Status", "Actions"]}>
                {taxa.map((t) => (
                  <Tr key={t.id}>
                    <Td className="font-medium">{t.name}</Td>
                    <Td className="text-ink-soft">{t.parent ?? "Top level"}</Td>
                    <Td className="font-mono text-[0.75rem] text-ink-soft">{t.proposedBy}</Td>
                    <Td>
                      <StatusTag label={taxonLabels[t.status]} tone={t.status === "rejected" ? "negative" : "neutral"} />
                    </Td>
                    <Td>
                      {t.status === "proposed" ? <CellActions>{taxonActions(t)}</CellActions> : <span className="text-ink-soft">—</span>}
                      {t.status === "proposed" && t.proposedBy === demoAdminId ? (
                        <p className="mt-1 text-[0.75rem] text-ink-soft">Your own proposal — another admin must approve it.</p>
                      ) : null}
                    </Td>
                  </Tr>
                ))}
              </DataTable>
            </div>
  
            <Card>
              <form onSubmit={propose} className="flex flex-col gap-3" aria-labelledby="propose-heading">
                <h3 id="propose-heading" className="text-[0.9375rem] font-semibold">
                  Propose an addition
                </h3>
                <label className="flex flex-col gap-1">
                  <span className="text-[0.8125rem] font-medium">Cuisine name</span>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className={fieldCls}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[0.8125rem] font-medium">Parent</span>
                  <select value={newParent} onChange={(e) => setNewParent(e.target.value)} className={fieldCls}>
                    <option value="">Top level</option>
                    {approvedNames.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
                <Button type="submit" variant="secondary" disabled={!newName.trim()} className="self-start">
                  Propose
                </Button>
              </form>
            </Card>
          </div>
        </section>

        <AuditStrip />
      </AdminShell>
    </main>
  );
}
