import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Req, UseGuards,
  HttpCode, HttpStatus, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { TrainingFlightService } from './training-flight.service';
import { CreateTrainingFlightDto } from './dto/create-training-flight.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends Request {
  user: { id: string; email: string; role: string };
}

@Controller('training-flights')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class TrainingFlightController {
  constructor(private readonly service: TrainingFlightService) {}

  @Get()
  findAll(@Req() req: AuthRequest) {
    return this.service.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.service.findOne(id, req.user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateTrainingFlightDto, @Req() req: AuthRequest) {
    return this.service.create(req.user.id, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateTrainingFlightDto>,
    @Req() req: AuthRequest,
  ) {
    return this.service.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.service.remove(id, req.user.id);
  }
}
