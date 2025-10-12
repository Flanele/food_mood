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
import {
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionInfoDto } from 'src/auth/dto';
import {
  AddRecipeDto,
  PatchRecipeDto,
  RecipeDto,
  RecipeListDto,
  RecipeListLiteDto,
  RecipeListQueryDto,
} from './dto';

@Controller('recipes')
export class RecipeController {
  constructor(
    private recipeService: RecipeService,
  ) {}
  
  @Get()
  @ApiOkResponse({ type: RecipeListDto })
  getAll(@Query() query: RecipeListQueryDto): Promise<RecipeListDto> {
    return this.recipeService.getAll(query);
  }

  @UseGuards(AuthGuard)
  @Get('my-recipes')
  @ApiOkResponse({ type: RecipeListLiteDto })
  getMyRecipes(
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<RecipeListLiteDto> {
    return this.recipeService.getMy(session.id);
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
    return this.recipeService.patchRecipe(id, dto, session.id);
  }
}
