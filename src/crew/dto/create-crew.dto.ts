import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { CrewCategory, CrewRank } from '@prisma/client';

export class CreateCrewDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsEnum(CrewCategory)
  category?: CrewCategory;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsEnum(CrewRank)
  rank?: CrewRank;

  @IsOptional()
  @IsNumber()
  totalFlightHours?: number;

  @IsOptional()
  @IsString()
  acTypePrimary?: string;

  @IsOptional()
  @IsString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  licenseExpiry?: string;
}