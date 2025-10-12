import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ExplainQueryDto,
  ExplainRecommendationDto,
  GetRecommendationsDto,
  GetRecommendationsQueryDto,
  GetSimilarQueryDto,
} from './dto';
import { GetSessionInfoDto } from 'src/auth/dto';

describe('RecommendationController', () => {
  let controller: RecommendationController;

  const service = {
    getForYou: jest.fn(),
    getPeers: jest.fn(),
    getSimilar: jest.fn(),
    explain: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecommendationController],
      providers: [{ provide: RecommendationService, useValue: service }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(RecommendationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getForYou calls service.getForYou(query, session.id)', async () => {
    const query: GetRecommendationsQueryDto = {
      objective: 'balanced',
      limit: 5,
    };
    const session: GetSessionInfoDto = {
      id: 7,
      email: 'a@a.com',
      iat: 1,
      exp: 2,
    };

    const dto: GetRecommendationsDto = {
      items: [
        {
          recipeId: 42,
          title: 'Greek Salad',
          picture_url: 'https://cdn.example.com/recipes/42.jpg',
          score: 0.73,
          ingredients: ['tomato', 'cucumber', 'feta'],
        },
      ],
    };

    service.getForYou.mockResolvedValueOnce(dto);

    const res = await controller.getForYou(query, session);

    expect(service.getForYou).toHaveBeenCalledWith(query, 7);
    expect(res).toBe(dto);
  });

  it('getPeers calls service.getPeers(query, session.id)', async () => {
    const query: GetRecommendationsQueryDto = { objective: 'sleep', limit: 3 };
    const session: GetSessionInfoDto = {
      id: 9,
      email: 'b@b.com',
      iat: 1,
      exp: 2,
    };

    const dto: GetRecommendationsDto = {
      items: [
        {
          recipeId: 11,
          title: 'Overnight Oats',
          picture_url: 'https://cdn.example.com/recipes/11.jpg',
          score: 0.66,
          ingredients: ['oats', 'milk', 'banana'],
        },
      ],
    };

    service.getPeers.mockResolvedValueOnce(dto);

    const res = await controller.getPeers(query, session);

    expect(service.getPeers).toHaveBeenCalledWith(query, 9);
    expect(res).toBe(dto);
  });

  it('getSimilar calls service.getSimilar(recipeId, query)', async () => {
    const recipeId = 13;
    const query: GetSimilarQueryDto = { limit: 4 };
    const session: GetSessionInfoDto = {
      id: 12,
      email: 'c@c.com',
      iat: 1,
      exp: 2,
    };

    const dto: GetRecommendationsDto = {
      items: [
        {
          recipeId: 14,
          title: 'Tomato Pasta',
          picture_url: 'https://cdn.example.com/recipes/14.jpg',
          score: 0.58,
          ingredients: ['spaghetti', 'tomato', 'garlic'],
        },
      ],
    };

    service.getSimilar.mockResolvedValueOnce(dto);

    const res = await controller.getSimilar(recipeId, query, session);

    expect(service.getSimilar).toHaveBeenCalledWith(recipeId, query);
    expect(res).toBe(dto);
  });

  it('explain calls service.explain(recipeId, query, session.id)', async () => {
    const recipeId = 21;
    const query: ExplainQueryDto = { objective: 'energy' };
    const session: GetSessionInfoDto = {
      id: 5,
      email: 'd@d.com',
      iat: 1,
      exp: 2,
    };

    const dto: ExplainRecommendationDto = {
      recipeId,
      score: 0.71,
      breakdown: {
        affinity: 0.45,
        prefs: 0.2,
        nutrientsObjective: 0.1,
        profileSimilarity: -0.02,
      },
      reasons: ['contains banana — you liked it', 'fits vegetarian diet'],
    };

    service.explain.mockResolvedValueOnce(dto);

    const res = await controller.explain(recipeId, query, session);

    expect(service.explain).toHaveBeenCalledWith(recipeId, query, 5);
    expect(res).toBe(dto);
  });
});
