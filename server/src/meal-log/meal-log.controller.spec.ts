import { Test } from '@nestjs/testing';
import { MealLogController } from './meal-log.controller';
import { MealLogService } from './meal-log.service';
import { AuthGuard } from 'src/auth/auth.guard';

describe('MealLogController', () => {
  let controller: MealLogController;
  let service: {
    addMealLog: jest.Mock;
    getOne: jest.Mock;
    patchMealLog: jest.Mock;
    deleteOne: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      addMealLog: jest.fn(),
      getOne: jest.fn(),
      patchMealLog: jest.fn(),
      deleteOne: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [MealLogController],
      providers: [{ provide: MealLogService, useValue: service }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = moduleRef.get(MealLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.addMealLog', async () => {
    service.addMealLog.mockResolvedValueOnce({ id: 1 });
    const dto = { mealType: 'breakfast', recipeId: 10, servings: 1 };
    const session = { id: 5, email: 'a@b.com', iat: 10, exp: 10 };

    const res = await controller.addMealLog(dto, session);
    expect(service.addMealLog).toHaveBeenCalledWith(dto, 5);
    expect(res).toEqual({ id: 1 });
  });

  it('should call service.getOne', async () => {
    service.getOne.mockResolvedValueOnce({ id: 3 });
    const session = { id: 7, email: 'x@y.com', iat: 10, exp: 10 };

    const res = await controller.getOne(3, session);
    expect(service.getOne).toHaveBeenCalledWith(3, 7);
    expect(res).toEqual({ id: 3 });
  });

  it('should call service.patchMealLog', async () => {
    service.patchMealLog.mockResolvedValueOnce({ id: 4 });
    const dto = { servings: 2 };
    const session = { id: 9, email: 'z@q.com', iat: 10, exp: 10 };

    const res = await controller.patchMealLog(4, dto, session);
    expect(service.patchMealLog).toHaveBeenCalledWith(4, dto, 9);
    expect(res).toEqual({ id: 4 });
  });

  it('should call service.deleteOne', async () => {
    service.deleteOne.mockResolvedValueOnce({ success: true });
    const session = { id: 2, email: 'del@me.com', iat: 10, exp: 10 };

    const res = await controller.deleteOne(12, session);
    expect(service.deleteOne).toHaveBeenCalledWith(12, 2);
    expect(res).toEqual({ success: true });
  });
});
