import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'pilot@aviapilot.kz',
    description: 'Email пользователя',
  })
  @IsEmail({}, { message: 'Некорректный формат email' })
  email: string;

  @ApiProperty({
    example: 'Алибек',
    description: 'Имя пользователя (2–50 символов)',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'Имя обязательно' })
  @MinLength(2, { message: 'Имя — минимум 2 символа' })
  @MaxLength(50, { message: 'Имя — максимум 50 символов' })
  firstName: string;

  @ApiProperty({
    example: 'Джаксыбеков',
    description: 'Фамилия пользователя (2–50 символов)',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'Фамилия обязательна' })
  @MinLength(2, { message: 'Фамилия — минимум 2 символа' })
  @MaxLength(50, { message: 'Фамилия — максимум 50 символов' })
  lastName: string;

  @ApiProperty({
    example: 'MyPass123!',
    description:
      'Пароль: 8–72 символа, строчная, заглавная буква, цифра и спецсимвол',
    minLength: 8,
    maxLength: 72,
  })
  @IsString()
  @MinLength(8, { message: 'Пароль — минимум 8 символов' })
  @MaxLength(72, { message: 'Пароль — максимум 72 символа' })
  @Matches(/(?=.*[a-z])/, { message: 'Нужна строчная буква' })
  @Matches(/(?=.*[A-Z])/, { message: 'Нужна заглавная буква' })
  @Matches(/(?=.*\d)/, { message: 'Нужна цифра' })
  @Matches(/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, {
    message: 'Нужен спецсимвол',
  })
  password: string;
}
