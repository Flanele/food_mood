export type Mode = "sign-in" | "sign-up";

export type RecipeFilters = {
  includeIngredients?: string[];
  excludeIngredients?: string[];
  minKcal?: number;
  maxKcal?: number;
  minSugar?: number;
  maxSugar?: number;
  minProt?: number;
  maxProt?: number;
};

export type RecipeListQuery = {
  q?: string;
  filters?: RecipeFilters;
  page?: number;
  limit?: number;
};

export const UNITS = [
  "g",
  "mg",
  "kg",
  "ml",
  "l",
  "ounce",
  "pounde",
  "teaspoon",
  "tablespoon",
  "cup",
  "piece",
] as const;

export type Unit = (typeof UNITS)[number];
