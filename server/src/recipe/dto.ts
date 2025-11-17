import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { Prisma } from 'generated/prisma';
import { AddIngredientDto, IngredientDto } from 'src/ingredient/dto';

export class PageMetaDto {
  @ApiProperty() total: number; // всего записей
  @ApiProperty() page: number; // текущая страница
  @ApiProperty() limit: number; // сколько на страницу
  @ApiProperty() pages: number; // всего страниц
}

export class RecipeDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty({ nullable: true, example: 10 })
  @IsOptional()
  @IsInt()
  authorProfileId?: number | null;

  @ApiProperty({ example: 'Scrambled Eggs' })
  @IsString()
  title: string;

  @ApiProperty({
    type: Object,
    example: {
      steps: [
        {
          order: 1,
          text: 'Crack the eggs into a bowl and whisk with milk, salt, and pepper.',
          imageUrl: 'https://cdn.example.com/recipes/eggs/step1.jpg',
        },
        { order: 2, text: 'Melt butter in a pan over medium heat.' },
        { order: 3, text: 'Pour in the eggs and stir gently until just set.' },
        { order: 4, text: 'Serve hot with bread or toast.' },
      ],
    },
  })
  steps: Prisma.JsonValue;

  @ApiProperty({ example: 'https://cdn.example.com/main-picture.jpg' })
  @IsUrl()
  picture_url: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  servings: number;

  @ApiProperty({ example: 180 })
  @IsNumber()
  kcalPerServ: number;

  @ApiProperty({ example: 12 })
  @IsNumber()
  protPerServ: number;

  @ApiProperty({ example: 14 })
  @IsNumber()
  fatPerServ: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  carbPerServ: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  sugarPerServ: number;

  @ApiProperty({ type: [IngredientDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients: IngredientDto[];

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}

export class StepDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  order: number;

  @ApiProperty({ example: 'Boil pasta in salted water until al dente.' })
  @IsString()
  text: string;

  @ApiProperty({ required: false, example: 'https://...' })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}

export class StepsPayloadDto {
  @ApiProperty({ type: [StepDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepDto)
  steps: StepDto[];
}

export class AddRecipeDto {
  @ApiProperty({ example: 'Scrambled Eggs' })
  @IsString()
  title: string;

  @ApiProperty({
    type: Object,
    example: {
      steps: [
        {
          order: 1,
          text: 'Crack the eggs into a bowl and whisk with milk, salt, and pepper.',
          imageUrl: 'https://cdn.example.com/recipes/eggs/step1.jpg',
        },
        { order: 2, text: 'Melt butter in a pan over medium heat.' },
        { order: 3, text: 'Pour in the eggs and stir gently until just set.' },
        { order: 4, text: 'Serve hot with bread or toast.' },
      ],
    },
  })
  @ValidateNested()
  @Type(() => StepsPayloadDto)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const parsed = JSON.parse(value); // ожидаем { steps: [...] }
      return plainToInstance(StepsPayloadDto, parsed);
    }

    return value;
  })
  steps: StepsPayloadDto;

  @ApiProperty({ example: 'https://cdn.example.com/main-picture.jpg' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'undefined' || value === '' || value == null) {
      return undefined;
    }
    return value;
  })
  @IsUrl()
  picture_url?: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  servings: number;

  @ApiProperty({
    type: [AddIngredientDto],
    example: [
      { name: 'egg', amount: 4, unit: 'pcs' },
      { name: 'milk', amount: 2, unit: 'tbsp' },
      { name: 'butter', amount: 1, unit: 'tbsp' },
      { name: 'salt', amount: 1, unit: 'pinch' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddIngredientDto)
  @Transform(({ value }) => {
    // multipart: приходит ОДНА строка:
    if (typeof value === 'string') {
      const trimmed = value.trim();

      // если это уже JSON-массив — парсим как есть
      const json = trimmed.startsWith('[') ? trimmed : `[${trimmed}]`;

      const parsed = JSON.parse(json) as unknown[];
      return plainToInstance(AddIngredientDto, parsed);
    }

    //  несколько полей "ingredients" → массив строк
    if (Array.isArray(value)) {
      const parsedArray = value.map((item) => {
        if (typeof item === 'string') {
          return JSON.parse(item);
        }
        return item;
      });
  
      return plainToInstance(AddIngredientDto, parsedArray);
    }

    // fallback: один объект
    return plainToInstance(AddIngredientDto, [value] as unknown[]);
  })
  ingredients: AddIngredientDto[];
}

export class RecipeListDto {
  @ApiProperty({ type: [RecipeDto] })
  recipes: RecipeDto[];

  @ApiProperty({ type: PageMetaDto })
  meta: PageMetaDto;
}

export class RecipeListLiteDto {
  @ApiProperty({ type: [RecipeDto] })
  recipes: RecipeDto[];
}

export class RecipeFiltersDto {
  @ApiProperty({ required: false, type: [String], example: ['oats'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includeIngredients?: string[];

  @ApiProperty({ required: false, type: [String], example: ['sugar'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludeIngredients?: string[];

  @ApiProperty({ required: false, example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minKcal?: number;

  @ApiProperty({ required: false, example: 500 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxKcal?: number;

  @ApiProperty({ required: false, example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minSugar?: number;

  @ApiProperty({ required: false, example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxSugar?: number;

  @ApiProperty({ required: false, example: 15 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minProt?: number;

  @ApiProperty({ required: false, example: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxProt?: number;
}

export class RecipeListQueryDto {
  @ApiProperty({ required: false, example: 'eggs' })
  @IsOptional()
  @IsString()
  q?: string;
  @ApiProperty({ required: false, type: RecipeFiltersDto })
  @IsOptional()
  filters?: RecipeFiltersDto;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsInt()
  page?: number;

  @ApiProperty({ required: false, example: 20 })
  @IsOptional()
  @IsInt()
  limit?: number;
}

export class PatchRecipeDto {
  @ApiProperty({ example: 'Scrambled Eggs', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    type: Object,
    required: false,
    example: {
      steps: [
        { order: 1, text: 'Whisk eggs with milk, salt, pepper.' },
        { order: 2, text: 'Melt butter in a pan.' },
      ],
    },
  })
  @IsOptional()
  steps?: Prisma.JsonValue;

  @ApiProperty({
    example: 'https://cdn.example.com/main-picture.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  picture_url?: string;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  servings?: number;

  @ApiProperty({
    type: [AddIngredientDto],
    required: false,
    example: [{ name: 'egg', amount: 3, unit: 'pcs' }],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddIngredientDto)
  ingredients?: AddIngredientDto[];
}
