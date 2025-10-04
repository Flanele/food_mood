import { Prisma } from 'generated/prisma';
import { DetailRow } from './analitycs.types';
import { Metric } from './dto';

export function calcInfluence(
  rows: ReadonlyArray<DetailRow>,
  key: 'mood' | 'energy' | 'sleep',
): number | null {
  const highs = rows.filter(
    (r) => typeof r[key] === 'number' && (r[key] as number) >= 7,
  );

  const lows = rows.filter(
    (r) => typeof r[key] === 'number' && (r[key] as number) <= 4,
  );

  if (highs.length === 0 || lows.length === 0) return null;

  const avg = (values: number[]) =>
    values.reduce((a, b) => a + b, 0) / values.length;

  const avgHigh = avg(highs.map((r) => r.metricValue));
  const avgLow = avg(lows.map((r) => r.metricValue));

  // больше нутриента при низких оценках => негативный эффект (минус)
  const denom = avgHigh || 1; // защита от деления на 0
  const raw = (avgLow - avgHigh) / denom;

  // ограничим до -1..1 для наглядности
  return Number(Math.max(-1, Math.min(1, raw)).toFixed(2));
}

export function getPerServ(
  r: Prisma.RecipeGetPayload<{}>,
  metric: Metric,
): number {
  switch (metric) {
    case 'kcal':
      return r.kcalPerServ ?? 0;
    case 'prot':
      return r.protPerServ ?? 0;
    case 'fat':
      return r.fatPerServ ?? 0;
    case 'carb':
      return r.carbPerServ ?? 0;
    case 'sugar':
      return r.sugarPerServ ?? 0;
  }
}
