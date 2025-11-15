import { Test } from '@nestjs/testing';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { AddRecipeDto } from './dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FilesService } from 'src/files/files.service';
import { Request } from 'express';

describe('RecipeController', () => {
  let controller: RecipeController;
  let service: {
    getAll: jest.Mock;
    getMy: jest.Mock;
    getOneById: jest.Mock;
    addRecipe: jest.Mock;
    patchRecipe: jest.Mock;
  };
  let filesService: {
    mapFilesForRecipe: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      getAll: jest.fn(),
      getMy: jest.fn(),
      getOneById: jest.fn(),
      addRecipe: jest.fn(),
      patchRecipe: jest.fn(),
    };

    filesService = {
      mapFilesForRecipe: jest
        .fn()
        .mockReturnValue({ picture_url: undefined, stepImages: [] }),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [RecipeController],
      providers: [
        { provide: RecipeService, useValue: service },
        { provide: FilesService, useValue: filesService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = moduleRef.get(RecipeController);
  });

  it('should call service.getAll', async () => {
    service.getAll.mockResolvedValueOnce({ recipes: [], meta: {} });
    const res = await controller.getAll({ q: 'test', page: 1, limit: 10 });
    expect(service.getAll).toHaveBeenCalledWith({
      q: 'test',
      page: 1,
      limit: 10,
    });
    expect(res).toEqual({ recipes: [], meta: {} });
  });

  it('should call service.getMy', async () => {
    service.getMy.mockResolvedValueOnce({ recipes: [] });
    const session = { id: 123, email: 'ahsj@g.com', iat: 10, exp: 10 };
    const res = await controller.getMyRecipes(session);
    expect(service.getMy).toHaveBeenCalledWith(123);
    expect(res).toEqual({ recipes: [] });
  });

  it('should call service.getOneById', async () => {
    service.getOneById.mockResolvedValueOnce({ id: 5 });
    const res = await controller.getOne(5);
    expect(service.getOneById).toHaveBeenCalledWith(5);
    expect(res).toEqual({ id: 5 });
  });

  it('should call service.addRecipe', async () => {
    service.addRecipe.mockResolvedValueOnce({ id: 7 });
    const dto: AddRecipeDto = {
      title: 'T',
      steps: {
        steps: [
          {
            order: 1,
            text: 'Step 1',
            imageUrl: 'https://example.com/step1.jpg',
          },
        ],
      },
      picture_url: 'https://example.com/img.jpg',
      servings: 1,
      ingredients: [{ name: 'egg', amount: 2, unit: 'pcs' }],
    };

    const session = { id: 10, email: 'ahsj@g.com', iat: 10, exp: 10 };

    const files: Express.Multer.File[] = [];
    const req = {} as unknown as Request;

    const res = await controller.addRecipe(dto, files, session, req);

    expect(service.addRecipe).toHaveBeenCalledWith(dto, 10);
    expect(res).toEqual({ id: 7 });
  });

  it('should call service.patchRecipe', async () => {
    service.patchRecipe.mockResolvedValueOnce({ id: 8 });
    const dto = { title: 'X' };
    const session = { id: 11, email: 'ahsj@g.com', iat: 10, exp: 10 };
    const files: Express.Multer.File[] = [];
    const req = {} as unknown as Request;

    const res = await controller.patchRecipe(8, files, dto, session, req);

    expect(service.patchRecipe).toHaveBeenCalledWith(8, dto, 11);
    expect(res).toEqual({ id: 8 });
  });
});
