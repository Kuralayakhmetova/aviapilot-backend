import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLogbookEntryDto {
  @ApiProperty({ example: 'B737', description: 'Тип воздушного судна' })
  @IsString()
  acType: string;

  @ApiProperty({ example: 'UP-B3701', description: 'Регистрационный номер ВС' })
  @IsString()
  acReg: string;

  @ApiProperty({ example: '2024-06-15', description: 'Дата вылета (ISO 8601)' })
  @IsDateString()
  date: string;

    @ApiPropertyOptional({
    example: '2024-06-16',
    description: 'Дата прилёта (ISO 8601). Указывается только если отличается от даты вылета (ночной перелёт)',
  })
  @IsOptional()
  @IsDateString()
  arrDate?: string;

  @ApiProperty({ example: 'UAAA', description: 'ICAO-код аэропорта вылета' })
  @IsString()
  depIcao: string;

  @ApiProperty({ example: 'UACC', description: 'ICAO-код аэропорта прилёта' })
  @IsString()
  arrIcao: string;

  @ApiProperty({ example: '08:30', description: 'Время вылета (HH:MM)' })
  @IsString()
  depTime: string;

  @ApiProperty({ example: '10:15', description: 'Время посадки (HH:MM)' })
  @IsString()
  arrTime: string;

  // ─── НАЛЁТ ──────────────────────────────────────────────────────────────────

  @ApiProperty({ example: 105, description: 'Общий налёт в минутах' })
  @Type(() => Number)
  @IsNumber()
  totalTime: number;

  @ApiPropertyOptional({ example: 105, description: 'Налёт КВС (PIC) в минутах' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  picTime?: number;

  @ApiPropertyOptional({ example: 0, description: 'Налёт второго пилота (SIC) в минутах' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  sicTime?: number;

  @ApiPropertyOptional({ example: 30, description: 'Ночной налёт в минутах' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  nightTime?: number;

  @ApiPropertyOptional({ example: 45, description: 'Налёт по приборам (IFR) в минутах' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  ifrTime?: number;

  @ApiPropertyOptional({ example: 20, description: 'Фактический IMC в минутах' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  actualImc?: number;

  @ApiPropertyOptional({ example: 0, description: 'Тренажёр по приборам в минутах' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  simInstrument?: number;

  // ─── ЭКИПАЖ ─────────────────────────────────────────────────────────────────

  @ApiProperty({ example: 'КВС', description: 'Должность пилота левого кресла' })
  @IsString()
  leftSeatPos: string;

  @ApiProperty({ example: 'Иванов И.', description: 'ФИО пилота левого кресла' })
  @IsString()
  leftSeatPerson: string;

  @ApiPropertyOptional({ example: '12345', description: 'ID пилота левого кресла' })
  @IsOptional()
  @IsString()
  leftSeatCrewId?: string;  // Добавьте это свойство в DTO

  @ApiProperty({ example: 'Второй пилот', description: 'Должность пилота правого кресла' })
  @IsString()
  rightSeatPos: string;

  @ApiPropertyOptional({ example: '67890', description: 'ID пилота правого кресла' })
  @IsOptional()
  @IsString()
  rightSeatCrewId?: string;  // Добавьте это свойство в DTO

  

  @ApiProperty({ example: 'Иванов В.', description: 'ФИО пилота правого кресла' })
  @IsString()
  rightSeatPerson: string;

 

  @ApiPropertyOptional({ example: ['Петрова А.', 'Сидорова Н.'], description: 'Бортпроводники' })
  @IsOptional()
  @IsArray()
  flightAttendants?: string[];

  @ApiPropertyOptional({ example: [], description: 'Бортинженеры' })
  @IsOptional()
  @IsArray()
  engineers?: string[];

  @ApiPropertyOptional({ example: [], description: 'Техники' })
  @IsOptional()
  @IsArray()
  technicians?: string[];

  @ApiPropertyOptional({ example: [], description: 'Механики' })
  @IsOptional()
  @IsArray()
  mechanics?: string[];

  // ─── ЗАДАНИЕ ─────────────────────────────────────────────────────────────────

  @ApiPropertyOptional({ example: 'УТП-14', description: 'Номер упражнения по программе' })
  @IsOptional()
  @IsString()
  exerciseNumber?: string;

  // ─── МЕТЕОУСЛОВИЯ ────────────────────────────────────────────────────────────

  @ApiPropertyOptional({ example: 9500, description: 'Максимальная высота полёта (м)' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  maxAltitude?: number;

  @ApiPropertyOptional({ example: 300, description: 'Минимальная высота (м)' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  minAltitude?: number;

  @ApiPropertyOptional({ example: 4, description: 'Облачность (баллы, 0–8)' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  cloudiness?: number;

  @ApiPropertyOptional({ example: 1200, description: 'Нижняя граница облачности (м)' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  cloudBase?: number;

  @ApiPropertyOptional({ example: 3500, description: 'Верхняя граница облачности (м)' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  cloudTop?: number;

  @ApiPropertyOptional({ example: 8000, description: 'Видимость (м)' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  visibility?: number;

  @ApiPropertyOptional({ example: 'ILS', description: 'Тип захода на посадку' })
  @IsOptional()
  @IsString()
  approachType?: string;

  // ─── ПОСАДКИ ─────────────────────────────────────────────────────────────────

  @ApiProperty({ example: 1, description: 'Количество посадок днём' })
  @Type(() => Number)
  @IsNumber()
  landingsDay: number;

  @ApiProperty({ example: 0, description: 'Количество посадок ночью' })
  @Type(() => Number)
  @IsNumber()
  landingsNight: number;

  // ─── ГРУЗ/ПАССАЖИРЫ ──────────────────────────────────────────────────────────

  @ApiPropertyOptional({ example: 120, description: 'Количество пассажиров' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  passengers?: number;

  @ApiPropertyOptional({ example: 2500, description: 'Масса груза (кг)' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  cargo?: number;

  // ─── КЛАССИФИКАЦИЯ ───────────────────────────────────────────────────────────

  @ApiProperty({ example: 'Рейсовый', description: 'Тип операции' })
  @IsString()
  operationType: string;

  @ApiProperty({ example: 'КВС', description: 'Роль пилота в полёте' })
  @IsString()
  role: string;

  @ApiProperty({ example: 'IFR', description: 'Правила полёта (IFR / VFR)' })
  @IsString()
  rules: string;

  @ApiPropertyOptional({ example: 'APPROVED', description: 'Статус записи' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: true, description: 'Маршрутный полёт (cross-country)' })
  @IsOptional()
  @IsBoolean()
  crossCountry?: boolean;

  @ApiPropertyOptional({ example: 'Плановый полёт, нарушений нет', description: 'Примечания' })
  @IsOptional()
  @IsString()
  remarks?: string;
}
