import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ExternalIngredient, Food, FoodNutrient } from './usda.types';

@Injectable()
export class UsdaService {
  private readonly apiKey = process.env.USDA_API_KEY;
  private readonly baseUrl = 'https://api.nal.usda.gov/fdc/v1';

  constructor(private http: HttpService) {}

  async fetchFromUSDA(query: string): Promise<ExternalIngredient | null> {
    const url = `${this.baseUrl}/foods/search`;
    const ladders = [['Foundation'], ['SR Legacy'], ['Branded']];
    const words = query.trim().toUpperCase().split(/\s+/).filter(Boolean);

    let best: Food | null = null;
    let bestScore = 0;
    const MACRO_IDS = [1008, 1003, 1004, 1005, 2000, 269, 1079, 1009];

    for (const dataType of ladders) {
      const { data } = await firstValueFrom(
        this.http.get(url, {
          params: {
            api_key: this.apiKey,
            query,
            dataType,
            pageSize: 25,
            nutrients: MACRO_IDS,
          },
          paramsSerializer: { indexes: null },
          validateStatus: () => true,
        }),
      );

      const foods: Food[] = data?.foods ?? [];
      if (!foods.length) continue;

      for (const food of foods) {
        const desc = (food.description || '').toUpperCase();
        const score = words.filter((word) => desc.includes(word)).length;
        if (score > bestScore) {
          best = food;
          bestScore = score;
        }
      }
    }

    if (!best || bestScore === 0) return null;

    const nutrients = this.buildNutrientMap(best.foodNutrients ?? []);

    const prot = nutrients.get(1003) ?? 0;
    const fat = nutrients.get(1004) ?? 0;
    const carb = nutrients.get(1005) ?? 0;
    const kcal = nutrients.get(1008) ?? this.kcalFromAtwater(fat, prot, carb);
    const sugar =
      nutrients.get(2000) ??
      nutrients.get(269) ??
      this.estimateSugar(nutrients, fat, prot);

    return {
      externalId: best.fdcId,
      name: best.description,
      dataType: best.dataType,
      basis: 'PER_100G',
      kcalBase: Math.max(kcal, 0),
      protBase: Math.max(prot, 0),
      fatBase: Math.max(fat, 0),
      carbBase: Math.max(carb, 0),
      sugarBase: Math.max(sugar ?? 0, 0),
      provider: 'usda',
    };
  }

  private buildNutrientMap(
    arrayNutrients: FoodNutrient[],
  ): Map<number, number> {
    const map = new Map<number, number>();

    for (const nutrient of arrayNutrients) {
      if (
        typeof nutrient.nutrientId === 'number' &&
        typeof nutrient.value === 'number'
      ) {
        map.set(nutrient.nutrientId, nutrient.value);
      }
    }

    return map;
  }

  private kcalFromAtwater(fat: number, prot: number, carb: number): number {
    return 9 * (fat || 0) + 4 * (prot || 0) + 4 * (carb || 0);
  }

  private estimateSugar(
    nutrients: Map<number, number>,
    fat: number,
    prot: number,
  ): number | undefined {
    const carbs = nutrients.get(1005);
    const fiber = nutrients.get(1079) ?? 0;
    const starch = nutrients.get(1009) ?? 0;

    if (typeof carbs !== 'number') {
      return undefined;
    }

    const isLowCarb = carbs < 5;
    const hasFiberOrStarch = fiber > 0 || starch > 0;
    const isMostlyCarbs = carbs >= 10 && fat <= 5 && prot <= 5;

    if (isLowCarb) {
      return undefined;
    }

    if (!(hasFiberOrStarch || isMostlyCarbs)) {
      return undefined;
    }

    const estimatedSugar = carbs - fiber - starch;
    return estimatedSugar > 0 ? estimatedSugar : 0;
  }
}
