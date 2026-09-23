import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card, CardTitle } from "@/components/ui/Card";
import { ModeTag } from "@/components/ui/ModeTag";
import { SourceLabel } from "@/components/ui/SourceLabel";
import { SyntheticNote } from "../_components/StatusTag";
import {
  demoPartnerId,
  partnerAnalytics,
  partnerClaims,
  partnerRatings,
  partnerVerificationHistory,
} from "@/lib/fixtures/operations";

const listingId = partnerClaims.find((c) => c.claimantId === demoPartnerId)!.listingId;
const ratings = partnerRatings.filter((r) => r.listingId === listingId);

const metrics = [
  { label: "Listing views", value: partnerAnalytics.views },
  { label: "Saves", value: partnerAnalytics.saves },
  { label: "Direction taps", value: partnerAnalytics.directionTaps },
];

export default function PartnerAnalytics() {
  return (
    <main className="flex-1 pb-10">
      <Shell>
        <PageTitle eyebrow="Partner · Analytics">Analytics</PageTitle>

        <section aria-labelledby="engagement-heading" className="mb-6">
          <CardTitle>
            <span id="engagement-heading">Engagement, {partnerAnalytics.period}</span>
          </CardTitle>
          <p className="mb-3 inline-block">
            <ModeTag mode="warning" label="Synthetic placeholder numbers — not measured" />
          </p>
          <dl className="grid grid-cols-2 gap-3 min-[400px]:grid-cols-3">
            {metrics.map((m) => (
              <Card key={m.label}>
                <dt className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">{m.label}</dt>
                <dd className="mt-1">
                  <span className="block text-[1.25rem] font-semibold leading-tight">
                    {m.value.toLocaleString("en-IN")}
                  </span>
                  <SourceLabel>synthetic</SourceLabel>
                </dd>
              </Card>
            ))}
          </dl>
        </section>

        <section aria-labelledby="ratings-heading" className="mb-6">
          <CardTitle>
            <span id="ratings-heading">User ratings</span>
          </CardTitle>
          <p className="mb-3 rounded-[6px] border border-hairline bg-surface p-3 text-[0.8125rem] md:max-w-[75ch]">
            <span className="font-medium">Read-only.</span> Owners cannot edit or remove user ratings or
            verification history. To dispute a rating, use a correction request — the Veggie team reviews it.
          </p>
          <ul className="flex flex-col gap-3 md:grid md:grid-cols-2">
            {ratings.map((r) => (
              <li key={r.id}>
                <Card className="h-full">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-[0.875rem] font-medium">{r.dishName}</p>
                    <span className="font-mono text-[0.8125rem]" aria-label={`Rated ${r.score} out of 5`}>
                      {r.score}/5
                    </span>
                  </div>
                  <p className="mt-1 text-[0.9375rem]">&ldquo;{r.text}&rdquo;</p>
                  <p className="mt-1.5">
                    <SourceLabel>
                      {r.userId} · {r.date} · {r.verification === "verified-visit" ? "verified visit" : "unverified"}
                    </SourceLabel>
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="history-heading" className="mb-6">
          <CardTitle>
            <span id="history-heading">Verification history</span>
          </CardTitle>
          <Card>
            <ol className="flex flex-col">
              {partnerVerificationHistory.map((e) => (
                <li
                  key={e.id}
                  className="border-t border-hairline py-2 first:border-t-0 first:pt-0 last:pb-0"
                >
                  <p className="text-[0.875rem]">{e.event}</p>
                  <SourceLabel>
                    {e.date} · by {e.actorRole}
                  </SourceLabel>
                </li>
              ))}
            </ol>
          </Card>
        </section>

        <SyntheticNote>Ratings, user ids and figures on this page are synthetic.</SyntheticNote>
      </Shell>
    </main>
  );
}
