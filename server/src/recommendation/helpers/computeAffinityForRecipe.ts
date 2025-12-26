import { RecipeLite } from '../recommendation.types';

export function computeAffinityForRecipe(
  recipe: RecipeLite,
  gramsByIngredient: Map<string, number>,
): { affinity: number; hits: string[] } {
  const names = recipe.ingredients.map((i) => i.name.toLowerCase().trim());

  const ranked = names
    .map((n) => ({ name: n, grams: gramsByIngredient.get(n) ?? 0 }))
    .sort((a, b) => b.grams - a.grams);

  const perIng = (g: number) => Math.min(0.02, (g / 1000) * 0.02);

  const raw = ranked.reduce((s, x) => s + perIng(x.grams), 0);

  const affinity = Number(Math.min(0.1, raw).toFixed(2));

  const hits = ranked
    .filter((x) => x.grams > 0)
    .slice(0, 5)
    .map((x) => x.name);

  return { affinity, hits };
}

