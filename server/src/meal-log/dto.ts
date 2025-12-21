import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNumber, IsOptional } from 'class-validator';

export class MealLogDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  userProfileId: number;

  @ApiProperty({ example: 2 })
  recipeId: number;

  @ApiProperty({ example: 1 })
  servings: number;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2025-09-29T12:34:56.000Z',
  })
  eatenAt: Date;

  @ApiProperty({ nullable: true, type: Number, example: 7 })
  moodScore?: number | null;

  @ApiProperty({ nullable: true, type: Number, example: 8 })
  energyScore?: number | null;

  @ApiProperty({ nullable: true, type: Number, example: 6 })
  sleepScore?: number | null;
}
 
export class AddMealLogDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  @Type(() => Number)
  recipeId: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Type(() => Number)
  servings: number;

  @ApiProperty({
    type: String,
    format: 'date-time',
    required: false,
    example: '2025-09-29T08:15:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  eatenAt?: Date;

  @ApiProperty({ required: false, example: 5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  moodScore?: number;

  @ApiProperty({ required: false, example: 6 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  energyScore?: number;

  @ApiProperty({ required: false, example: 7 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sleepScore?: number;
}

export class PatchMealLogDto {
  @ApiProperty({ required: false, example: 3 })
  @IsOptional()
  @Type(() => Number)
  servings?: number;

  @ApiProperty({
    type: String,
    format: 'date-time',
    required: false,
    example: '2025-09-29T19:45:00.000Z',
  })
  @Type(() => Date)
  @IsOptional()
  eatenAt?: Date;

  @ApiProperty({ required: false, example: 8 })
  @IsOptional()
  @Type(() => Number)
  moodScore?: number;

  @ApiProperty({ required: false, example: 7 })
  @IsOptional()
  @Type(() => Number)
  energyScore?: number;

  @ApiProperty({ required: false, example: 9 })
  @IsOptional()
  @Type(() => Number)
  sleepScore?: number;
}
