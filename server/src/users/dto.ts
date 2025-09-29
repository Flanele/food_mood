import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Prisma } from 'generated/prisma';

export enum Sex {
  Male = 'male',
  Female = 'female',
}

export enum Diet {
  Vegetarian = 'vegetarian',
  Vegan = 'vegan',
}

export class PrefsDto {
  @IsOptional()
  @IsEnum(Diet)
  diet?: Diet;

  @IsOptional()
  @IsArray()
  @Type(() => String)
  @IsString({ each: true })
  allergies?: string[];
}

export class ProfileDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty({ enum: ['male', 'female'], nullable: true, example: 'male' })
  sex: string | null;

  @ApiProperty({
    type: String,
    format: 'date-time',
    nullable: true,
    example: '1999-05-10',
  })
  birthDate: Date | null;

  @ApiProperty({ type: Number, nullable: true, example: 187 })
  heightCm: number | null;

  @ApiProperty({ type: Number, nullable: true, example: 80 })
  weightKg: number | null;

  @ApiProperty({ type: Number, nullable: true, example: 22.9 })
  bmi: number | null;

  @ApiProperty({
    type: Object,
    nullable: true,
    example: { diet: 'vegetarian', allergies: ['nuts'] },
  })
  prefs: Prisma.JsonValue | null;
}

export class PatchProfileDTO {
  @ApiProperty({ required: false, enum: Sex })
  @IsOptional()
  @IsEnum(Sex)
  sex?: Sex;

  @ApiProperty({ required: false, example: '1999-05-10' })
  @IsOptional()
  @IsISO8601()
  birthDate?: string;

  @ApiProperty({ required: false, example: 165 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  heightCm?: number;

  @ApiProperty({ required: false, example: 57.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weightKg?: number;

  @ApiProperty({
    required: false,
    example: { diet: 'vegetarian', allergies: ['nuts'] },
  })
  @IsOptional()
  @Type(() => PrefsDto)
  @ValidateNested()
  prefs?: PrefsDto;
}
