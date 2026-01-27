import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { DbService } from 'src/db/db.service';
import { GetNutrientsScoreQueryDto } from './dto';

const dbMock = {
  mealLog: {
    findMany: jest.fn(),
  },
};

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyticsService, { provide: DbService, useValue: dbMock }],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    jest.clearAllMocks();
  });

  describe('getAnalyticsByTime', () => {
    it('should calculate total macros correctly', async () => {
      dbMock.mealLog.findMany.mockResolvedValue([
        {
          servings: 2,
          eatenAt: new Date('2025-09-29T08:15:00.000Z'),
          recipe: {
            kcalPerServ: 100,
            protPerServ: 10,
            fatPerServ: 5,
            carbPerServ: 20,
            sugarPerServ: 3,
          },
        },
      ]);

      const res = await service.getAnalyticsByTime({}, 1);

      expect(dbMock.mealLog.findMany).toHaveBeenCalledWith({
        where: {
          userProfileId: 1,
          eatenAt: {
            gte: expect.any(Date),
            lte: expect.any(Date),
          },
        },
        include: { recipe: true },
        orderBy: { eatenAt: 'asc' },
      });

      expect(res.total).toEqual({
        kcal: 200,
        prot: 20,
        fat: 10,
        carb: 40,
        sugar: 6,
      });
    });
  });

  describe('getTopIngredients', () => {
    it('should aggregate ingredients correctly', async () => {
      dbMock.mealLog.findMany.mockResolvedValue([
        {
          userProfileId: 1,
          recipe: {
            servings: 2,
            ingredients: [
              { name: 'Sugar', grams: 100, kcalTotal: 400 },
              { name: 'Milk', grams: 200, kcalTotal: 100 },
            ],
          },
          servings: 1,
        },
      ]);

      const res = await service.getTopIngredients({}, 1);
      expect(res.items.length).toBe(2);
      expect(res.items[0].name).toBe('Sugar');
      expect(res.items[0].totalKcal).toBeGreaterThan(0);
    });
  });

  describe('getScoreCorrelationByMetric', () => {
    it('should compute totalConsumed and correlation', async () => {
      dbMock.mealLog.findMany.mockResolvedValue([
        {
          eatenAt: new Date('2025-09-01'),
          servings: 2,
          moodScore: 8,
          energyScore: 5,
          sleepScore: 3,
          recipe: {
            kcalPerServ: 200,
            protPerServ: 10,
            fatPerServ: 5,
            carbPerServ: 20,
            sugarPerServ: 8,
          },
        },
      ]);

      const query: GetNutrientsScoreQueryDto = { metric: 'kcal' };
      const result = await service.getScoreCorrelationByMetric(query, 1);

      expect(result.metric).toBe('kcal');
      expect(result.totalConsumed).toBe(400);
      expect(result.details.length).toBe(1);
      expect(result.correlation).toHaveProperty('mood');
    });
  });
});
