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
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Prisma } from 'generated/prisma';

// ---------- Ingredient DTOs ----------

export class IngredientDto {
  @ApiProperty({ example: 7 })
  @IsInt()
  id: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  recipeId: number;

  @ApiProperty({ example: 'egg' })
  @IsString()
  name: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'pcs' })
  @IsString()
  unit: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  grams: number;

  @ApiProperty({ example: 360 })
  @IsNumber()
  kcalTotal: number;

  @ApiProperty({ example: 24 })
  @IsNumber()
  protTotal: number;

  @ApiProperty({ example: 28 })
  @IsNumber()
  fatTotal: number;

  @ApiProperty({ example: 4 })
  @IsNumber()
  carbTotal: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  sugarTotal: number;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}

export class AddIngredientDto {
  @ApiProperty({ example: 'egg' })
  @IsString()
  name: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'pcs' })
  @IsString()
  unit: string;

  @ApiProperty({ required: false, example: { pieceGrams: 60 } })
  @IsOptional()
  @IsObject()
  opts?: {
    pieceGrams?: number;
  };
}

// ---------- Recipe DTOs ----------

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
          imageUrl: 'https://cdn.example.com/recipes/eggs/step1.jpg'
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
  
  ingredients: AddIngredientDto[];
}

export class RecipeListDto {
  @ApiProperty({ type: [RecipeDto] })
  recipes: RecipeDto[];

  @ApiProperty({ type: PageMetaDto })
  meta: PageMetaDto;
}

export class RecipeListQueryDto {
  @ApiProperty({ required: false, example: 'eggs' })
  @IsOptional()
  @IsString()
  q?: string;

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
