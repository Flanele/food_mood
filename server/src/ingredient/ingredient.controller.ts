import { Controller, Get, Query } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { ApiOkResponse, ApiQuery, ApiResponse } from '@nestjs/swagger';
import {
  IngredientSuggestionDto,
  IngredientSuggestQueryDto,
  IngredientWeightDto,
} from './dto';

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

  @Get('search')
  @ApiOkResponse({ type: IngredientSuggestionDto, isArray: true })
  async makeIngredientSuggestion(
    @Query() query: IngredientSuggestQueryDto,
  ): Promise<IngredientSuggestionDto[]> {
    return await this.ingredientService.suggest(query);
  }

  @Get('test')
  @ApiQuery({ name: 'name', required: true, type: String })
  @ApiQuery({ name: 'externalId', required: false, type: Number })
  async testFetch(
    @Query('name') name: string,
    @Query('externalId') externalId?: string,
  ) {
    const id = externalId ? Number(externalId) : undefined;
    return this.ingredientService.getOrFetch(name, id);
  }
}
