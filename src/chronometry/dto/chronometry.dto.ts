import { IsString, IsOptional, IsInt, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChronoRowDto {
  @ApiPropertyOptional({ description: 'ID записи (при обновлении)' })
  @IsString() @IsOptional() id?: string;

  @ApiProperty({ example: 1, description: 'Порядковый номер строки' })
  @IsInt() num: number;

  @ApiPropertyOptional({ example: 'B737', description: 'Тип ВС' })
  @IsString() @IsOptional() acType?: string;

  @ApiPropertyOptional({ example: 'UP-B3701', description: 'Регистрационный номер ВС' })
  @IsString() @IsOptional() acReg?: string;

  @ApiPropertyOptional({ example: '0042', description: 'Номер командира' })
  @IsString() @IsOptional() commanderNum?: string;

  @ApiPropertyOptional({ example: 'Джаксыбеков А.', description: 'ФИО командира' })
  @IsString() @IsOptional() commander?: string;

  @ApiPropertyOptional({ example: 'Иванов В.', description: 'Состав экипажа' })
  @IsString() @IsOptional() crew?: string;

  @ApiPropertyOptional({ example: 'УТП-14', description: 'Номер упражнения' })
  @IsString() @IsOptional() exerciseNum?: string;

  @ApiPropertyOptional({ example: '08', description: 'Час взлёта' })
  @IsString() @IsOptional() takeoffH?: string;

  @ApiPropertyOptional({ example: '30', description: 'Минута взлёта' })
  @IsString() @IsOptional() takeoffM?: string;

  @ApiPropertyOptional({ example: '10', description: 'Час посадки' })
  @IsString() @IsOptional() landingH?: string;

  @ApiPropertyOptional({ example: '15', description: 'Минута посадки' })
  @IsString() @IsOptional() landingM?: string;

  @ApiPropertyOptional({ example: '01', description: 'Часы налёта' })
  @IsString() @IsOptional() flightH?: string;

  @ApiPropertyOptional({ example: '45', description: 'Минуты налёта' })
  @IsString() @IsOptional() flightM?: string;

  @ApiPropertyOptional({ example: '01', description: 'КМЗ итого часы' })
  @IsString() @IsOptional() kmzTotalH?: string;

  @ApiPropertyOptional({ example: '45', description: 'КМЗ итого минуты' })
  @IsString() @IsOptional() kmzTotalM?: string;

  @ApiPropertyOptional({ example: '00', description: 'КМЗ в облаках часы' })
  @IsString() @IsOptional() kmzCloudsH?: string;

  @ApiPropertyOptional({ example: '30', description: 'КМЗ в облаках минуты' })
  @IsString() @IsOptional() kmzCloudsM?: string;

  @ApiPropertyOptional({ example: '1', description: 'Количество посадок' })
  @IsString() @IsOptional() landingsCount?: string;

  @ApiPropertyOptional({ example: '0', description: 'Количество касаний' })
  @IsString() @IsOptional() touchdownCount?: string;

  @ApiPropertyOptional({ example: '00', description: 'Закрытая кабина часы' })
  @IsString() @IsOptional() closedCabinH?: string;

  @ApiPropertyOptional({ example: '00', description: 'Закрытая кабина минуты' })
  @IsString() @IsOptional() closedCabinM?: string;

  @ApiPropertyOptional({ example: 'ПМУ', description: 'Метеоусловия' })
  @IsString() @IsOptional() weather?: string;
}

export class ChronoDayLogDto {
  @ApiPropertyOptional({ description: 'ID дневной записи (при обновлении)' })
  @IsString() @IsOptional() id?: string;

  @ApiProperty({ example: '2024-06-15', description: 'Дата (ISO 8601)' })
  @IsString() date: string;

  @ApiPropertyOptional({ example: '1-я АЭ', description: 'Авиационная единица / позывной' })
  @IsString() @IsOptional() unit?: string;

  @ApiProperty({ type: [ChronoRowDto], description: 'Строки хронометража за день' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChronoRowDto)
  rows: ChronoRowDto[];
}
