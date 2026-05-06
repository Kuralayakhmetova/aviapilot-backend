import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'pilot@aviapilot.kz',
    description: 'Email пользователя',
  })
  @IsEmail({}, { message: 'Некорректный формат email' })
  email: string;

  @ApiProperty({
    example: 'MyPass123!',
    description: 'Пароль (минимум 8 символов)',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Пароль — минимум 8 символов' })
  password: string;
}
