import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChronometryService } from './chronometry.service';
import { ChronoDayLogDto } from './dto/chronometry.dto';

@ApiTags('Chronometry')
@ApiCookieAuth('accessToken')
@Controller('chronometry')
@UseGuards(JwtAuthGuard)
export class ChronometryController {
  constructor(private readonly chronometryService: ChronometryService) {}

  @Get()
  @ApiOperation({
    summary: 'Получить все записи хронометража',
    description: 'Возвращает все дневные записи хронометража текущего пользователя.',
  })
  @ApiResponse({ status: 200, description: 'Список дневных записей хронометража' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  getAll(@Request() req: { user: { id: string } }) {
    return this.chronometryService.getAll(req.user.id);
  }

  @Post('save-all')
  @ApiOperation({
    summary: 'Сохранить хронометраж',
    description:
      'Массовое сохранение дневных записей хронометража. Существующие записи обновляются, новые — создаются.',
  })
  @ApiBody({ type: [ChronoDayLogDto], description: 'Массив дневных записей хронометража' })
  @ApiResponse({ status: 201, description: 'Записи сохранены' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  saveAll(
    @Request() req: { user: { id: string } },
    @Body() body: ChronoDayLogDto[],
  ) {
    return this.chronometryService.saveAll(req.user.id, body);
  }
}
