export type IngLite = { name: string; grams: number };

export type RecipeLite = {
  kcalPerServ: number;
  servings?: number;
  ingredients: IngLite[];
};

export type LogLite = {
  recipe: RecipeLite;
  servings: number;
  moodScore: number | null;
  energyScore: number | null;
  sleepScore: number | null;
};

export type PeerLogLite = {
  recipeId: number;
  moodScore: number | null;
  energyScore: number | null;
  sleepScore: number | null;
};