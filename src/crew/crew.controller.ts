import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CrewService } from './crew.service';
import { CreateCrewDto } from './dto/create-crew.dto';
import { UpdateCrewDto } from './dto/update-crew.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, UserRole } from '../auth/decorators/roles.decorator';
@Controller('crew')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CrewController {
  constructor(private readonly crewService: CrewService) {}

  // ✅ Все авторизованные — просмотр списка
  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: 'ASC' | 'DESC',
  ) {
    return this.crewService.findAll({
      search,
      category,
      status,
      sortBy,
      order,
    });
  }

  // ✅ Все авторизованные — просмотр одного
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.crewService.findOne(id);
  }

  // 🔒 Только admin — создание
  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCrewDto) {
    return this.crewService.create(dto);
  }

  // 🔒 Только admin — редактирование
  @Put(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCrewDto,
  ) {
    return this.crewService.update(id, dto);
  }

  // 🔒 Только admin — удаление
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.crewService.remove(id);
  }
}
