import { LogLite } from '../recommendation.types';

export function getConsumedIngredientGrams(
  logs: Array<LogLite>,
): Map<string, number> {
  const gramsByIngredient = new Map<string, number>();

  for (const log of logs) {
    const coef =
      log.recipe.servings && log.recipe.servings > 0
        ? log.servings / log.recipe.servings
        : log.servings;
        
    for (const ing of log.recipe.ingredients) {
      const key = ing.name.toLowerCase().trim();
      gramsByIngredient.set(
        key,
        (gramsByIngredient.get(key) ?? 0) + ing.grams * coef,
      );
    }
  }

  return gramsByIngredient;
}
