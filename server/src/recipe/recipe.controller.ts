import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import {
  ApiConsumes,
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
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from 'src/files/files.service';
import type { Request } from 'express';
import { imageStorage } from 'src/files/files.storage';

@Controller('recipes')
export class RecipeController {
  constructor(
    private recipeService: RecipeService,
    private filesService: FilesService,
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
  @UseInterceptors(
    AnyFilesInterceptor({
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
      storage: imageStorage,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: RecipeDto })
  addRecipe(
    @Body() dto: AddRecipeDto,
    @UploadedFiles() files: Express.Multer.File[],
    @SessionInfo() session: GetSessionInfoDto,
    @Req() req: Request,
  ) {
    const mapped = this.filesService.mapFilesForRecipe(files, req);

    if (mapped.picture_url) {
      dto.picture_url = mapped.picture_url;
    }

    for (const img of mapped.stepImages) {
      if (dto.steps?.[img.index]) {
        dto.steps[img.index].imageUrl = img.imageUrl;
      }
    }

    return this.recipeService.addRecipe(dto, session.id);
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  @UseInterceptors(
    AnyFilesInterceptor({
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
      storage: imageStorage,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: RecipeDto })
  patchRecipe(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: PatchRecipeDto,
    @SessionInfo() session: GetSessionInfoDto,
    @Req() req: Request,
  ) {
    const mapped = this.filesService.mapFilesForRecipe(files, req);

    if (mapped.picture_url) {
      dto.picture_url = mapped.picture_url;
    }

    for (const img of mapped.stepImages) {
      if (dto.steps?.[img.index]) {
        dto.steps[img.index].imageUrl = img.imageUrl;
      }
    }

    return this.recipeService.patchRecipe(id, dto, session.id);
  }
}
