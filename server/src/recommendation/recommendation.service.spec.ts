import { Test } from '@nestjs/testing';
import { RecommendationService } from './recommendation.service';
import { UserProfileService } from 'src/users/user-profile.service';
import { RecipeService } from 'src/recipe/recipe.service';
import { MealLogService } from 'src/meal-log/meal-log.service';

describe('RecommendationService', () => {
  let service: RecommendationService;

  const profileService = {
    getProfile: jest.fn(),
    returnAllProfiles: jest.fn(),
  };
  const recipeService = {
    getAllNoLimit: jest.fn(),
    getOneById: jest.fn(),
  };
  const mealLogService = {
    findMany: jest.fn(),
    findManyWithSelect: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        RecommendationService,
        { provide: UserProfileService, useValue: profileService },
        { provide: RecipeService, useValue: recipeService },
        { provide: MealLogService, useValue: mealLogService },
      ],
    }).compile();

    service = moduleRef.get(RecommendationService);
  });

  it('getForYou(balanced): returns items mapped correctly and limited', async () => {
    profileService.getProfile.mockResolvedValue({
      id: 1,
      prefs: null,
    });

    const recipes = [
      {
        id: 10,
        title: 'A',
        picture_url: 'u/a.jpg',
        kcalPerServ: 100,
        ingredients: [{ name: 'egg' }, { name: 'milk' }],
      },
      {
        id: 11,
        title: 'B',
        picture_url: 'u/b.jpg',
        kcalPerServ: 200,
        ingredients: [{ name: 'oats' }],
      },
      {
        id: 12,
        title: 'C',
        picture_url: 'u/c.jpg',
        kcalPerServ: 300,
        ingredients: [{ name: 'banana' }],
      },
    ];
    recipeService.getAllNoLimit.mockResolvedValue(recipes);

    const res = await service.getForYou({ objective: 'balanced', limit: 2 }, 7);

    expect(profileService.getProfile).toHaveBeenCalledWith(7);
    expect(recipeService.getAllNoLimit).toHaveBeenCalledWith();
    expect(res.items).toHaveLength(2);
    expect(res.items[0]).toEqual({
      recipeId: 10,
      title: 'A',
      picture_url: 'u/a.jpg',
      score: 0.5,
      ingredients: ['egg', 'milk'],
    });
    expect(res.items[1].recipeId).toBe(11);
  });

  it('getPeers: returns empty items array when no similar profiles found', async () => {
    profileService.getProfile.mockResolvedValue({
      id: 1,
      userId: 1,
      birthDate: null,
      sex: null,
      bmi: null,
    });

    profileService.returnAllProfiles.mockResolvedValue([]);
    const res = await service.getPeers({ objective: 'balanced', limit: 5 }, 1);

    expect(profileService.getProfile).toHaveBeenCalledWith(1);
    expect(profileService.returnAllProfiles).toHaveBeenCalled();
    expect(res).toEqual({ items: [] });
  });

  it('getSimilar: excludes the base recipe and respects limit', async () => {
    const base = {
      id: 100,
      title: 'Base',
      picture_url: 'u/base.jpg',
      kcalPerServ: 500,
      ingredients: [{ name: 'pasta' }, { name: 'garlic' }],
    };
    recipeService.getOneById.mockResolvedValue(base);

    recipeService.getAllNoLimit.mockResolvedValue([
      base,
      {
        id: 101,
        title: 'R1',
        picture_url: 'u/1.jpg',
        kcalPerServ: 400,
        ingredients: [{ name: 'pasta' }],
      },
      {
        id: 102,
        title: 'R2',
        picture_url: 'u/2.jpg',
        kcalPerServ: 300,
        ingredients: [{ name: 'tomato' }],
      },
      {
        id: 103,
        title: 'R3',
        picture_url: 'u/3.jpg',
        kcalPerServ: 200,
        ingredients: [{ name: 'garlic' }],
      },
    ]);

    const res = await service.getSimilar(100, { limit: 2 });

    expect(recipeService.getOneById).toHaveBeenCalledWith(100);
    expect(recipeService.getAllNoLimit).toHaveBeenCalledWith();
    expect(res.items).toHaveLength(2);

    expect(res.items.find((x) => x.recipeId === 100)).toBeUndefined();

    expect(res.items[0]).toHaveProperty('title');
    expect(res.items[0]).toHaveProperty('score');
    expect(Array.isArray(res.items[0].ingredients)).toBe(true);
  });
});
