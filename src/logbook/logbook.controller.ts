import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards, Req,
} from '@nestjs/common';
import {
  ApiTags, ApiCookieAuth, ApiOperation, ApiResponse, ApiParam,
} from '@nestjs/swagger';
import { LogbookService } from './logbook.service';
import { CreateLogbookEntryDto } from './dto/create-logbook-entry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends Request {
  user: { id: string; email?: string; role?: string };
}

@ApiTags('Logbook')
@ApiCookieAuth('accessToken')
@UseGuards(JwtAuthGuard)
@Controller('logbook')
export class LogbookController {
  constructor(private readonly logbookService: LogbookService) {}

  @Get()
  @ApiOperation({
    summary: 'Список записей лётной книжки',
    description: 'Возвращает все записи текущего авторизованного пользователя.',
  })
  @ApiResponse({ status: 200, description: 'Список записей' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async findAll(@Req() req: AuthRequest) {
    console.log('📋 Getting all logbook entries for user:', req.user.id);
    const entries = await this.logbookService.findAll(req.user.id);
    console.log('✅ Entries fetched:', entries.length);
    return entries;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Получить запись по ID',
    description: 'Возвращает запись лётной книжки. Доступ только к своим записям.',
  })
  @ApiParam({ name: 'id', description: 'UUID записи' })
  @ApiResponse({ status: 200, description: 'Данные записи' })
  @ApiResponse({ status: 404, description: 'Запись не найдена' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    console.log('🔍 Getting logbook entry:', id, 'for user:', req.user.id);
    const entry = await this.logbookService.findOne(id, req.user.id);
    console.log('✅ Entry found:', entry);
    return entry;
  }

  @Post()
  @ApiOperation({
    summary: 'Создать запись в лётной книжке',
    description: 'Добавляет новую запись о полёте для текущего пользователя.',
  })
  @ApiResponse({ status: 201, description: 'Запись создана' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async create(@Req() req: AuthRequest, @Body() dto: CreateLogbookEntryDto) {
    console.log('📝 Creating logbook entry for user:', req.user.id);
    console.log('📦 Entry data:', dto);
    const entry = await this.logbookService.create(req.user.id, dto);
    console.log('✅ Entry created successfully:', entry);
    return entry;
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Обновить запись',
    description: 'Частичное обновление записи лётной книжки (только свои записи).',
  })
  @ApiParam({ name: 'id', description: 'UUID записи' })
  @ApiResponse({ status: 200, description: 'Запись обновлена' })
  @ApiResponse({ status: 404, description: 'Запись не найдена' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async update(
    @Param('id') id: string,
    @Req() req: AuthRequest,
    @Body() dto: Partial<CreateLogbookEntryDto>,
  ) {
    console.log('✏️ Updating logbook entry:', id, 'for user:', req.user.id);
    console.log('📦 Update data:', dto);
    const updated = await this.logbookService.update(id, req.user.id, dto);
    console.log('✅ Entry updated successfully:', updated);
    return updated;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Удалить запись',
    description: 'Удаляет запись лётной книжки (только свои записи).',
  })
  @ApiParam({ name: 'id', description: 'UUID записи' })
  @ApiResponse({ status: 200, description: 'Запись удалена' })
  @ApiResponse({ status: 404, description: 'Запись не найдена' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async remove(@Param('id') id: string, @Req() req: AuthRequest) {
    console.log('🗑️ Deleting logbook entry:', id, 'for user:', req.user.id);
    const result = await this.logbookService.remove(id, req.user.id);
    console.log('✅ Entry deleted successfully');
    return { message: 'Запись успешно удалена', ...result };
  }
}
