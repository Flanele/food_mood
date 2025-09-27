export interface RecipeIngredient {
  id: number;

  recipeId: number;

  name: string;
  amount: number;
  unit: string;
  grams: number;

  kcalTotal: number;
  protTotal: number;
  fatTotal: number;
  carbTotal: number;
  sugarTotal: number;
}

export interface IngredientCache {
  id: number;

  externalId: number;

  name: string;
  normalizedName: string;
  dataType: string;

  basis: string;

  kcalBase: number;
  protBase: number;
  fatBase: number;
  carbBase: number;
  sugarBase: number;

  provider: string;
}

export interface PieceWeightRow {
  id: number;
  normalizedName: string;
  gramsPerPiece: number;
  source: string;
}
