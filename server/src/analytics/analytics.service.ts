import { Injectable } from '@nestjs/common';
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
import { calcInfluence, getPerServ } from './analytics.helpers';

@Injectable()
export class AnalyticsService {
  constructor(private db: DbService) {}

  async getAnalyticsByTime(
    query: GetAnalyticsByTimeQueryDto,
    userId: number,
  ): Promise<GetAnalyticsByTimeDto> {
    let { from, to, groupBy } = query;

    const now = new Date();

    if (!from && !to && groupBy) {
      to = now;
      from = new Date(now);

      if (groupBy === 'day') {
        from.setHours(0, 0, 0, 0);
      } else if (groupBy === 'week') {
        from.setDate(now.getDate() - 7);
        from.setHours(0, 0, 0, 0);
      } else if (groupBy === 'month') {
        from.setDate(now.getDate() - 30);
        from.setHours(0, 0, 0, 0);
      }
    }

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

    const total = { kcal: 0, prot: 0, fat: 0, carb: 0, sugar: 0 };

    for (const log of mealLogs) {
      const s = log.servings;
      const r = log.recipe;
      total.kcal += r.kcalPerServ * s;
      total.prot += r.protPerServ * s;
      total.fat += r.fatPerServ * s;
      total.carb += r.carbPerServ * s;
      total.sugar += r.sugarPerServ * s;
    }

    return { total };
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

    score.correlation.mood = calcInfluence(score.details, 'mood');
    score.correlation.energy = calcInfluence(score.details, 'energy');
    score.correlation.sleep = calcInfluence(score.details, 'sleep');

    return score;
  }
}
