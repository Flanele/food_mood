import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import {
  AddIngredientDto,
  AddRecipeDto,
  PatchRecipeDto,
  RecipeListDto,
  RecipeListQueryDto,
} from './dto';
import { IngredientService } from './ingredients/ingredient.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class RecipeService {
  constructor(
    private db: DbService,
    private ingredientsService: IngredientService,
  ) {}

  async getAll(query: RecipeListQueryDto): Promise<RecipeListDto> {
    const page = Math.max(1, +(query.page ?? 1));
    const limit = Math.min(100, Math.max(1, +(query.limit ?? 20)));
    const skip = (page - 1) * limit;

    const where = query.q
      ? {
          OR: [
            { title: { contains: query.q, mode: 'insensitive' as const } },
            {
              ingredients: {
                some: {
                  name: { contains: query.q, mode: 'insensitive' as const },
                },
              },
            },
          ],
        }
      : {};

    const [recipes, total] = await Promise.all([
      this.db.recipe.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { ingredients: true },
      }),
      this.db.recipe.count({ where }),
    ]);

    return {
      recipes,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getOneById(id: number) {
    const recipe = await this.db.recipe.findUnique({ where: { id } });
    if (!recipe) throw new BadRequestException({ type: 'recipe-not-found' });
    return recipe;
  }

  private round(x: number, d = 2) {
    const p = 10 ** d;
    return Math.round((x + Number.EPSILON) * p) / p;
  }

  private sum(
    rows: Array<{
      kcalTotal: number;
      protTotal: number;
      fatTotal: number;
      carbTotal: number;
      sugarTotal: number;
    }>,
  ) {
    return rows.reduce(
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

  private perServing(
    sum: {
      kcal: number;
      prot: number;
      fat: number;
      carb: number;
      sugar: number;
    },
    servings: number,
  ) {
    return {
      kcalPerServ: this.round(sum.kcal / servings),
      protPerServ: this.round(sum.prot / servings),
      fatPerServ: this.round(sum.fat / servings),
      carbPerServ: this.round(sum.carb / servings),
      sugarPerServ: this.round(sum.sugar / servings),
    };
  }

  async addRecipe(dto: AddRecipeDto, userId: number) {
    if (!dto.ingredients?.length) {
      throw new BadRequestException('ingredients are required');
    }

    const rows = await Promise.all(
      dto.ingredients.map((i) => this.ingredientsService.buildIngredientRow(i)),
    );

    const sum = this.sum(rows);
    const perServ = this.perServing(sum, dto.servings);

    return this.db.$transaction((tx) =>
      tx.recipe.create({
        data: {
          authorProfileId: userId ?? null,
          title: dto.title,
          steps: dto.steps as Prisma.InputJsonValue,
          picture_url: dto.picture_url,
          servings: dto.servings,
          ...perServ,
          ingredients: { create: rows },
        },
        include: { ingredients: true },
      }),
    );
  }

  async patchRecipe(id: number, dto: PatchRecipeDto) {
    const existing = await this.db.recipe.findUnique({ where: { id } });
    if (!existing) throw new BadRequestException({ type: 'recipe-not-found' });

    return this.db.$transaction(async (tx) => {

      const data: Prisma.RecipeUpdateInput = {};

      if (dto.title !== undefined) data.title = dto.title;
      if (dto.steps !== undefined)
        data.steps = dto.steps as Prisma.InputJsonValue;
      if (dto.picture_url !== undefined) data.picture_url = dto.picture_url;
      if (dto.servings !== undefined) data.servings = dto.servings;

      // если пришли ингредиенты — пересобираем строки и пересчитываем per-serv
      if (dto.ingredients) {
        const rows = await Promise.all(
          dto.ingredients.map((ingredient) =>
            this.ingredientsService.buildIngredientRow(ingredient),
          ),
        );

        await tx.recipeIngredient.deleteMany({ where: { recipeId: id } });
        await tx.recipeIngredient.createMany({
          data: rows.map((r) => ({ ...r, recipeId: id })),
        });

        const sum = this.sum(rows);

        const servings = dto.servings ?? existing.servings;
        Object.assign(data, this.perServing(sum, servings));
      }

      // если ингредиенты не пришли, но поменяли servings — пересчитать per-serv по текущим строкам
      else if (dto.servings !== undefined) {
        const aggr = await tx.recipeIngredient.aggregate({
          where: { recipeId: id },
          _sum: {
            kcalTotal: true,
            protTotal: true,
            fatTotal: true,
            carbTotal: true,
            sugarTotal: true,
          },
        });

        const sum = {
          kcal: aggr._sum.kcalTotal ?? 0,
          prot: aggr._sum.protTotal ?? 0,
          fat: aggr._sum.fatTotal ?? 0,
          carb: aggr._sum.carbTotal ?? 0,
          sugar: aggr._sum.sugarTotal ?? 0,
        };

        Object.assign(data, this.perServing(sum, dto.servings));
      }

      return tx.recipe.update({
        where: { id },
        data,
        include: { ingredients: true },
      });
    });
  }
}
