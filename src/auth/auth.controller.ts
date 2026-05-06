import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiBody,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard, JwtRefreshGuard } from './guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

@ApiTags('Auth')
@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class AuthController {
  private readonly IS_PRODUCTION: boolean;
  private readonly REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
  private readonly ACCESS_MAX_AGE = 15 * 60 * 1000;

  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    this.IS_PRODUCTION = this.config.get('NODE_ENV') === 'production';
  }

  // ─── REGISTER ──────────────────────────────────────────────
  @Post('register')
  @ApiOperation({
    summary: 'Регистрация пользователя',
    description:
      'Создаёт нового пользователя. Устанавливает `accessToken` (15 мин) и `refreshToken` (7 дней) в httpOnly cookies.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
    schema: {
      example: {
        success: true,
        user: { id: 'uuid', email: 'pilot@aviapilot.kz', firstName: 'Алибек', lastName: 'Джаксыбеков' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Ошибка валидации / email уже занят' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.register(dto);
    this.setAuthCookies(res, accessToken, refreshToken);
    return { success: true, user };
  }

  // ─── LOGIN ─────────────────────────────────────────────────
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Авторизация',
    description:
      'Проверяет email/пароль. При успехе устанавливает `accessToken` и `refreshToken` в httpOnly cookies.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Успешная авторизация',
    schema: {
      example: {
        success: true,
        user: { id: 'uuid', email: 'pilot@aviapilot.kz' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Неверный email или пароль' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.login(dto);
    this.setAuthCookies(res, accessToken, refreshToken);
    return { success: true, user };
  }

  // ─── REFRESH ───────────────────────────────────────────────
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Обновление токенов',
    description:
      'Принимает `refreshToken` из cookie, возвращает новую пару токенов. Старые cookies перезаписываются.',
  })
  @ApiResponse({
    status: 201,
    description: 'Токены обновлены',
    schema: {
      example: { success: true, accessToken: 'eyJhbGci...' },
    },
  })
  @ApiResponse({ status: 401, description: 'refreshToken отсутствует или истёк' })
  async refresh(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.refresh(
      req.user.id,
      req.user.email,
    );
    this.setAuthCookies(res, accessToken, refreshToken);
    return { success: true, accessToken };
  }

  // ─── LOGOUT ────────────────────────────────────────────────
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Выход из системы',
    description: 'Очищает `accessToken` и `refreshToken` cookies.',
  })
  @ApiResponse({
    status: 200,
    description: 'Выход выполнен',
    schema: { example: { success: true } },
  })
  async logout(@Res({ passthrough: true }) res: Response) {
    this.clearCookies(res);
    return { success: true };
  }

  // ─── PROFILE ───────────────────────────────────────────────
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Профиль текущего пользователя',
    description: 'Возвращает данные пользователя из JWT payload. Требует валидный `accessToken` в cookie.',
  })
  @ApiResponse({
    status: 200,
    description: 'Данные профиля',
    schema: {
      example: {
        success: true,
        user: { id: 'uuid', email: 'pilot@aviapilot.kz' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async profile(@Req() req: AuthenticatedRequest) {
    return { success: true, user: req.user };
  }

  // ─── COOKIE HELPERS ────────────────────────────────────────
  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: this.IS_PRODUCTION,
      sameSite: 'strict',
      path: '/',
      maxAge: this.ACCESS_MAX_AGE,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.IS_PRODUCTION,
      sameSite: 'strict',
      path: '/',
      maxAge: this.REFRESH_MAX_AGE,
    });
  }

  private clearCookies(res: Response) {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
  }
}
