export type DataType = 'Branded' | 'Foundation' | 'SR Legacy';

export type ExternalIngredient = {
  externalId: number; // fdcId
  name: string; // description
  dataType: DataType;
  basis: 'PER_100G' | 'PER_SERVING';
  kcalBase: number;
  protBase: number;
  fatBase: number;
  carbBase: number;
  sugarBase: number;
  provider?: string | null;
};

export interface FoodNutrient {
  nutrientId: number;
  nutrientName: string;
  nutrientNumber?: string;
  unitName?: string;
  value: number;
}

export interface Food {
  fdcId: number;
  description: string;
  dataType: DataType;
  foodNutrients?: FoodNutrient[];
  servingSize?: number;
  servingSizeUnit?: string;
}

export interface FoodsSearchResponse {
  foods: Food[];
}

export const FDC_NUTRIENTS = {
  KCAL: 1008,
  PROTEIN: 1003,
  FAT: 1004,
  CARBS: 1005,

  SUGAR_TOTAL: 2000,

  SUGAR_FALLBACK: 269,

  FIBER: 1079,
} as const;

export const MACRO_IDS = [
  FDC_NUTRIENTS.KCAL,
  FDC_NUTRIENTS.PROTEIN,
  FDC_NUTRIENTS.FAT,
  FDC_NUTRIENTS.CARBS,
  FDC_NUTRIENTS.SUGAR_TOTAL,
  FDC_NUTRIENTS.SUGAR_FALLBACK,
  FDC_NUTRIENTS.FIBER,
];
