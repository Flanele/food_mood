import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
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
