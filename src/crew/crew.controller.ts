import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
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

  // ───────────────────────── LIST ─────────────────────────
  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: 'asc' | 'desc',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.crewService.findAll({
      search,
      category,
      status,
      sortBy,
      order,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
  }

  // ───────────────────────── ONE ─────────────────────────
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.crewService.findOne(id);
  }

  // ───────────────────────── CREATE ─────────────────────────
  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCrewDto) {
    return this.crewService.create(dto);
  }

  // ───────────────────────── UPDATE ─────────────────────────
  @Put(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCrewDto,
  ) {
    return this.crewService.update(id, dto);
  }

  // ───────────────────────── DELETE ─────────────────────────
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.crewService.remove(id);
  }
}