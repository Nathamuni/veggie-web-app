import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/ui/Shell";
import { ModeTag } from "@/components/ui/ModeTag";
import { requireOnboardedUser } from "@/lib/auth/session";
import { getRecipe, savedRecipeIds, timesCooked } from "@/lib/data/food";
import { totalMinutes } from "@/domain/food/recipe";
import { IngredientList, RecipeActions, SaveButton } from "./RecipeClient";

const difficultyLabel = { easy: "Easy", medium: "Medium", involved: "Takes effort" } as const;

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireOnboardedUser();
  const { id } = await params;
  const recipe = await getRecipe(id);
  if (!recipe) notFound();

  const [saved, cooked] = await Promise.all([savedRecipeIds(user.id), timesCooked(user.id, recipe.id)]);
  const n = recipe.nutrition;
  const longWait = recipe.steps.reduce((m, s) => Math.max(m, s.timerMin ?? 0), 0)
  const veganOnlyUser = user.profile.dietMode === "vegan" && recipe.dietMode !== "vegan";

  return (
    <main className="flex-1 pb-32 lg:pb-8">
      <Shell>
        <div className="mt-4 flex items-center justify-between gap-3">
          <Link href="/app/recipes" className="-ml-2 inline-flex min-h-11 items-center px-2 text-[0.9375rem] text-ink">
            ← Recipes
          </Link>
          <SaveButton recipeId={recipe.id} initial={saved.has(recipe.id)} />
        </div>

        <header className="mb-6 mt-2 max-w-[720px]">
          <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">{recipe.cuisine}</p>
          <h1 className="mt-1 text-[clamp(1.75rem,5vw,2.25rem)] font-semibold leading-tight tracking-tight">{recipe.name}</h1>
          <p className="mt-2 text-[0.9375rem] text-ink-soft">{recipe.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <ModeTag mode={recipe.dietMode} />
            {recipe.tags.includes("Jain-friendly") ? <ModeTag mode="neutral" label="Jain-friendly" /> : null}
            {cooked > 0 ? (
              <span className="font-mono text-[0.6875rem] uppercase tracking-wide text-turmeric">
                Cooked {cooked} {cooked === 1 ? "time" : "times"}
              </span>
            ) : null}
          </div>
          {longWait > 60 ? (
            <p className="mt-3 rounded-[6px] border border-turmeric bg-turmeric-tint px-3 py-2 text-[0.8125rem]">
              <strong>Plan ahead:</strong> one step needs about {Math.round(longWait / 60)} hours of soaking or fermenting — start it
              the night before or in the morning.
            </p>
          ) : null}
          {veganOnlyUser ? (
            <p className="mt-3 rounded-[6px] border border-rust bg-rust-tint px-3 py-2 text-[0.8125rem] text-rust">
              This dish has dairy — it isn&apos;t vegan.
            </p>
          ) : null}
        </header>

        <dl className="mb-6 grid grid-cols-4 divide-x divide-hairline rounded-[6px] border border-hairline bg-surface text-center">
          {[
            ["Prep", `${recipe.prepMinutes}m`],
            ["Cook", `${recipe.cookMinutes}m`],
            ["Level", difficultyLabel[recipe.difficulty]],
            ["Spice", recipe.spice],
          ].map(([k, v]) => (
            <div key={k} className="px-2 py-2.5">
              <dt className="font-mono text-[0.625rem] uppercase tracking-wide text-ink-soft">{k}</dt>
              <dd className="mt-0.5 text-[0.875rem] font-medium capitalize">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col gap-8 xl:grid xl:grid-cols-[360px_minmax(0,1fr)] xl:items-start xl:gap-10">
          <section aria-labelledby="ingredients-title" className="xl:sticky xl:top-6">
            <IngredientList ingredients={recipe.ingredients} baseServings={recipe.servings} />
          </section>

          <div className="flex min-w-0 flex-col gap-8">
            <section aria-labelledby="method-title">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <h2 id="method-title" className="text-[1.125rem] font-semibold">
                  Method
                </h2>
                <span className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
                  {recipe.steps.length} steps · {totalMinutes(recipe)} min
                </span>
              </div>
              <ol className="flex flex-col divide-y divide-hairline border-y border-hairline">
                {recipe.steps.map((s, i) => (
                  <li key={i} className="flex gap-4 py-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-hairline font-mono text-[0.8125rem]">
                      {i + 1}
                    </span>
                    <span className="text-[0.9375rem] leading-relaxed">
                      {s.text}
                      {s.timerMin ? (
                        <span className="ml-2 whitespace-nowrap font-mono text-[0.75rem] text-turmeric">⏱ {s.timerMin} min</span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="nutrition-title">
              <h2 id="nutrition-title" className="mb-2 text-[1.125rem] font-semibold">
                Nutrition per serving
              </h2>
              <dl className="grid grid-cols-5 divide-x divide-hairline rounded-[6px] border border-hairline bg-surface text-center">
                {[
                  ["kcal", n.kcal],
                  ["Protein", `${n.proteinG}g`],
                  ["Carbs", `${n.carbsG}g`],
                  ["Fat", `${n.fatG}g`],
                  ["Fibre", `${n.fibreG}g`],
                ].map(([k, v]) => (
                  <div key={k} className="px-1 py-2.5">
                    <dt className="font-mono text-[0.625rem] uppercase tracking-wide text-ink-soft">{k}</dt>
                    <dd className="mt-0.5 font-mono text-[0.875rem] font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-1.5 font-mono text-[0.625rem] uppercase tracking-wide text-ink-soft">
                Approx · estimated from the ingredients · wellness guide, not diagnosis
              </p>
            </section>
          </div>
        </div>
      </Shell>

      <RecipeActions recipe={{ id: recipe.id, name: recipe.name, dietMode: recipe.dietMode }} />
    </main>
  );
}
