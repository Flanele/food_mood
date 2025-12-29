export type Resolution = 'hour' | 'weekday' | 'day' | 'week' | 'month';

export const MS_DAY = 86_400_000;

export type Totals = {
  kcal: number;
  prot: number;
  fat: number;
  carb: number;
  sugar: number;
};

export const EMPTY_TOTALS: Totals = {
  kcal: 0,
  prot: 0,
  fat: 0,
  carb: 0,
  sugar: 0,
};

export type SeriesPoint = Totals & { key: string };
