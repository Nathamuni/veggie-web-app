import { PageTitle } from "@/components/ui/Shell";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SourceLabel } from "@/components/ui/SourceLabel";
import { StatusTag } from "@/app/partner/_components/StatusTag";
import { AdminShell, Lede } from "../_components/ui";
import { AuditStrip } from "../_components/Audit";
import { impactFactorCategories, impactFactorVersions } from "@/lib/fixtures/operations";

const statusLabels = {
  pending_legal_review: "Pending legal review",
  published: "Published",
  retired: "Retired",
} as const;

export default function AdminImpact() {
  return (
    <main className="flex-1 pb-10">
      <AdminShell>
        <PageTitle eyebrow="Admin · Impact">Impact reference factors</PageTitle>
        <Lede>
          Factors convert avoided meals into estimated animal impact. The base metric — animal-based meals
          avoided — needs no factor. No factor value is shown until a version clears legal review.
        </Lede>

        <section aria-labelledby="versions-heading" className="mb-8">
          <CardTitle>
            <span id="versions-heading">Versions</span>
          </CardTitle>
          <ul className="flex flex-col gap-3 lg:grid lg:grid-cols-2">
            {impactFactorVersions.map((v) => {
              const blocked = v.status === "pending_legal_review";
              const reasonId = `publish-reason-${v.version}`;
              return (
                <li key={v.version}>
                  <Card>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="break-all font-mono text-[0.875rem] font-medium">{v.version}</p>
                        <SourceLabel>
                          created {v.createdAt} · published {v.publishedAt ?? "never"}
                        </SourceLabel>
                      </div>
                      <StatusTag label={statusLabels[v.status]} tone={blocked ? "negative" : "neutral"} />
                    </div>
                    <p className="mt-2 text-[0.8125rem] text-ink-soft">{v.note}</p>

                    <table className="mt-3 w-full text-[0.8125rem]">
                      <caption className="mb-1 text-left font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
                        Factor per avoided meal, by category
                      </caption>
                      <tbody>
                        {impactFactorCategories.map((cat) => (
                          <tr key={cat} className="border-t border-hairline">
                            <th scope="row" className="py-1.5 pr-2 text-left font-normal">
                              {cat}
                            </th>
                            <td className="py-1.5 text-right font-mono text-[0.75rem] italic text-ink-soft">
                              not yet published
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="mt-4 flex flex-col gap-2">
                      <Button type="button" variant="secondary" disabled={blocked} aria-describedby={reasonId} className="self-start">
                        Publish version
                      </Button>
                      <p id={reasonId} className="text-[0.8125rem] text-rust">
                        {blocked
                          ? "Publishing disabled: this version is pending legal review. It can be published only after legal sign-off is recorded."
                          : ""}
                      </p>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>

        <AuditStrip />
      </AdminShell>
    </main>
  );
}
