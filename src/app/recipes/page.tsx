import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { ModeTag } from "@/components/ui/ModeTag";
import { PublicChrome } from "@/components/ui/PublicChrome";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { SourceLabel } from "@/components/ui/SourceLabel";
import { recipes, type Recipe } from "@/lib/fixtures";

export const metadata: Metadata = {
  title: "Recipes · Veggie",
};

export default function PublicRecipesPage() {
  const vegetarian = recipes.filter((r) => r.dietMode === "vegetarian");
  const vegan = recipes.filter((r) => r.dietMode === "vegan");

  return (
    <PublicChrome>
      <main className="flex-1 pb-10">
        <Shell>
          <PageTitle eyebrow="Recipes · preview">Regional recipes that fill you up</PageTitle>
          <p className="mb-2 text-[0.875rem] text-ink-soft md:max-w-[65ch]">
            Vegetarian and vegan recipes are listed separately — a vegetarian recipe is never
            shown as vegan.
          </p>
          <p className="mb-6">
            <SourceLabel>Synthetic demo data</SourceLabel>
          </p>

          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <RecipeGroup id="vegetarian-recipes" mode="vegetarian" title="Vegetarian" items={vegetarian} />
            <RecipeGroup id="vegan-recipes" mode="vegan" title="Vegan" items={vegan} />
          </div>

          <section
            aria-labelledby="recipes-cta"
            className="mt-8 rounded-[6px] border border-hairline bg-surface p-4 text-center md:mx-auto md:max-w-[560px] md:p-6"
          >
            <h2 id="recipes-cta" className="text-[0.9375rem] font-semibold">
              Want recipes matched to your cravings?
            </h2>
            <p className="mx-auto mt-1 max-w-[34ch] text-[0.8125rem] text-ink-soft">
              Full ingredients, steps and personal recommendations are part of your account.
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

function RecipeGroup({
  id,
  mode,
  title,
  items,
}: {
  id: string;
  mode: Recipe["dietMode"];
  title: string;
  items: Recipe[];
}) {
  return (
    <section aria-labelledby={id} className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <h2 id={id} className="text-[1.125rem] font-semibold">
          {title}
        </h2>
        <SourceLabel>{items.length} in preview</SourceLabel>
      </div>
      {items.length === 0 ? (
        <p className="text-[0.8125rem] text-ink-soft">No {title.toLowerCase()} recipes in this preview.</p>
      ) : (
        <ul className="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-1">
          {items.map((r) => (
            <li key={r.id}>
              <Card className="md:h-full">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle>{r.name}</CardTitle>
                    <p className="text-[0.8125rem] text-ink-soft">
                      {r.cuisine} · {r.timeMinutes} min · {r.costBand}
                    </p>
                  </div>
                  <ModeTag mode={mode} />
                </div>
                {r.tags.length > 0 ? (
                  <ul className="mt-3 flex flex-wrap gap-2" aria-label="Tags">
                    {r.tags.map((t) => (
                      <li key={t}>
                        <ModeTag mode="neutral" label={t} />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
