import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import {
  AddRecipeDto,
  PatchRecipeDto,
  RecipeListDto,
  RecipeListQueryDto,
  StepsPayloadDto,
} from './dto';
import { IngredientService } from '../ingredient/ingredient.service';
import { Prisma, Recipe } from 'generated/prisma';
import { buildRecipeWhere, perServing, sumRows } from './recipe.helpers';
import { UserProfileService } from 'src/users/user-profile.service';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class RecipeService {
  constructor(
    private db: DbService,
    private ingredientsService: IngredientService,
    private userProfileService: UserProfileService,
    private filesService: FilesService,
  ) {}

  async getAll(query: RecipeListQueryDto): Promise<RecipeListDto> {
    const page = Math.max(1, +(query.page ?? 1));
    const limit = Math.min(100, Math.max(1, +(query.limit ?? 20)));
    const skip = (page - 1) * limit;

    const where = buildRecipeWhere(query);

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
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  async getAllNoLimit(where: Prisma.RecipeWhereInput = {}) {
    return this.db.recipe.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { ingredients: true },
    });
  }

  async getMy(userId: number) {
    const recipes = await this.db.recipe.findMany({
      where: { authorProfileId: userId },
      orderBy: { createdAt: 'desc' },
      include: { ingredients: true },
    });

    return { recipes };
  }

  async getOneById(id: number) {
    const recipe = await this.db.recipe.findUnique({
      where: { id },
      include: { ingredients: true },
    });
    if (!recipe) throw new BadRequestException({ type: 'recipe-not-found' });
    return recipe;
  }

  async addRecipe(dto: AddRecipeDto, userId: number) {
    if (!dto.ingredients?.length) {
      throw new BadRequestException('ingredients are required');
    }

    const userProfile = await this.userProfileService.getProfile(userId);

    if (!dto.picture_url) {
      throw new BadRequestException('picture_url is required');
    }
    const pictureUrl = dto.picture_url;

    const rows = await Promise.all(
      dto.ingredients.map((i) => this.ingredientsService.buildIngredientRow(i)),
    );

    const macros = perServing(sumRows(rows), dto.servings);

    return this.db.$transaction((tx) =>
      tx.recipe.create({
        data: {
          authorProfileId: userProfile.id ?? null,
          title: dto.title,
          steps: dto.steps as unknown as Prisma.InputJsonValue,
          picture_url: pictureUrl,
          servings: dto.servings,
          ...macros,
          ingredients: { create: rows },
        },
        include: { ingredients: true },
      }),
    );
  }

  async patchRecipe(id: number, dto: PatchRecipeDto, userId: number) {
    const existing = await this.db.recipe.findUnique({
      where: { id },
    });
    if (!existing) throw new BadRequestException({ type: 'recipe-not-found' });

    const userProfile = await this.userProfileService.getProfile(userId);

    if (existing.authorProfileId !== userProfile.id) {
      throw new BadRequestException({ type: 'access-denied' });
    }

    const urlsToDelete = this.collectImagesToDelete(existing, dto);

    const updated = await this.db.$transaction((tx) =>
      this.applyRecipePatch(tx, existing, dto),
    );

    if (urlsToDelete.length > 0) {
      await this.filesService.deleteFromSupabase(urlsToDelete);
    }

    return updated;
  }

  private collectImagesToDelete(
    existing: Recipe,
    dto: PatchRecipeDto,
  ): string[] {
    const urlsToDelete: string[] = [];

    const oldPictureUrl = existing.picture_url;
    const oldSteps = existing.steps as unknown as StepsPayloadDto | undefined;
    const newSteps = dto.steps as unknown as StepsPayloadDto | undefined;

    if (dto.picture_url && oldPictureUrl && dto.picture_url !== oldPictureUrl) {
      urlsToDelete.push(oldPictureUrl);
    }

    if (newSteps?.steps?.length && oldSteps?.steps?.length) {
      newSteps.steps.forEach((newStep, index) => {
        const prevStep = oldSteps.steps[index];

        if (
          newStep?.imageUrl && // есть новый урл
          prevStep?.imageUrl && // был старый урл
          newStep.imageUrl !== prevStep.imageUrl // сменился
        ) {
          urlsToDelete.push(prevStep.imageUrl);
        }
      });
    }

    return urlsToDelete;
  }

  private async applyRecipePatch(
    tx: Prisma.TransactionClient,
    existing: Recipe,
    dto: PatchRecipeDto,
  ) {
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

      await tx.recipeIngredient.deleteMany({
        where: { recipeId: existing.id },
      });
      await tx.recipeIngredient.createMany({
        data: rows.map((r) => ({ ...r, recipeId: existing.id })),
      });

      const servings = dto.servings ?? existing.servings;
      Object.assign(data, perServing(sumRows(rows), servings));
    }

    // если ингредиенты не пришли, но поменяли servings — пересчитать per-serv по текущим строкам
    else if (dto.servings !== undefined) {
      const aggr = await tx.recipeIngredient.aggregate({
        where: { recipeId: existing.id },
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

      Object.assign(data, perServing(sum, dto.servings));
    }

    return tx.recipe.update({
      where: { id: existing.id },
      data,
      include: { ingredients: true },
    });
  }
}
