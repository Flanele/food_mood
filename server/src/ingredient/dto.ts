import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

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

  @ApiProperty({
    required: false,
    example: 748967,
    description: 'USDA fdcId',
  })
  @IsOptional()
  @IsInt()
  externalId?: number;

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

export class IngredientWeightDto {
  @ApiProperty({ example: 4 })
  @IsInt()
  id: number;

  @ApiProperty({ example: 'GARLIC CLOVE' })
  @IsString()
  normalizedName: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  gramsPerPiece: number;

  @ApiProperty({ example: 'default' })
  @IsString()
  source: string;
}

export class IngredientSuggestQueryDto {
  @ApiProperty({ example: 'egg' })
  @IsString()
  @MinLength(2)
  query: string;

  @ApiProperty({ required: false, example: 8 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  limit?: number;
}

export class IngredientSuggestionDto {
  @ApiProperty({ example: 748967 })
  @IsInt()
  externalId: number;

  @ApiProperty({ example: 'EGG, WHOLE, RAW, FRESH' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Foundation' })
  @IsString()
  dataType: string;
}
