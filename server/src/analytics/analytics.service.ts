import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import {
  GetAnalyticsByTimeDto,
  GetAnalyticsByTimeQueryDto,
  GetNutrientsScoreDto,
  GetNutrientsScoreQueryDto,
  GetTopIngredientsDto,
  GetTopIngredientsQueryDto,
} from './dto';
import { Prisma } from 'generated/prisma';
import { getPerServ } from './helpers/getPerServ';
import { calcInfluence, DetailRow } from 'src/lib/utils/calc-influence';
import {
  EMPTY_TOTALS,
  MS_DAY,
  Resolution,
  SeriesPoint,
  Totals,
} from './analytics.types';
import { pickResolutionForCustomRange } from './helpers/pickResolutionForCustomRange';
import { keyForResolution } from './helpers/keyForResolution';

@Injectable()
export class AnalyticsService {
  constructor(private db: DbService) {}

  async getAnalyticsByTime(
    query: GetAnalyticsByTimeQueryDto,
    userId: number,
  ): Promise<GetAnalyticsByTimeDto> {
    let { from, to, groupBy } = query;

    const now = new Date();

    if (!from && !to && !groupBy) {
      to = now;
      from = new Date(now.getTime() - MS_DAY);
    }

    // day → last 24h + hour points
    // week → last 7d + weekday points
    // month → last 30d + day points
    let resolution: Resolution | null = null;

    if (!from && !to && groupBy) {
      to = now;

      if (groupBy === 'day') {
        from = new Date(now.getTime() - MS_DAY);
        resolution = 'hour';
      } else if (groupBy === 'week') {
        from = new Date(now.getTime() - 7 * MS_DAY);
        resolution = 'weekday';
      } else if (groupBy === 'month') {
        from = new Date(now.getTime() - 30 * MS_DAY);
        resolution = 'day';
      }
    }

    // ручной период: если from/to есть — выбираем resolution автоматически
    if (!resolution && (from || to)) {
      if (from && !to) to = now;
      if (!from && to) from = new Date(to.getTime() - MS_DAY);

      const spanMs = to!.getTime() - from!.getTime();
      if (spanMs > 366 * MS_DAY) {
        throw new BadRequestException('Period is too large (max 1 year).');
      }

      resolution = pickResolutionForCustomRange(from!, to!);
    }

    const where: Prisma.MealLogWhereInput = {
      userProfileId: userId,
      eatenAt: {
        ...(from ? { gte: from } : {}),
        ...(to ? { lte: to } : {}),
      },
    };

    const mealLogs = await this.db.mealLog.findMany({
      where,
      include: { recipe: true },
      orderBy: { eatenAt: 'asc' },
    });

    const byKey = new Map<string, Totals>();
    const total: Totals = { ...EMPTY_TOTALS };

    for (const log of mealLogs) {
      const s = log.servings;
      const r = log.recipe;

      const kcal = r.kcalPerServ * s;
      const prot = r.protPerServ * s;
      const fat = r.fatPerServ * s;
      const carb = r.carbPerServ * s;
      const sugar = r.sugarPerServ * s;

      total.kcal += kcal;
      total.prot += prot;
      total.fat += fat;
      total.carb += carb;
      total.sugar += sugar;

      const key = keyForResolution(log.eatenAt, resolution!);
      const acc = byKey.get(key) ?? { ...EMPTY_TOTALS };

      acc.kcal += kcal;
      acc.prot += prot;
      acc.fat += fat;
      acc.carb += carb;
      acc.sugar += sugar;

      byKey.set(key, acc);
    }

    const series = Array.from(byKey.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, v]) => ({ key, ...v }));

    return { total, series };
  }

  async getTopIngredients(
    query: GetTopIngredientsQueryDto,
    userId: number,
  ): Promise<GetTopIngredientsDto> {
    const { from, to, limit = 10 } = query;

    const where: Prisma.MealLogWhereInput = {
      userProfileId: userId,
      ...(from || to
        ? {
            eatenAt: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }
        : {}),
    };

    const mealLogs = await this.db.mealLog.findMany({
      where,
      include: { recipe: { include: { ingredients: true } } },
    });

    const map = new Map<
      string,
      { name: string; count: number; totalGrams: number; totalKcal: number }
    >();

    for (const log of mealLogs) {
      const servingsFactor =
        log.recipe.servings && log.recipe.servings > 0
          ? log.servings / log.recipe.servings
          : log.servings;

      for (const ing of log.recipe.ingredients) {
        const key = ing.name.trim().toLowerCase();

        if (!map.has(key)) {
          map.set(key, {
            name: ing.name,
            count: 0,
            totalGrams: 0,
            totalKcal: 0,
          });
        }

        const item = map.get(key)!;
        item.count += 1;
        item.totalGrams += ing.grams * servingsFactor;
        item.totalKcal += ing.kcalTotal * servingsFactor;
      }
    }

    const items = Array.from(map.values())
      .sort((a, b) => b.totalKcal - a.totalKcal)
      .slice(0, limit);

    return { items };
  }

  async getScoreCorrelationByMetric(
    query: GetNutrientsScoreQueryDto,
    userId: number,
  ): Promise<GetNutrientsScoreDto> {
    const { from, to, metric } = query;

    const where: Prisma.MealLogWhereInput = {
      userProfileId: userId,
      ...(from || to
        ? {
            eatenAt: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }
        : {}),
    };

    const mealLogs = await this.db.mealLog.findMany({
      where,
      include: { recipe: true },
    });

    const score: GetNutrientsScoreDto = {
      metric,
      totalConsumed: 0,
      correlation: { mood: null, energy: null, sleep: null },
      details: [],
    };

    for (const log of mealLogs) {
      const r = log.recipe;
      const s = log.servings;

      const perServ = getPerServ(r, metric);
      const value = perServ * s;

      score.totalConsumed += value;

      score.details.push({
        date: log.eatenAt.toISOString().slice(0, 10),
        metricValue: value,
        mood: log.moodScore ?? null,
        energy: log.energyScore ?? null,
        sleep: log.sleepScore ?? null,
      });
    }

    score.correlation.mood = calcInfluence(
      score.details as DetailRow[],
      'mood',
    );
    score.correlation.energy = calcInfluence(
      score.details as DetailRow[],
      'energy',
    );
    score.correlation.sleep = calcInfluence(
      score.details as DetailRow[],
      'sleep',
    );

    return score;
  }
}
