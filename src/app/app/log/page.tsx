import { Shell, PageTitle } from "@/components/ui/Shell";
import { LogMeal, type RecentMeal } from "@/components/meal/LogForm";
import { requireOnboardedUser } from "@/lib/auth/session";
import { listRecipes, recentMealLogs } from "@/lib/data/food";
import { istNow } from "@/lib/time";

export default async function LogMealPage({ searchParams }: { searchParams: Promise<{ recipe?: string }> }) {
  const user = await requireOnboardedUser();
  const [{ recipe: presetId }, all, logs] = await Promise.all([searchParams, listRecipes(), recentMealLogs(user.id, 4)]);

  const recipes = all.map((r) => ({ id: r.id, name: r.name, dietMode: r.dietMode, cuisine: r.cuisine }));
  const seen = new Set<string>();
  const recent: RecentMeal[] = [];
  for (const l of logs) {
    const key = l.recipeId ?? l.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    recent.push({ name: l.name, recipeId: l.recipeId, diet: l.diet, source: l.source });
    if (recent.length === 6) break;
  }

  const presetRecipe = presetId ? recipes.find((r) => r.id === presetId) : undefined;
  const preset: RecentMeal | undefined = presetRecipe
    ? { name: presetRecipe.name, recipeId: presetRecipe.id, diet: presetRecipe.dietMode, source: "cooked" }
    : undefined;

  return (
    <main className="flex-1 pb-8">
      <Shell width="narrow">
        <PageTitle eyebrow={istNow().dateLabel}>Log a meal</PageTitle>
        <LogMeal recipes={recipes} recent={recent} defaultSlot={istNow().slot} preset={preset} />
      </Shell>
    </main>
  );
}
