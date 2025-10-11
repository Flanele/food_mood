import { Controller, Get, Query } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { IngredientWeightDto } from './dto';

@Controller('ingredients')
export class IngredientController {
  constructor(private ingredientService: IngredientService) {}

  @Get('weight')
  @ApiOkResponse({ type: IngredientWeightDto })
  @ApiResponse({
    status: 200,
    description: 'Returns 0 if ingredient not found',
    schema: { example: 0 },
  })
  async findIngredientWeight(
    @Query('name') name: string,
  ): Promise<IngredientWeightDto | number> {
    const ingredientWeight =
      await this.ingredientService.findIngredientWeight(name);
    return ingredientWeight ?? 0;
  }

  @Get('test')
  async testFetch(@Query('name') name: string) {
    const result = await this.ingredientService['getOrFetch'](name);
    return result ?? { message: 'not found' };
  }
}
