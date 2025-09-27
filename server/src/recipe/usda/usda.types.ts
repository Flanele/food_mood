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
