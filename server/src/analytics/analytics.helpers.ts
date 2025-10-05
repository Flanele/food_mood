import { Prisma } from 'generated/prisma';
import { Metric } from './dto';

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
