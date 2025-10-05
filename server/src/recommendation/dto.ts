import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, Min } from 'class-validator';

export type Objective = 'balanced' | 'mood' | 'energy' | 'sleep';

export class GetRecommendationsQueryDto {
  @ApiProperty({
    enum: ['balanced', 'mood', 'energy', 'sleep'],
    example: 'balanced',
    required: false,
  })
  @IsOptional()
  @IsEnum(['balanced', 'mood', 'energy', 'sleep'])
  objective?: Objective;

  @ApiProperty({
    example: 12,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number;
}

export class GetSimilarQueryDto {
  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number;
}

export class ExplainQueryDto {
  @ApiProperty({
    enum: ['balanced', 'mood', 'energy', 'sleep'],
    example: 'balanced',
    required: false,
  })
  @IsOptional()
  @IsEnum(['balanced', 'mood', 'energy', 'sleep'])
  objective?: Objective;
}

export class RecommendationItemDto {
  @ApiProperty({ example: 42 })
  recipeId: number;

  @ApiProperty({ example: 'Greek Salad' })
  title: string;

  @ApiProperty({ example: 'https://cdn.example.com/recipes/42.jpg' })
  picture_url: string;

  @ApiProperty({ example: 0.73 })
  score: number;

  @ApiProperty({ example: ['egg', 'milk', 'flour'] })
  ingredients: string[];
}

export class GetRecommendationsDto {
  @ApiProperty({ type: [RecommendationItemDto] })
  items: RecommendationItemDto[];
}

export class ExplainBreakdownDto {
  @ApiProperty({
    example: 0.45,
    description: 'Ingredient affinity contribution',
  })
  affinity: number;

  @ApiProperty({
    example: 0.2,
    description: 'Diet/allergies match contribution',
  })
  prefs: number;

  @ApiProperty({
    example: 0.1,
    description: 'Nutrient influence for the selected objective (e.g., sleep)',
  })
  nutrientsObjective: number;

  @ApiProperty({
    example: -0.02,
    description: 'Similar-profile users feedback contribution',
  })
  profileSimilarity: number;
}

export class ExplainRecommendationDto {
  @ApiProperty({ example: 42 })
  recipeId: number;

  @ApiProperty({ example: 0.73 })
  score: number;

  @ApiProperty({
    example: {
      affinity: 0.45, // ингредиенты, которые ты любишь/не любишь
      prefs: 0.2, // совпадение с diet/allergies
      nutrientsObjective: 0.1, // влияние нутриентов под выбранную цель
      profileSimilarity: -0.02, // опыт похожих пользователей
    },
  })
  breakdown: ExplainBreakdownDto;

  @ApiProperty({
    example: ['contains tomato — you liked it before', 'fits vegetarian diet'],
  })
  reasons: string[];
}
