"use client";

import { useState } from "react";
import { PageTitle } from "@/components/ui/Shell";
import { Card, CardTitle } from "@/components/ui/Card";
import { ModeTag } from "@/components/ui/ModeTag";
import { SourceLabel } from "@/components/ui/SourceLabel";
import { StatusTag } from "@/app/partner/_components/StatusTag";
import { AdminShell, CellActions, DataTable, Lede, RowAction, RowActions, Td, Tr } from "../_components/ui";
import { AuditStrip, useAudit } from "../_components/Audit";
import { recipes, type DietMode } from "@/lib/fixtures";
import { combos } from "@/lib/fixtures/combos";
import { contentReviewStates, type ContentReviewStatus } from "@/lib/fixtures/operations";

type Item = {
  id: string;
  kind: "recipe" | "combo";
  name: string;
  cuisine: string;
  dietMode: DietMode;
  status: ContentReviewStatus;
  version: number;
};

const statusLabels: Record<ContentReviewStatus, string> = {
  draft: "Draft",
  published: "Published",
  needs_correction: "Needs correction",
};

function initialItems(): Item[] {
  const state = (id: string) => contentReviewStates[id] ?? { status: "published" as const, version: 1 };
  return [
    ...recipes.map((r) => ({ id: r.id, kind: "recipe" as const, name: r.name, cuisine: r.cuisine, dietMode: r.dietMode, ...state(r.id) })),
    ...combos.map((c) => ({ id: c.id, kind: "combo" as const, name: c.name, cuisine: c.cuisine, dietMode: c.dietMode, ...state(c.id) })),
  ];
}

const filters = ["all", "draft", "needs_correction", "published"] as const;
type Filter = (typeof filters)[number];

export default function AdminRecipes() {
  const { record } = useAudit();
  const [items, setItems] = useState<Item[]>(initialItems);
  const [filter, setFilter] = useState<Filter>("all");

  function update(item: Item, patch: Partial<Item>, action: string) {
    setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, ...patch } : x)));
    const version = patch.version ?? item.version;
    record(action, `${item.kind} ${item.name} v${version}`);
  }

  const shown = filter === "all" ? items : items.filter((i) => i.status === filter);

  function itemActions(item: Item) {
    return (
      <>
        {item.status !== "published" ? (
          <RowAction onClick={() => update(item, { status: "published" }, "published")}>
            Publish<span className="sr-only"> {item.name}</span>
          </RowAction>
        ) : null}
        {item.status !== "needs_correction" ? (
          <RowAction
            tone="destructive"
            onClick={() => update(item, { status: "needs_correction" }, "marked for correction")}
          >
            Correct<span className="sr-only"> {item.name}</span>
          </RowAction>
        ) : null}
        <RowAction
          onClick={() => update(item, { version: item.version + 1, status: "draft" }, "created new draft version")}
        >
          New version<span className="sr-only"> of {item.name}</span>
        </RowAction>
      </>
    );
  }

  return (
    <main className="flex-1 pb-10">
      <AdminShell>
        <PageTitle eyebrow="Admin · Recipes">Recipes & combos</PageTitle>
        <Lede>
          Each item carries one diet mode — vegetarian or vegan, never both. Publishing makes a version visible to
          users; a new version starts as a draft and the published one stays live until it is replaced.
        </Lede>

        <fieldset className="mb-4">
          <legend className="mb-1.5 text-[0.8125rem] font-medium">Show</legend>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <label
                key={f}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-[0.8125rem] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-turmeric ${
                  filter === f ? "border-2 border-ink font-medium" : "border-hairline text-ink-soft"
                }`}
              >
                <input
                  type="radio"
                  name="status-filter"
                  className="sr-only"
                  checked={filter === f}
                  onChange={() => setFilter(f)}
                />
                {f === "all" ? "All" : statusLabels[f]} (
                {f === "all" ? items.length : items.filter((i) => i.status === f).length})
              </label>
            ))}
          </div>
        </fieldset>

        <section aria-labelledby="items-heading">
          <CardTitle>
            <span id="items-heading">{shown.length} items</span>
          </CardTitle>
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:hidden">
            {shown.map((item) => (
              <li key={item.id}>
                <Card className="h-full">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[0.875rem] font-medium">{item.name}</p>
                      <p className="text-[0.75rem] text-ink-soft">
                        {item.kind} · {item.cuisine} · <SourceLabel>v{item.version}</SourceLabel>
                      </p>
                    </div>
                    <StatusTag
                      label={statusLabels[item.status]}
                      tone={item.status === "needs_correction" ? "negative" : "neutral"}
                    />
                  </div>
                  <p className="mt-2">
                    <ModeTag mode={item.dietMode} />
                  </p>
                  <RowActions>{itemActions(item)}</RowActions>
                </Card>
              </li>
            ))}
          </ul>
          <DataTable from="lg" caption="Recipes and combos" head={["Item", "Kind", "Cuisine", "Diet mode", "Version", "Status", "Actions"]}>
            {shown.map((item) => (
              <Tr key={item.id}>
                <Td className="font-medium">{item.name}</Td>
                <Td className="text-ink-soft">{item.kind}</Td>
                <Td className="text-ink-soft">{item.cuisine}</Td>
                <Td>
                  <ModeTag mode={item.dietMode} />
                </Td>
                <Td>
                  <SourceLabel>v{item.version}</SourceLabel>
                </Td>
                <Td>
                  <StatusTag
                    label={statusLabels[item.status]}
                    tone={item.status === "needs_correction" ? "negative" : "neutral"}
                  />
                </Td>
                <Td>
                  <CellActions>{itemActions(item)}</CellActions>
                </Td>
              </Tr>
            ))}
          </DataTable>
        </section>

        <AuditStrip />
      </AdminShell>
    </main>
  );
}
