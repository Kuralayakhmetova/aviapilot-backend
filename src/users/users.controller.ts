import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiCookieAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiCookieAuth('accessToken')
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Список всех пользователей',
    description: 'Возвращает всех зарегистрированных пользователей системы.',
  })
  @ApiResponse({ status: 200, description: 'Список пользователей' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Получить пользователя по ID',
    description: 'Возвращает данные конкретного пользователя по его UUID.',
  })
  @ApiParam({ name: 'id', description: 'UUID пользователя' })
  @ApiResponse({ status: 200, description: 'Данные пользователя' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
