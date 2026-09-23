import Link from "next/link";
import { PageTitle } from "@/components/ui/Shell";
import { CardTitle } from "@/components/ui/Card";
import { AdminShell, Lede } from "./_components/ui";
import { AuditStrip } from "./_components/Audit";
import {
  cuisineTaxonomy,
  impactFactorVersions,
  moderationCases,
  opsListings,
  partnerClaims,
} from "@/lib/fixtures/operations";

// Queue counts are read from the synthetic fixtures. Actions taken on the
// section screens are client state and do not feed back into these counts.
const queues = [
  {
    href: "/admin/restaurants",
    label: "Partner claims awaiting decision",
    count: partnerClaims.filter((c) => c.status === "submitted" || c.status === "under_review").length,
  },
  {
    href: "/admin/restaurants",
    label: "Listings pending review",
    count: opsListings.filter((l) => l.status === "pending_review").length,
  },
  {
    href: "/admin/restaurants",
    label: "Suspected duplicates",
    count: opsListings.filter((l) => l.duplicateOfId && l.status !== "merged").length,
  },
  {
    href: "/admin/ratings",
    label: "Open moderation cases",
    count: moderationCases.filter((m) => m.status === "open").length,
  },
  {
    href: "/admin/content",
    label: "Cuisine taxonomy proposals",
    count: cuisineTaxonomy.filter((c) => c.status === "proposed").length,
  },
  {
    href: "/admin/impact",
    label: "Impact factor sets pending legal review",
    count: impactFactorVersions.filter((v) => v.status === "pending_legal_review").length,
  },
];

const sections = [
  { href: "/admin/restaurants", label: "Restaurants", desc: "Places, partner claims, duplicates, classification" },
  { href: "/admin/recipes", label: "Recipes", desc: "Recipes and combos: publish, correct, version" },
  { href: "/admin/food", label: "Food", desc: "Nutrition provenance, dataset versions, confidence" },
  { href: "/admin/ratings", label: "Ratings", desc: "Flagged reviews and correction reports" },
  { href: "/admin/impact", label: "Impact", desc: "Reference factor versions and legal status" },
  { href: "/admin/content", label: "Content", desc: "Lesson mapping and cuisine taxonomy" },
];

export default function AdminOverview() {
  return (
    <main className="flex-1 pb-10">
      <AdminShell>
        <PageTitle eyebrow="Operator tools">Admin overview</PageTitle>
        <Lede>Internal view for Veggie operations staff. All queues, ids and entries are synthetic.</Lede>

        <section aria-labelledby="queues-heading" className="mb-6">
          <CardTitle>
            <span id="queues-heading">Queues</span>
          </CardTitle>
          <ul className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2 md:grid-cols-3">
            {queues.map((q) => (
              <li key={q.label}>
                <Link
                  href={q.href}
                  className="flex h-full flex-col rounded-[6px] border border-hairline bg-surface p-4 transition-colors hover:border-ink-soft"
                >
                  <span className="text-[1.25rem] font-semibold leading-tight">{q.count}</span>
                  <span className="mt-1 text-[0.8125rem] text-ink-soft">{q.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <nav aria-label="Admin shortcuts" className="mb-2">
          <CardTitle>Sections</CardTitle>
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
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

        <AuditStrip limit={8} />
      </AdminShell>
    </main>
  );
}
