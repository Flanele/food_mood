import { Test, TestingModule } from '@nestjs/testing';
import { IngredientService } from './ingredient.service';
import { DbService } from 'src/db/db.service';
import { UsdaService } from './usda/usda.service';

const dbMock = {
  ingredientCache: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  pieceWeight: {
    findFisst: jest.fn(),
    findUnique: jest.fn(),
  },
};

const usdaMock = {
  findByExternalId: jest.fn(),
  searchByName: jest.fn(),
  buildExternalIngredient: jest.fn(),
};

describe('IngredientService', () => {
  let service: IngredientService;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngredientService,
        { provide: DbService, useValue: dbMock },
        { provide: UsdaService, useValue: usdaMock },
      ],
    }).compile();

    service = module.get<IngredientService>(IngredientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns cached ingredient by externalId', async () => {
    const cached = {
      id: 1,
      externalId: 123,
      normalizedName: 'MILK',
      kcalBase: 60,
      protBase: 3,
      fatBase: 3,
      carbBase: 5,
      sugarBase: 5,
    };

    dbMock.ingredientCache.findFirst.mockResolvedValue(cached);

    const result = await service.getOrFetch('milk', 123);

    expect(result).toBe(cached);
    expect(dbMock.ingredientCache.findFirst).toHaveBeenCalledWith({
      where: { externalId: 123 },
    });
    expect(usdaMock.searchByName).not.toHaveBeenCalled();
  });

  it('returns cached ingredient by normalized name', async () => {
    const cached = {
      normalizedName: 'MILK',
      kcalBase: 60,
      protBase: 3,
      fatBase: 3,
      carbBase: 5,
      sugarBase: 5,
    };

    dbMock.ingredientCache.findFirst.mockResolvedValue(null);
    dbMock.ingredientCache.findUnique.mockResolvedValue(cached);

    const result = await service.getOrFetch('  milk  ');

    expect(dbMock.ingredientCache.findUnique).toHaveBeenCalledWith({
      where: { normalizedName: 'MILK' },
    });
    expect(result).toBe(cached);
  });

  it('fetches from USDA and creates cache when not found', async () => {
    const food = {
      fdcId: 10,
      description: 'Milk',
    };

    const ext = {
      externalId: 10,
      normalizedName: 'MILK',
      kcalBase: 60,
      protBase: 3,
      fatBase: 3,
      carbBase: 5,
      sugarBase: 5,
    };

    dbMock.ingredientCache.findFirst.mockResolvedValue(null);
    dbMock.ingredientCache.findUnique.mockResolvedValue(null);

    usdaMock.findByExternalId.mockResolvedValue(food);
    usdaMock.buildExternalIngredient.mockReturnValue(ext);
    dbMock.ingredientCache.create.mockResolvedValue(ext);

    const result = await service.getOrFetch('milk', 10);

    expect(usdaMock.findByExternalId).toHaveBeenCalledWith(10);
    expect(dbMock.ingredientCache.create).toHaveBeenCalled();
    expect(result).toBe(ext);
  });

  it('builds ingredient row for grams unit', async () => {
    const now = new Date();

    const cache = {
      name: 'Milk',
      id: 123,
      externalId: 4545,
      normalizedName: 'MILK',
      dataType: 'Foundation',
      basis: 'PER_100G',
      kcalBase: 60,
      protBase: 3,
      fatBase: 3,
      carbBase: 5,
      sugarBase: 5,
      provider: 'usda',
      fetchedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    jest.spyOn(service, 'getOrFetch').mockResolvedValue(cache);

    const result = await service.buildIngredientRow({
      name: 'milk',
      amount: 50,
      unit: 'g',
    });

    expect(result.grams).toBe(50);
    expect(result.kcalTotal).toBe(30);
  });

  it('converts pieces using opts.pieceGrams', async () => {
    const now = new Date();

    const cache = {
      name: 'Egg',
      id: 123,
      externalId: 4545,
      normalizedName: 'EGG',
      dataType: 'Foundation',
      basis: 'PER_100G',
      kcalBase: 100,
      protBase: 10,
      fatBase: 10,
      carbBase: 0,
      sugarBase: 0,
      provider: 'usda',
      fetchedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    jest.spyOn(service, 'getOrFetch').mockResolvedValue(cache);

    const result = await service.buildIngredientRow({
      name: 'egg',
      amount: 2,
      unit: 'pc',
      opts: { pieceGrams: 60 },
    });

    expect(result.grams).toBe(120);
    expect(result.kcalTotal).toBe(120);
  });

  it('returns empty array for short query', async () => {
    const result = await service.suggest({ query: 'a' });
    expect(result).toEqual([]);
  });

  it('maps USDA suggestions correctly', async () => {
    usdaMock.searchByName.mockResolvedValue([
      { fdcId: 1, description: 'Apple', dataType: 'Branded' },
    ]);

    const result = await service.suggest({ query: 'ap', limit: 5 });

    expect(result).toEqual([
      {
        externalId: 1,
        name: 'Apple',
        dataType: 'Branded',
      },
    ]);
  });

  it('normalizes name when looking up piece weight', async () => {
    dbMock.pieceWeight.findUnique.mockResolvedValue({ gramsPerPiece: 50 });

    await service.findIngredientWeight('  apple  ');

    expect(dbMock.pieceWeight.findUnique).toHaveBeenCalledWith({
      where: { normalizedName: 'APPLE' },
    });
  });
});
