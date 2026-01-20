import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { IngredientCache } from 'generated/prisma';
import { UsdaService } from './usda/usda.service';
import { ExternalIngredient, Food } from './usda/usda.types';
import { PieceWeightRow } from './indredient.types';
import {
  AddIngredientDto,
  IngredientSuggestionDto,
  IngredientSuggestQueryDto,
} from './dto';

@Injectable()
export class IngredientService {
  constructor(
    private db: DbService,
    private usda: UsdaService,
  ) {}

  private normalizeName(name: string) {
    return name.trim().toUpperCase();
  }

  private async findOneInCache(
    rawName: string,
  ): Promise<IngredientCache | null> {
    const normalizedName = this.normalizeName(rawName);
    return this.db.ingredientCache.findUnique({ where: { normalizedName } });
  }

  private async findOneInCacheByExternalId(
    externalId: number,
  ): Promise<IngredientCache | null> {
    return this.db.ingredientCache.findFirst({ where: { externalId } });
  }

  private async createCacheFromExternal(ext: ExternalIngredient, name: string) {
    return this.db.ingredientCache.create({
      data: {
        ...ext,
        normalizedName: this.normalizeName(name),
      },
    });
  }

  async getOrFetch(
    rawName: string,
    externalId?: number,
  ): Promise<IngredientCache | null> {
    if (externalId) {
      const cachedById = await this.findOneInCacheByExternalId(externalId);
      if (cachedById) return cachedById;
    }

    const cachedByName = await this.findOneInCache(rawName);
    if (cachedByName) return cachedByName;

    let food: Food | null = null;

    if (externalId) {
      food = await this.usda.findByExternalId(externalId);
    }

    if (!food) {
      const candidates = await this.usda.searchByName(rawName, 10);
      food = candidates[0] ?? null;
    }

    if (!food) return null;

    const ext = this.usda.buildExternalInfredient(food);
    return this.createCacheFromExternal(ext, rawName);
  }

  private async toGrams(
    amount: number,
    unit: string,
    cache: IngredientCache,
    opts?: { pieceGrams?: number },
  ): Promise<number> {
    if (amount <= 0) return 0;
    const u = (unit || '').trim().toLowerCase();

    if (u === 'g') return amount;
    if (u === 'mg') return amount / 1000;
    if (u === 'kg') return amount * 1000;
    if (u === 'oz' || u === 'ounce') return amount * 28.3495;
    if (u === 'lb' || u === 'pound') return amount * 453.592;

    // объём (грубое приближение: 1 мл = 1 г воды)
    if (u === 'ml') return amount;
    if (u === 'l' || u === 'liter' || u === 'litre') return amount * 1000;

    // ложки (кухонные меры)
    if (u === 'tsp' || u === 'teaspoon') return amount * 5; // 1 ч.л. ≈ 5 мл
    if (u === 'tbsp' || u === 'tablespoon') return amount * 15; // 1 ст.л. ≈ 15 мл
    if (u === 'cup') return amount * 240; // 1 cup ≈ 240 мл

    // штуки
    if (['pc', 'pcs', 'piece', 'unit'].includes(u)) {
      if (opts?.pieceGrams && opts.pieceGrams > 0)
        return amount * opts.pieceGrams;

      const row = await this.findIngredientWeight(cache.normalizedName);
      if (row?.gramsPerPiece && row.gramsPerPiece > 0) {
        return amount * row.gramsPerPiece;
      }
      return 0;
    }

    return 0;
  }

  private calcTotals(grams: number, cache: IngredientCache) {
    const coef = grams / 100;
    return {
      kcalTotal: cache.kcalBase * coef,
      protTotal: cache.protBase * coef,
      fatTotal: cache.fatBase * coef,
      carbTotal: cache.carbBase * coef,
      sugarTotal: cache.sugarBase * coef,
    };
  }

  async buildIngredientRow(ingredient: AddIngredientDto) {
    const cache = await this.getOrFetch(ingredient.name, ingredient.externalId);
    if (!cache)
      throw new BadRequestException(`ingredient not found: ${ingredient.name}`);

    const grams = await this.toGrams(
      ingredient.amount,
      ingredient.unit,
      cache,
      ingredient.opts,
    );
    if (!grams || grams <= 0) {
      throw new BadRequestException(
        `cannot convert "${ingredient.amount} ${ingredient.unit}" for "${ingredient.name}" to grams. ` +
          `pieceWeight lookups tried: [${this.normalizeName(ingredient.name)}, ${cache.normalizedName}]. ` +
          `Provide opts.pieceGrams or use a mass/volume unit.`,
      );
    }

    const { kcalTotal, protTotal, fatTotal, carbTotal, sugarTotal } =
      this.calcTotals(grams, cache);

    const round = (x: number, d = 2) => {
      const p = 10 ** d;
      return Math.round((x + Number.EPSILON) * p) / p;
    };

    return {
      name: ingredient.name,
      amount: ingredient.amount,
      unit: ingredient.unit,
      grams: round(grams),
      kcalTotal: round(kcalTotal),
      protTotal: round(protTotal),
      fatTotal: round(fatTotal),
      carbTotal: round(carbTotal),
      sugarTotal: round(sugarTotal),
    };
  }

  async suggest(
    dto: IngredientSuggestQueryDto,
  ): Promise<IngredientSuggestionDto[]> {
    const q = dto.query.trim();
    if (q.length < 2) return [];

    const limit = dto.limit ?? 10;

    const suggestions = await this.usda.searchByName(q, limit);

    return suggestions.map((s) => ({
      externalId: s.fdcId,
      name: s.description,
      dataType: s.dataType,
    }));
  }

  async findIngredientWeight(name: string): Promise<PieceWeightRow | null> {
    const normalizedName = this.normalizeName(name);
    return this.db.pieceWeight.findUnique({
      where: { normalizedName },
    });
  }
}
