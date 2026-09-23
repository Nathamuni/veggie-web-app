"use client";

import { useState } from "react";
import { PageTitle } from "@/components/ui/Shell";
import { Card, CardTitle } from "@/components/ui/Card";
import { ModeTag } from "@/components/ui/ModeTag";
import { DataUnavailable, Figure, SourceLabel } from "@/components/ui/SourceLabel";
import { StatusTag } from "@/app/partner/_components/StatusTag";
import { AdminShell, CellActions, DataTable, Lede, RowAction, RowActions, Td, Tr } from "../_components/ui";
import { AuditStrip, useAudit } from "../_components/Audit";
import { nutritionSources, opsFoods, type FoodProvenance } from "@/lib/fixtures/operations";

const nutrientRows: { key: keyof FoodProvenance["nutrients"]; label: string; unit: string }[] = [
  { key: "proteinG", label: "Protein", unit: "g" },
  { key: "fibreG", label: "Fibre", unit: "g" },
  { key: "ironMg", label: "Iron", unit: "mg" },
  { key: "b12Ug", label: "Vitamin B12", unit: "µg" },
];

const sourceByType = Object.fromEntries(nutritionSources.map((s) => [s.sourceType, s]));

export default function AdminFood() {
  const { record } = useAudit();
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});

  function correctAction(f: (typeof opsFoods)[number]) {
    return flagged[f.id] ? (
      <StatusTag label="Correction requested" />
    ) : (
      <RowAction
        onClick={() => {
          setFlagged((prev) => ({ ...prev, [f.id]: true }));
          record("requested nutrition correction", `${f.name} (${f.id}, ${f.datasetVersion ?? "no dataset"})`);
        }}
      >
        Correct<span className="sr-only"> {f.name}</span>
      </RowAction>
    );
  }

  return (
    <main className="flex-1 pb-10">
      <AdminShell>
        <PageTitle eyebrow="Admin · Food">Food & nutrition provenance</PageTitle>
        <Lede>
          Every figure carries its source type, dataset version and confidence. A missing nutrient is shown as
          &ldquo;data unavailable&rdquo; — never zero, never inferred. Values below are synthetic stand-ins.
        </Lede>

        <section aria-labelledby="sources-heading" className="mb-8">
          <CardTitle>
            <span id="sources-heading">Sources</span>
          </CardTitle>
          <ul className="grid grid-cols-1 gap-2 md:hidden">
            {nutritionSources.map((s) => (
              <li key={s.sourceType}>
                <Card className="h-full">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[0.875rem] font-medium">{s.label}</p>
                      <SourceLabel>{s.sourceType}</SourceLabel>
                    </div>
                    <StatusTag
                      label={s.status === "dormant" ? "Not licensed — dormant" : "Active"}
                      tone={s.status === "dormant" ? "negative" : "neutral"}
                    />
                  </div>
                  <p className="mt-1.5 text-[0.8125rem] text-ink-soft">{s.note}</p>
                </Card>
              </li>
            ))}
          </ul>
          <DataTable caption="Nutrition sources" head={["Source", "Type", "Status", "Note"]}>
            {nutritionSources.map((s) => (
              <Tr key={s.sourceType}>
                <Td className="font-medium">{s.label}</Td>
                <Td>
                  <SourceLabel>{s.sourceType}</SourceLabel>
                </Td>
                <Td>
                  <StatusTag
                    label={s.status === "dormant" ? "Not licensed — dormant" : "Active"}
                    tone={s.status === "dormant" ? "negative" : "neutral"}
                  />
                </Td>
                <Td className="max-w-[60ch] text-ink-soft">{s.note}</Td>
              </Tr>
            ))}
          </DataTable>
        </section>

        <section aria-labelledby="foods-heading">
          <CardTitle>
            <span id="foods-heading">Foods</span>
          </CardTitle>
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:hidden">
            {opsFoods.map((f) => {
              const dormant = sourceByType[f.sourceType]?.status === "dormant";
              return (
                <li key={f.id}>
                  <Card className="h-full">
                    <div className="flex items-start justify-between gap-2">
                      <p className="min-w-0 text-[0.875rem] font-medium">{f.name}</p>
                      <ModeTag mode={f.dietMode} />
                    </div>
                    <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[0.8125rem]">
                      <dt className="text-ink-soft">Source</dt>
                      <dd className="min-w-0 break-words font-mono text-[0.75rem]">{f.sourceType}</dd>
                      <dt className="text-ink-soft">Dataset</dt>
                      <dd className="min-w-0 break-words">
                        {f.datasetVersion ? (
                          <span className="font-mono text-[0.75rem]">{f.datasetVersion}</span>
                        ) : (
                          <DataUnavailable />
                        )}
                      </dd>
                      <dt className="text-ink-soft">Confidence</dt>
                      <dd>
                        {f.confidence ? (
                          <span className="font-mono text-[0.75rem] uppercase">{f.confidence}</span>
                        ) : (
                          <DataUnavailable />
                        )}
                      </dd>
                    </dl>
                    {dormant ? (
                      <p className="mt-2 rounded-[4px] border border-rust-tint bg-surface px-2.5 py-1.5 text-[0.8125rem] text-rust">
                        NIN source: not licensed — pipeline dormant. No values imported.
                      </p>
                    ) : null}
                    <table className="mt-3 w-full text-[0.8125rem]">
                      <caption className="mb-1 text-left font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
                        Per 100 g
                      </caption>
                      <tbody>
                        {nutrientRows.map((n) => {
                          const v = f.nutrients[n.key];
                          return (
                            <tr key={n.key} className="border-t border-hairline">
                              <th scope="row" className="py-1 pr-2 text-left font-normal text-ink-soft">
                                {n.label}
                              </th>
                              <td className="py-1 text-right">
                                {v === null ? <DataUnavailable /> : <Figure value={`${v} ${n.unit}`} source="synthetic" />}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {!dormant ? <RowActions>{correctAction(f)}</RowActions> : null}
                  </Card>
                </li>
              );
            })}
          </ul>
          <DataTable
            from="lg"
            caption="Foods, nutrients per 100 g"
            head={["Food", "Diet mode", "Provenance", ...nutrientRows.map((n) => `${n.label} /100 g`), "Actions"]}
          >
            {opsFoods.map((f) => {
              const dormant = sourceByType[f.sourceType]?.status === "dormant";
              return (
                <Tr key={f.id}>
                  <Td className="min-w-[11rem]">
                    <p className="font-medium">{f.name}</p>
                    {dormant ? (
                      <p className="mt-1 text-rust">NIN source: not licensed — pipeline dormant. No values imported.</p>
                    ) : null}
                  </Td>
                  <Td>
                    <ModeTag mode={f.dietMode} />
                  </Td>
                  <Td>
                    <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5">
                      <dt className="text-ink-soft">Source</dt>
                      <dd className="font-mono text-[0.75rem]">{f.sourceType}</dd>
                      <dt className="text-ink-soft">Dataset</dt>
                      <dd>
                        {f.datasetVersion ? (
                          <span className="font-mono text-[0.75rem]">{f.datasetVersion}</span>
                        ) : (
                          <DataUnavailable />
                        )}
                      </dd>
                      <dt className="text-ink-soft">Confidence</dt>
                      <dd>
                        {f.confidence ? (
                          <span className="font-mono text-[0.75rem] uppercase">{f.confidence}</span>
                        ) : (
                          <DataUnavailable />
                        )}
                      </dd>
                    </dl>
                  </Td>
                  {nutrientRows.map((n) => {
                    const v = f.nutrients[n.key];
                    return (
                      <Td key={n.key} className="text-right [&>span]:flex-wrap [&>span]:justify-end [&>span]:gap-x-1.5 [&>span]:gap-y-0 [&>span>span]:whitespace-nowrap">
                        {v === null ? <DataUnavailable /> : <Figure value={`${v} ${n.unit}`} source="synthetic" />}
                      </Td>
                    );
                  })}
                  <Td>{!dormant ? <CellActions>{correctAction(f)}</CellActions> : <span className="text-ink-soft">—</span>}</Td>
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
