import {
  IsString, IsOptional, IsNumber, IsBoolean,
  IsArray, IsIn, Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer'; // ← добавь Transform

export class CreateTrainingFlightDto {
  @IsString()
  flightNumber: string;

  @IsString()
  callSign: string;

  @IsString()
  acType: string;

  @IsString()
  acReg: string;

  @IsOptional()
  @IsIn(['DAY', 'NIGHT'])
  timeOfDay?: string;

  // ─── Экипаж ───────────────────────────────────────────────────────────────
  @IsOptional() @IsString()
  leftSeatCrewId?: string;

  @IsOptional() @IsIn(['КВС', 'ЛИ'])
  leftSeatPos?: string;

  @IsOptional() @IsString()
  leftSeatName?: string;

  @IsOptional() @IsString()
  rightSeatCrewId?: string;

  @IsOptional() @IsIn(['ВП', 'ЛИ'])
  rightSeatPos?: string;

  @IsOptional() @IsString()
  rightSeatName?: string;

  @IsOptional() @IsIn(['LEFT', 'RIGHT'])
  landingSeatPos?: string;

  // ─── Массивы ID (фильтруем null/undefined/числа) ─────────────────────────
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.filter((v: any) => v != null && v !== '').map(String)
      : [],
  )
  attendantIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.filter((v: any) => v != null && v !== '').map(String)
      : [],
  )
  engineerIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.filter((v: any) => v != null && v !== '').map(String)
      : [],
  )
  technicianIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.filter((v: any) => v != null && v !== '').map(String)
      : [],
  )
  mechanicIds?: string[];

  // ─── Массивы имён ─────────────────────────────────────────────────────────
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.filter((v: any) => v != null).map(String)
      : [],
  )
  attendantNames?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.filter((v: any) => v != null).map(String)
      : [],
  )
  engineerNames?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.filter((v: any) => v != null).map(String)
      : [],
  )
  technicianNames?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.filter((v: any) => v != null).map(String)
      : [],
  )
  mechanicNames?: string[];

  // ─── Задание ──────────────────────────────────────────────────────────────
  @IsOptional() @IsString()
  exerciseNumber?: string;

  // ─── Время ────────────────────────────────────────────────────────────────
  @IsString()
  takeoffDate: string;

  @IsString()
  takeoffTime: string;

  @IsString()
  landingDate: string;

  @IsString()
  landingTime: string;

  // ─── Спецналёт ────────────────────────────────────────────────────────────
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0)
  closedCabinTime?: number;

  @IsOptional() @Type(() => Number) @IsNumber() @Min(0)
  smuTotal?: number;

  @IsOptional() @Type(() => Number) @IsNumber() @Min(0)
  smuClouds?: number;

  // ─── Высота ───────────────────────────────────────────────────────────────
  @IsOptional() @Type(() => Number) @IsNumber()
  altMax?: number;

  @IsOptional() @Type(() => Number) @IsNumber()
  altMin?: number;

  // ─── Метео ────────────────────────────────────────────────────────────────
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0)
  visibility?: number;

  @IsOptional() @Type(() => Number) @IsNumber() @Min(0)
  cloudiness?: number;

  @IsOptional() @Type(() => Number) @IsNumber()
  cloudTop?: number;

  @IsOptional() @Type(() => Number) @IsNumber()
  cloudBase?: number;

  @IsOptional() @IsBoolean()
  takeoffMinimum?: boolean;

  // ─── Способ управления ────────────────────────────────────────────────────
  @IsOptional() @IsBoolean() approachRmsA?: boolean;
  @IsOptional() @IsBoolean() approachRmsD?: boolean;
  @IsOptional() @IsBoolean() approachRmsR?: boolean;
  @IsOptional() @IsBoolean() approachViz?:  boolean;

  // ─── Посадки ──────────────────────────────────────────────────────────────
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0)
  approachCount?: number;

  @IsOptional() @Type(() => Number) @IsNumber() @Min(0)
  landingsCount?: number;

  @IsOptional() @IsString()
  remarks?: string;
}
