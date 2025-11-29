import { Test } from '@nestjs/testing';
import { RecipeService } from './recipe.service';
import { DbService } from 'src/db/db.service';
import { BadRequestException } from '@nestjs/common';
import { IngredientService } from '../ingredient/ingredient.service';
import { AddRecipeDto, PatchRecipeDto, RecipeListQueryDto } from './dto';
import { UserProfileService } from 'src/users/user-profile.service';
import { FilesService } from 'src/files/files.service';

type MockDb = {
  recipe: {
    findMany: jest.Mock;
    count: jest.Mock;
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
  recipeIngredient: {
    deleteMany: jest.Mock;
    createMany: jest.Mock;
    aggregate: jest.Mock;
  };
  $transaction: jest.Mock;
};

type MockIngredients = {
  buildIngredientRow: jest.Mock;
};

type MockUserProfile = {
  getProfile: jest.Mock;
};

type MockFiles = {
  deleteFromSupabase: jest.Mock;
};

describe('RecipeService', () => {
  let service: RecipeService;
  let db: MockDb;
  let ingredients: MockIngredients;
  let userProfile: MockUserProfile;
  let files: MockFiles;

  beforeEach(async () => {
    db = {
      recipe: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      recipeIngredient: {
        deleteMany: jest.fn(),
        createMany: jest.fn(),
        aggregate: jest.fn(),
      },
      $transaction: jest.fn(async (cb) => cb(db)),
    };

    ingredients = {
      buildIngredientRow: jest.fn(),
    };

    userProfile = {
      getProfile: jest.fn().mockResolvedValue({ id: 1 }),
    };

    files = {
      deleteFromSupabase: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        RecipeService,
        { provide: DbService, useValue: db },
        { provide: IngredientService, useValue: ingredients },
        { provide: UserProfileService, useValue: userProfile },
        { provide: FilesService, useValue: files },
      ],
    }).compile();

    service = moduleRef.get(RecipeService);
  });

  it('getAll returns recipes and meta', async () => {
    db.recipe.findMany.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
    db.recipe.count.mockResolvedValueOnce(7);

    const res = await service.getAll({ q: 'egg', page: 2, limit: 2 });

    expect(res.recipes).toEqual([{ id: 1 }, { id: 2 }]);
    expect(res.meta).toEqual({ total: 7, page: 2, limit: 2, pages: 4 });

    expect(db.recipe.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.any(Object),
        skip: 2,
        take: 2,
        orderBy: { createdAt: 'desc' },
        include: { ingredients: true },
      }),
    );
    expect(db.recipe.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.any(Object),
      }),
    );
  });

  it('getAll filters by includeIngredients (arrays from client)', async () => {
    db.recipe.findMany.mockResolvedValueOnce([{ id: 11 }]);
    db.recipe.count.mockResolvedValueOnce(1);

    const res = await service.getAll({
      page: 1,
      limit: 20,
      filters: { includeIngredients: ['oats', 'milk'] },
    } as RecipeListQueryDto);

    expect(res.recipes).toEqual([{ id: 11 }]);
    expect(db.recipe.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([
            expect.objectContaining({
              AND: [
                {
                  ingredients: {
                    some: { name: { contains: 'oats', mode: 'insensitive' } },
                  },
                },
                {
                  ingredients: {
                    some: { name: { contains: 'milk', mode: 'insensitive' } },
                  },
                },
              ],
            }),
          ]),
        }),
      }),
    );
  });

  it('getOneById returns recipe if found', async () => {
    db.recipe.findUnique.mockResolvedValueOnce({ id: 42 });

    const res = await service.getOneById(42);

    expect(res).toEqual({ id: 42 });
    expect(db.recipe.findUnique).toHaveBeenCalledWith({
      where: { id: 42 },
      include: { ingredients: true },
    });
  });

  it('getOneById throws BadRequestException if not found', async () => {
    db.recipe.findUnique.mockResolvedValueOnce(null);

    await expect(service.getOneById(99)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('addRecipe throws if no ingredients provided', async () => {
    const dto: AddRecipeDto = {
      title: 'x',
      steps: { steps: [] },
      picture_url: 'u',
      servings: 2,
      ingredients: [],
    };

    await expect(service.addRecipe(dto, 1)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('addRecipe builds rows, computes per-servings and creates recipe', async () => {
    const rows = [
      {
        name: 'egg',
        amount: 2,
        unit: 'pcs',
        grams: 120,
        kcalTotal: 300,
        protTotal: 20,
        fatTotal: 22,
        carbTotal: 2,
        sugarTotal: 1,
      },
      {
        name: 'milk',
        amount: 100,
        unit: 'ml',
        grams: 100,
        kcalTotal: 100,
        protTotal: 7,
        fatTotal: 5,
        carbTotal: 8,
        sugarTotal: 8,
      },
    ];

    ingredients.buildIngredientRow
      .mockResolvedValueOnce(rows[0])
      .mockResolvedValueOnce(rows[1]);

    db.recipe.create.mockResolvedValueOnce({ id: 10, ingredients: rows });

    const dto: AddRecipeDto = {
      title: 'Scrambled',
      steps: { steps: [] },
      picture_url: 'https://x',
      servings: 2,
      ingredients: [
        { name: 'egg', amount: 2, unit: 'pcs' },
        { name: 'milk', amount: 100, unit: 'ml' },
      ],
    };

    const res = await service.addRecipe(dto, 1);

    expect(res).toEqual({ id: 10, ingredients: rows });

    expect(db.recipe.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: 'Scrambled',
          authorProfileId: 1,
          kcalPerServ: 200, // (300+100)/2
        }),
      }),
    );
  });

  it('patchRecipe with ingredients rebuilds rows and recomputes per-serv', async () => {
    db.recipe.findUnique.mockResolvedValueOnce({
      id: 7,
      servings: 4,
      authorProfileId: 1,
      picture_url: 'picture_2133123',
      steps: [],
    });

    const rows = [
      {
        name: 'oats',
        amount: 60,
        unit: 'g',
        grams: 60,
        kcalTotal: 230,
        protTotal: 8,
        fatTotal: 4,
        carbTotal: 40,
        sugarTotal: 1,
      },
      {
        name: 'milk',
        amount: 200,
        unit: 'ml',
        grams: 200,
        kcalTotal: 120,
        protTotal: 8,
        fatTotal: 6,
        carbTotal: 10,
        sugarTotal: 10,
      },
    ];

    ingredients.buildIngredientRow
      .mockResolvedValueOnce(rows[0])
      .mockResolvedValueOnce(rows[1]);

    db.recipe.update.mockResolvedValueOnce({
      id: 7,
      ingredients: rows,
      authorProfileId: 1,
    });

    const dto: PatchRecipeDto = {
      title: 'Porridge',
      servings: 2,
      ingredients: [
        { name: 'oats', amount: 60, unit: 'g' },
        { name: 'milk', amount: 200, unit: 'ml' },
      ],
    };

    const res = await service.patchRecipe(7, dto, 1);

    expect(userProfile.getProfile).toHaveBeenCalledWith(1);
    expect(db.$transaction).toHaveBeenCalledTimes(1);

    expect(res).toMatchObject({ id: 7, ingredients: rows });
    expect(ingredients.buildIngredientRow).toHaveBeenCalledTimes(2);
    expect(db.recipeIngredient.deleteMany).toHaveBeenCalledWith({
      where: { recipeId: 7 },
    });
    expect(db.recipeIngredient.createMany).toHaveBeenCalledWith({
      data: [
        { ...rows[0], recipeId: 7 },
        { ...rows[1], recipeId: 7 },
      ],
    });
    expect(db.recipe.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 7 },
        data: expect.objectContaining({
          title: 'Porridge',
          servings: 2,
          kcalPerServ: 175, // (230+120)/2
        }),
      }),
    );

    expect(files.deleteFromSupabase).not.toHaveBeenCalled();
  });

  it('patchRecipe with only servings recomputes per-serv from aggregate', async () => {
    db.recipe.findUnique.mockResolvedValueOnce({
      id: 5,
      servings: 4,
      authorProfileId: 1,
      picture_url: '',
      steps: [],
    });

    db.recipeIngredient.aggregate.mockResolvedValueOnce({
      _sum: {
        kcalTotal: 600,
        protTotal: 30,
        fatTotal: 20,
        carbTotal: 50,
        sugarTotal: 10,
      },
    });

    db.recipe.update.mockResolvedValueOnce({ id: 5, ingredients: [] });

    const dto: PatchRecipeDto = { servings: 3 };
    const res = await service.patchRecipe(5, dto, 1);

    expect(userProfile.getProfile).toHaveBeenCalledWith(1);
    expect(db.$transaction).toHaveBeenCalledTimes(1);
    expect(res).toEqual({ id: 5, ingredients: [] });
    expect(db.recipeIngredient.aggregate).toHaveBeenCalledWith({
      where: { recipeId: 5 },
      _sum: {
        kcalTotal: true,
        protTotal: true,
        fatTotal: true,
        carbTotal: true,
        sugarTotal: true,
      },
    });
    expect(db.recipe.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 5 },
        data: expect.objectContaining({
          servings: 3,
          kcalPerServ: 200, // 600/3
        }),
      }),
    );

    expect(files.deleteFromSupabase).not.toHaveBeenCalled();
  });
});
