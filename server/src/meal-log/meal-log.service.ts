import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { AddMealLogDto, PatchMealLogDto } from './dto';
import { Prisma } from 'generated/prisma';
import { UserProfileService } from 'src/users/user-profile.service';

@Injectable()
export class MealLogService {
  constructor(
    private db: DbService,
    private profileService: UserProfileService,
  ) {}

  async addMealLog(dto: AddMealLogDto, userId: number) {
    const recipe = await this.db.recipe.findFirst({
      where: { id: dto.recipeId },
    });

    if (!recipe) {
      throw new BadRequestException('recipe not found');
    }

    return await this.db.mealLog.create({
      data: {
        userProfileId: userId,
        recipeId: dto.recipeId,
        servings: dto.servings,
        eatenAt: dto.eatenAt ?? new Date(),
        moodScore: dto.moodScore,
        energyScore: dto.energyScore,
        sleepScore: dto.sleepScore,
      },
    });
  }

  async getAll(userId: number) {
    const profile = await this.profileService.getProfile(userId);

    const rows = await this.findManyWithSelect(
      { userProfileId: profile.id },
      { recipe: { select: { title: true } } },
    );

    const meallogs = rows.map(({ recipe, ...log }) => ({
      ...log,
      recipeTitle: recipe.title,
    }));

    return { meallogs };
  }

  async getOne(id: number, userId: number) {
    const log = await this.db.mealLog.findUnique({
      where: { id, userProfileId: userId },
      include: {
        recipe: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!log) {
      throw new BadRequestException(
        `mel-log with id ${id} for user ${userId} not found`,
      );
    }

    return {
      ...log,
      recipeTitle: log.recipe.title,
    };
  }

  async patchMealLog(id: number, dto: PatchMealLogDto, userId: number) {
    const log = await this.db.mealLog.findFirst({
      where: { id, userProfileId: userId },
    });

    if (!log) {
      throw new BadRequestException(
        `meal-log ${id} not found for user ${userId}`,
      );
    }

    const data: Prisma.MealLogUpdateInput = {};

    if (dto.servings !== undefined) data.servings = dto.servings;
    if (dto.eatenAt !== undefined) data.eatenAt = dto.eatenAt ?? new Date();
    if (dto.moodScore !== undefined) data.moodScore = dto.moodScore;
    if (dto.energyScore !== undefined) data.energyScore = dto.energyScore;
    if (dto.sleepScore !== undefined) data.sleepScore = dto.sleepScore;

    if (Object.keys(data).length === 0) return log;

    return this.db.mealLog.update({ where: { id }, data });
  }

  async deleteOne(id: number, userId: number) {
    const log = await this.db.mealLog.findFirst({
      where: { id, userProfileId: userId },
    });

    if (!log) {
      throw new BadRequestException(
        `meal-log ${id} not found for user ${userId}`,
      );
    }

    return this.db.mealLog.delete({ where: { id } });
  }

  async findMany(where: Prisma.MealLogWhereInput = {}) {
    return this.db.mealLog.findMany({
      where,
      include: {
        recipe: {
          include: {
            ingredients: true,
          },
        },
      },
    });
  }

  async findManyWithSelect(
    where: Prisma.MealLogWhereInput = {},
    include: Prisma.MealLogInclude = {},
  ) {
    return this.db.mealLog.findMany({
      where,
      include,
      orderBy: { createdAt: 'desc' },
    });
  }
}
