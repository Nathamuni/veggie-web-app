import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { ModeTag } from "@/components/ui/ModeTag";
import { PublicChrome } from "@/components/ui/PublicChrome";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { DataUnavailable, SourceLabel } from "@/components/ui/SourceLabel";
import { dishes, restaurants } from "@/lib/fixtures";

export const metadata: Metadata = {
  title: "Restaurants · Veggie",
};

const suitabilityLabel = {
  pure_veg: "Pure veg",
  veg_friendly: "Veg-friendly",
} as const;

export default function PublicRestaurantsPage() {
  return (
    <PublicChrome>
      <main className="flex-1 pb-10">
        <Shell>
          <PageTitle eyebrow="Restaurants · preview">Places with good plant-based options</PageTitle>
          <p className="mb-2 text-[0.875rem] text-ink-soft md:max-w-[65ch]">
            A preview list. Veggie Rating and the external rating are shown separately and
            are never combined.
          </p>
          <p className="mb-6">
            <SourceLabel>Synthetic demo data</SourceLabel>
          </p>

          <ul className="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((r) => {
              const menu = dishes.filter((d) => d.restaurantId === r.id);
              const hasVegetarian = menu.some((d) => d.dietMode === "vegetarian");
              const hasVegan = menu.some((d) => d.dietMode === "vegan");
              return (
                <li key={r.id}>
                  <Card className="md:flex md:h-full md:flex-col">
                    <CardTitle>{r.name}</CardTitle>
                    <p className="text-[0.8125rem] text-ink-soft">
                      {r.area} · {r.cuisines.join(", ")}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 md:flex-1 md:content-start">
                      <ModeTag mode="neutral" label={suitabilityLabel[r.dietSuitability]} />
                      {hasVegetarian ? (
                        <ModeTag mode="vegetarian" label="Vegetarian options" />
                      ) : null}
                      {hasVegan ? <ModeTag mode="vegan" label="Vegan options" /> : null}
                    </div>

                    <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-hairline pt-3">
                      <div>
                        <dt className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
                          Veggie Rating
                        </dt>
                        <dd className="mt-1">
                          <DataUnavailable />
                        </dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
                          External rating
                        </dt>
                        <dd className="mt-1">
                          <span className="font-mono text-[0.9375rem] font-medium text-ink">
                            {r.externalRating}★
                          </span>
                          <span className="block">
                            <SourceLabel>
                              {r.externalSource} · {r.externalRatingCount.toLocaleString("en-IN")}{" "}
                              ratings
                            </SourceLabel>
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </Card>
                </li>
              );
            })}
          </ul>

          <section
            aria-labelledby="restaurants-cta"
            className="mt-8 rounded-[6px] border border-hairline bg-surface p-4 text-center md:mx-auto md:max-w-[560px] md:p-6"
          >
            <h2 id="restaurants-cta" className="text-[0.9375rem] font-semibold">
              Which dish should you order?
            </h2>
            <p className="mx-auto mt-1 max-w-[34ch] text-[0.8125rem] text-ink-soft">
              Dish-level suitability and Veggie Ratings are part of your account.
            </p>
            <Button href="/auth/sign-up" variant="secondary" className="mt-4">
              Sign up to see dish-level suitability
            </Button>
          </section>
        </Shell>
      </main>
    </PublicChrome>
  );
}
