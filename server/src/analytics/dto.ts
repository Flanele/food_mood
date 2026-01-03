import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export type TimeGrouping = 'day' | 'week' | 'month';

export class GetAnalyticsByTimeQueryDto {
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2025-09-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  from?: Date;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2025-09-07T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  to?: Date;

  @ApiProperty({
    enum: ['day', 'week', 'month'],
    example: 'day',
    required: false,
  })
  @IsOptional()
  @IsEnum(['day', 'week', 'month'])
  groupBy?: TimeGrouping;
}

export class AnalyticsByTimePointDto {
  @ApiProperty({ example: '2025-09-01' })
  key: string;

  @ApiProperty({ example: 1800 })
  kcal: number;

  @ApiProperty({ example: 80 })
  prot: number;

  @ApiProperty({ example: 60 })
  fat: number;

  @ApiProperty({ example: 150 })
  carb: number;

  @ApiProperty({ example: 40 })
  sugar: number;
}

export class GetAnalyticsByTimeDto {
  @ApiProperty({
    example: {
      kcal: 14200,
      prot: 600,
      fat: 450,
      carb: 1200,
      sugar: 300,
    },
  })
  total: Record<string, number>;

  @ApiProperty({
    example: [
      {
        key: '2025-09-01',
        kcal: 1800,
        prot: 80,
        fat: 60,
        carb: 150,
        sugar: 40,
      },
      {
        key: '2025-09-02',
        kcal: 2000,
        prot: 90,
        fat: 70,
        carb: 180,
        sugar: 50,
      },
    ],
    type: AnalyticsByTimePointDto,
    isArray: true,
  })
  series: AnalyticsByTimePointDto[];
}

export class GetTopIngredientsQueryDto {
  @ApiProperty({
    required: false,
    type: String,
    format: 'date-time',
    example: '2025-09-07T23:59:59Z',
  })
  @IsOptional()
  from?: Date;

  @ApiProperty({
    required: false,
    type: String,
    format: 'date-time',
    example: '2025-09-07T23:59:59Z',
  })
  @IsOptional()
  to?: Date;

  @ApiProperty({ required: false, example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

export class GetTopIngredientsDto {
  items: {
    name: string;
    count: number; // сколько раз встречался
    totalGrams: number; // общий вес за период
    totalKcal: number; // общий вклад в ккал
  }[];
}

export type Metric = 'kcal' | 'prot' | 'fat' | 'carb' | 'sugar';

export class GetNutrientsScoreQueryDto {
  @ApiProperty({
    enum: ['kcal', 'prot', 'fat', 'carb', 'sugar'],
    example: 'kcal',
  })
  @IsEnum(['kcal', 'prot', 'fat', 'carb', 'sugar'])
  metric: Metric;

  @ApiProperty({
    required: false,
    type: String,
    format: 'date-time',
    example: '2025-09-07T23:59:59Z',
  })
  @IsOptional()
  from?: Date;

  @ApiProperty({
    required: false,
    type: String,
    format: 'date-time',
    example: '2025-09-07T23:59:59Z',
  })
  @IsOptional()
  to?: Date;
}

export class GetNutrientsScoreDto {
  @ApiProperty({
    example: 'sugar',
    enum: ['kcal', 'prot', 'fat', 'carb', 'sugar'],
  })
  metric: Metric;

  @ApiProperty({
    example: 320,
  })
  totalConsumed: number;

  @ApiProperty({
    example: {
      mood: -0.1,
      energy: -0.3,
      sleep: -0.8,
    },
    description:
      'Simplified correlation score showing how this nutrient relates to mood, energy, and sleep. Range from -1 to 1: negative means worse effect, positive means better effect.',
  })
  correlation: {
    mood: number | null;
    energy: number | null;
    sleep: number | null;
  };

  @ApiProperty({
    description:
      'Daily breakdown showing how much of this nutrient was consumed each day and what mood, energy, and sleep scores were recorded by the user',
    example: [
      {
        date: '2025-09-01',
        metricValue: 30,
        mood: 5,
        energy: 4,
        sleep: 4,
      },
      {
        date: '2025-09-02',
        metricValue: 80,
        mood: 3,
        energy: 2,
        sleep: 2,
      },
      {
        date: '2025-09-03',
        metricValue: 20,
        mood: 5,
        energy: 5,
        sleep: 5,
      },
    ],
  })
  details: Array<{
    date: string;
    metricValue: number;
    mood: number | null;
    energy: number | null;
    sleep: number | null;
  }>;
}
