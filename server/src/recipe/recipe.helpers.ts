import { Prisma } from "generated/prisma";
import { RecipeListQueryDto } from "./dto";

export type MacroSum = {
  kcal: number;
  prot: number;
  fat: number;
  carb: number;
  sugar: number;
};

export type RowTotals = {
  kcalTotal: number;
  protTotal: number;
  fatTotal: number;
  carbTotal: number;
  sugarTotal: number;
};

export function round(x: number, d = 2) {
  const p = 10 ** d;
  return Math.round((x + Number.EPSILON) * p) / p;
}

export function sumRows(rows: RowTotals[]): MacroSum {
  return rows.reduce<MacroSum>(
    (a, r) => ({
      kcal: a.kcal + r.kcalTotal,
      prot: a.prot + r.protTotal,
      fat: a.fat + r.fatTotal,
      carb: a.carb + r.carbTotal,
      sugar: a.sugar + r.sugarTotal,
    }),
    { kcal: 0, prot: 0, fat: 0, carb: 0, sugar: 0 },
  );
}

export function perServing(sum: MacroSum, servings: number) {
  return {
    kcalPerServ: round(sum.kcal / servings),
    protPerServ: round(sum.prot / servings),
    fatPerServ: round(sum.fat / servings),
    carbPerServ: round(sum.carb / servings),
    sugarPerServ: round(sum.sugar / servings),
  };
}

export function toStringArray(v: unknown): string[] {
  if (v == null) return [];
  if (Array.isArray(v)) return v.map(String);
  const s = String(v).trim();
  if (!s) return [];
  if (s.startsWith('[')) {
    try {
      return (JSON.parse(s) as unknown[]).map(String);
    } catch {
      return [];
    }
  }
  return s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

export function buildRecipeWhere(
  query: RecipeListQueryDto,
): Prisma.RecipeWhereInput {
  const and: Prisma.RecipeWhereInput[] = [];

  if (query.q) {
    and.push({
      OR: [
        { title: { contains: query.q, mode: 'insensitive' } },
        {
          ingredients: {
            some: { name: { contains: query.q, mode: 'insensitive' } },
          },
        },
      ],
    });
  }

  const f = query.filters;
  if (f) {
    const include = toStringArray(f.includeIngredients);
    const exclude = toStringArray(f.excludeIngredients);

    if (include.length) {
      and.push({
        AND: include.map<Prisma.RecipeWhereInput>((name) => ({
          ingredients: {
            some: { name: { contains: name, mode: 'insensitive' } },
          },
        })),
      });
    }

    if (exclude.length) {
      and.push({
        AND: exclude.map<Prisma.RecipeWhereInput>((name) => ({
          NOT: {
            ingredients: {
              some: { name: { contains: name, mode: 'insensitive' } },
            },
          },
        })),
      });
    }

    if (f.minKcal !== undefined || f.maxKcal !== undefined) {
      const r: Prisma.FloatFilter = {};
      if (f.minKcal !== undefined) r.gte = f.minKcal;
      if (f.maxKcal !== undefined) r.lte = f.maxKcal;
      and.push({ kcalPerServ: r });
    }
    if (f.minSugar !== undefined || f.maxSugar !== undefined) {
      const r: Prisma.FloatFilter = {};
      if (f.minSugar !== undefined) r.gte = f.minSugar;
      if (f.maxSugar !== undefined) r.lte = f.maxSugar;
      and.push({ sugarPerServ: r });
    }
    if (f.minProt !== undefined || f.maxProt !== undefined) {
      const r: Prisma.FloatFilter = {};
      if (f.minProt !== undefined) r.gte = f.minProt;
      if (f.maxProt !== undefined) r.lte = f.maxProt;
      and.push({ protPerServ: r });
    }
  }

  return and.length ? { AND: and } : {};
}
