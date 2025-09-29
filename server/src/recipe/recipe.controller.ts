import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionInfoDto } from 'src/auth/dto';
import {
  AddRecipeDto,
  PatchRecipeDto,
  RecipeDto,
  RecipeListDto,
  RecipeListQueryDto,
} from './dto';
import { IngredientService } from './ingredients/ingredient.service';

@Controller('recipes')
export class RecipeController {
  constructor(
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
  ) {}

  @Get('test')
  async testFetch(@Query('name') name: string) {
    const result = await this.ingredientService['getOrFetch'](name);
    return result ?? { message: 'not found' };
  }

  @Get()
  @ApiOkResponse({ type: RecipeListDto })
  getAll(@Query() query: RecipeListQueryDto): Promise<RecipeListDto> {
    return this.recipeService.getAll(query);
  }

  @Get('/:id')
  @ApiOkResponse({ type: RecipeDto })
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.recipeService.getOneById(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  @ApiCreatedResponse({ type: RecipeDto })
  addRecipe(
    @Body() dto: AddRecipeDto,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    return this.recipeService.addRecipe(dto, session.id);
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  @ApiOkResponse({ type: RecipeDto })
  patchRecipe(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PatchRecipeDto,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    return this.recipeService.patchRecipe(id, dto);
  }
}
