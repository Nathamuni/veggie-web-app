import { notFound } from "next/navigation";
import { requireOnboardedUser } from "@/lib/auth/session";
import { getRecipe } from "@/lib/data/food";
import { CookMode } from "./CookMode";

export default async function CookPage({ params }: { params: Promise<{ id: string }> }) {
  await requireOnboardedUser();
  const recipe = await getRecipe((await params).id);
  if (!recipe) notFound();
  return (
    <CookMode
      recipe={{ id: recipe.id, name: recipe.name, dietMode: recipe.dietMode }}
      steps={recipe.steps}
      ingredients={recipe.ingredients}
      servings={recipe.servings}
    />
  );
}
