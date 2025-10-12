import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  GetAnalyticsByTimeDto,
  GetAnalyticsByTimeQueryDto,
  GetNutrientsScoreDto,
  GetNutrientsScoreQueryDto,
  GetTopIngredientsDto,
  GetTopIngredientsQueryDto,
} from './dto';
import { GetSessionInfoDto } from 'src/auth/dto';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let service: {
    getAnalyticsByTime: jest.Mock;
    getTopIngredients: jest.Mock;
    getScoreCorrelationByMetric: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      getAnalyticsByTime: jest.fn(),
      getTopIngredients: jest.fn(),
      getScoreCorrelationByMetric: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [{ provide: AnalyticsService, useValue: service }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(AnalyticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getAnalyticsByTime calls service with query + session.id', async () => {
    const query: GetAnalyticsByTimeQueryDto = {
      from: new Date('2025-01-01T00:00:00Z'),
      to: new Date('2025-01-31T23:59:59Z'),
    };
    const session: GetSessionInfoDto = {
      id: 7,
      email: 'a@a.com',
      iat: 1,
      exp: 2,
    };

    const dto: GetAnalyticsByTimeDto = {
      total: { kcal: 1200, prot: 80, fat: 60, carb: 100, sugar: 30 },
      series: [
        {
          key: '2025-01-01',
          kcal: 400,
          prot: 25,
          fat: 20,
          carb: 35,
          sugar: 10,
        },
        {
          key: '2025-01-02',
          kcal: 800,
          prot: 55,
          fat: 40,
          carb: 65,
          sugar: 20,
        },
      ],
    };
    service.getAnalyticsByTime.mockResolvedValue(dto);

    const res = await controller.getAnalyticsByTime(query, session);

    expect(service.getAnalyticsByTime).toHaveBeenCalledWith(query, 7);
    expect(res).toBe(dto);
  });

  it('getTopIngredients calls service with query + session.id', async () => {
    const query: GetTopIngredientsQueryDto = { limit: 3 };
    const session: GetSessionInfoDto = {
      id: 9,
      email: 'b@b.com',
      iat: 1,
      exp: 2,
    };

    const dto: GetTopIngredientsDto = {
      items: [
        { name: 'egg', count: 5, totalGrams: 250, totalKcal: 390 },
        { name: 'milk', count: 3, totalGrams: 600, totalKcal: 300 },
      ],
    };
    service.getTopIngredients.mockResolvedValue(dto);

    const res = await controller.getTopIngredients(query, session);

    expect(service.getTopIngredients).toHaveBeenCalledWith(query, 9);
    expect(res).toBe(dto);
  });

  it('getScoreCorrelationByMetric calls service with query + session.id', async () => {
    const query: GetNutrientsScoreQueryDto = { metric: 'kcal' };
    const session: GetSessionInfoDto = {
      id: 12,
      email: 'c@c.com',
      iat: 1,
      exp: 2,
    };

    const dto: GetNutrientsScoreDto = {
      metric: 'kcal',
      totalConsumed: 1234,
      correlation: { mood: -0.1, energy: 0.2, sleep: 0.05 },
      details: [
        { date: '2025-01-01', metricValue: 400, mood: 5, energy: 4, sleep: 4 },
        { date: '2025-01-02', metricValue: 300, mood: 3, energy: 3, sleep: 5 },
      ],
    };
    service.getScoreCorrelationByMetric.mockResolvedValue(dto);

    const res = await controller.getScoreCorrelationByMetric(query, session);

    expect(service.getScoreCorrelationByMetric).toHaveBeenCalledWith(query, 12);
    expect(res).toBe(dto);
  });
});
