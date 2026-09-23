import Link from "next/link";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card } from "@/components/ui/Card";
import { DataUnavailable } from "@/components/ui/SourceLabel";
import { nutrition, nextBestMeal } from "@/lib/fixtures";

export default function NutritionCentre() {
  return (
    <main className="flex-1 pb-8">
      <Shell>
        <Link href="/app" className="mt-5 inline-block text-ink">
          ← Home
        </Link>
        <PageTitle eyebrow="Today">Nutrition Centre</PageTitle>

        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
        <div>
        <Card className="mb-4">
          <p className="text-[0.8125rem] text-ink-soft">
            Based on <span className="font-medium text-ink">{nutrition.dataQuality}</span> logged-meal
            data today. More logging improves accuracy — this is never a diagnosis.
          </p>
        </Card>

        <div className="flex flex-col gap-2 md:grid md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          {nutrition.today.map((n) => (
            <Card key={n.nutrient} className="flex items-center justify-between">
              <span className="text-[0.9375rem]">{n.nutrient}</span>
              <div className="text-right">
                {n.value ? (
                  <span className="font-mono text-[0.9375rem] font-medium text-ink">{n.value}</span>
                ) : (
                  <DataUnavailable />
                )}
                <p
                  className={`font-mono text-[0.625rem] uppercase tracking-wide ${
                    n.status === "low" ? "text-rust" : "text-ink-soft"
                  }`}
                >
                  {n.status === "low"
                    ? "appears low today"
                    : n.source ?? "no approved source yet"}
                </p>
              </div>
            </Card>
          ))}
        </div>

        </div>

        <aside className="xl:sticky xl:top-6 xl:self-start">
        <div className="mt-6 xl:mt-0">
          <p className="mb-2 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
            To help with iron &amp; zinc today
          </p>
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-[0.875rem] font-medium">{nextBestMeal.name}</p>
              <p className="text-[0.75rem] text-ink-soft">Millet + legumes — both iron sources</p>
            </div>
            <Link href="/app/log" className="text-[0.8125rem] text-ink underline">
              Open
            </Link>
          </Card>
        </div>

        <p className="mt-6 text-[0.75rem] leading-relaxed text-ink-soft">
          Source: USDA FoodData Central. ICMR-NIN regional data pending written permission —
          figures do not yet reflect Indian food composition tables.{" "}
          <span className="underline">View methodology</span>
        </p>
        </aside>
        </div>
      </Shell>
    </main>
  );
}
