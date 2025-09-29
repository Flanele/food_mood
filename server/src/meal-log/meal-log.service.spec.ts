import { Test, TestingModule } from '@nestjs/testing';
import { MealLogService } from './meal-log.service';
import { AddMealLogDto, PatchMealLogDto } from './dto';
import { BadRequestException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { MealLog } from 'generated/prisma';

type MockDb = {
  recipe: {
    findFirst: jest.Mock;
  };
  mealLog: {
    findUnique: jest.Mock;
    findFirst: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
};

describe('MealLogService', () => {
  let service: MealLogService;
  let db: MockDb;

  beforeEach(async () => {
    db = {
      recipe: {
        findFirst: jest.fn(),
      },
      mealLog: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [MealLogService, { provide: DbService, useValue: db }],
    }).compile();

    service = module.get<MealLogService>(MealLogService);
  });

  it('post meal log', async () => {
    db.recipe.findFirst.mockResolvedValueOnce({ id: 1 });

    db.mealLog.create.mockResolvedValueOnce({
      id: 10,
      userProfileId: 1,
      recipeId: 2,
      servings: 2,
      eatenAt: new Date('2025-09-29T08:15:00.000Z'),
      moodScore: 5,
      energyScore: 6,
      sleepScore: 7,
    });

    const dto = {
      recipeId: 1,
      servings: 2,
      eatenAt: new Date('2025-09-29T08:15:00.000Z'),
      moodScore: 5,
      energyScore: 6,
      sleepScore: 7,
    };

    const res = await service.addMealLog(dto as AddMealLogDto, 1);

    expect(db.recipe.findFirst).toHaveBeenCalledWith({ where: { id: 1 } });

    expect(db.mealLog.create).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userProfileId: 1,
          recipeId: 1,
          servings: 2,
        }),
      }),
    );
    expect(res.id).toBe(10);
  });

  it('addMealLog throws if recipe not found', async () => {
    db.recipe.findFirst.mockResolvedValueOnce(null);

    const dto = {
      recipeId: 999,
      servings: 1,
    };

    await expect(
      service.addMealLog(dto as AddMealLogDto, 1),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(db.mealLog.create).not.toHaveBeenCalled();
  });

  it('get meal log by id', async () => {
    db.mealLog.findUnique.mockResolvedValueOnce({ id: 6 });

    const res = await service.getOne(6, 1);

    expect(db.mealLog.findUnique).toHaveBeenCalledWith({
      where: { id: 6, userProfileId: 1 },
    });
    expect(res.id).toBe(6);
  });

  it('patch meal log', async () => {
    db.mealLog.findFirst.mockResolvedValueOnce({ id: 10 });

    db.mealLog.update.mockResolvedValueOnce({
      id: 10,
      userProfileId: 6,
      recipeId: 8,
      servings: 2,
      eatenAt: new Date('2025-09-29T08:15:00.000Z'),
      moodScore: 9,
      energyScore: 6,
      sleepScore: 7,
    });

    const dto = {
      servings: 2,
      moodScore: 9,
    };

    const res = await service.patchMealLog(10, dto as PatchMealLogDto, 6);

    expect(db.mealLog.findFirst).toHaveBeenCalledWith({
      where: { id: 10, userProfileId: 6 },
    });

    expect(db.mealLog.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          servings: 2,
          moodScore: 9,
        }),
      }),
    );

    expect(res.id).toBe(10);
  });

  it('patchMealLog returns existing log if nothing to update', async () => {
    const existing: Partial<MealLog> = { id: 10, userProfileId: 6 };
    db.mealLog.findFirst.mockResolvedValueOnce(existing);

    const res = await service.patchMealLog(10, {} as PatchMealLogDto, 6);

    expect(res).toBe(existing);
    expect(db.mealLog.update).not.toHaveBeenCalled();
  });

  it('patchMealLog throws if log not found', async () => {
    db.mealLog.findFirst.mockResolvedValueOnce(null);

    await expect(
      service.patchMealLog(10, { servings: 1 }, 6),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('deleteOne deletes when owner matches', async () => {
    const existing: Partial<MealLog> = { id: 10, userProfileId: 6 };
    db.mealLog.findFirst.mockResolvedValueOnce(existing);
    db.mealLog.delete.mockResolvedValueOnce(existing);

    const res = await service.deleteOne(10, 6);

    expect(db.mealLog.findFirst).toHaveBeenCalledWith({
      where: { id: 10, userProfileId: 6 },
    });
    expect(db.mealLog.delete).toHaveBeenCalledWith({ where: { id: 10 } });
    expect(res).toBe(existing);
  });

  it('deleteOne throws if not found', async () => {
    db.mealLog.findFirst.mockResolvedValueOnce(null);

    await expect(service.deleteOne(10, 6)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(db.mealLog.delete).not.toHaveBeenCalled();
  });
});
