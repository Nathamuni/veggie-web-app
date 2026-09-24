import { Shell, PageTitle } from "@/components/ui/Shell";
import { requireOnboardedUser } from "@/lib/auth/session";
import { listRecipes, savedRecipeIds } from "@/lib/data/food";
import { totalMinutes } from "@/domain/food/recipe";
import { RecipeBrowser, type RecipeCard } from "./RecipeBrowser";

export default async function RecipesPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const user = await requireOnboardedUser();
  const [{ saved }, all, savedIds] = await Promise.all([searchParams, listRecipes(), savedRecipeIds(user.id)]);

  const cards: RecipeCard[] = all.map((r) => ({
    id: r.id,
    name: r.name,
    cuisine: r.cuisine,
    dietMode: r.dietMode,
    minutes: totalMinutes(r),
    costBand: r.costBand,
    protein: r.protein,
    tags: r.tags,
    ingredients: r.ingredients.map((i) => i.item.toLowerCase()),
    saved: savedIds.has(r.id),
  }));

  return (
    <main className="flex-1 pb-8">
      <Shell>
        <PageTitle eyebrow={`${cards.length} full recipes`}>Recipes</PageTitle>
        <RecipeBrowser
          recipes={cards}
          userDiet={user.profile.dietMode}
          userCuisines={user.profile.cuisines}
          initialSaved={saved === "1"}
        />
      </Shell>
    </main>
  );
}
