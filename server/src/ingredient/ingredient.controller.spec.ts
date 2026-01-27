import { Test, TestingModule } from '@nestjs/testing';
import { IngredientController } from './ingredient.controller';
import { IngredientService } from './ingredient.service';
import { IngredientSuggestQueryDto } from './dto';

describe('IngredientController', () => {
  let controller: IngredientController;

  const ingredientServiceMock = {
    findIngredientWeight: jest.fn(),
    suggest: jest.fn(),
    getOrFetch: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngredientController],
      providers: [
        { provide: IngredientService, useValue: ingredientServiceMock },
      ],
    }).compile();

    controller = module.get<IngredientController>(IngredientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findIngredientWeight', () => {
    it('returns weight dto when found', async () => {
      const dto = { gramsPerPiece: 50 };

      ingredientServiceMock.findIngredientWeight.mockResolvedValueOnce(dto);

      const res = await controller.findIngredientWeight('milk');

      expect(ingredientServiceMock.findIngredientWeight).toHaveBeenCalledWith(
        'milk',
      );
      expect(res).toEqual(dto);
    });

    it('returns 0 when not found', async () => {
      ingredientServiceMock.findIngredientWeight.mockResolvedValueOnce(null);

      const res = await controller.findIngredientWeight('unknown');

      expect(ingredientServiceMock.findIngredientWeight).toHaveBeenCalledWith(
        'unknown',
      );
      expect(res).toBe(0);
    });
  });

  describe('makeIngredientSuggestion', () => {
    it('calls service.suggest and returns suggestions', async () => {
      const query: IngredientSuggestQueryDto = { query: 'app', limit: 5 };
      const suggestions = [
        { externalId: 1, name: 'Apple', dataType: 'Branded' },
      ];

      ingredientServiceMock.suggest.mockResolvedValueOnce(suggestions);

      const res = await controller.makeIngredientSuggestion(query);

      expect(ingredientServiceMock.suggest).toHaveBeenCalledWith(query);
      expect(res).toEqual(suggestions);
    });
  });
});
