import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  private readonly BCRYPT_ROUNDS = 12;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ─── REGISTER ──────────────────────────────────────────────
  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();

    const exists = await this.prisma.user.findUnique({ where: { email } });

    if (exists) {
      throw new ConflictException('User already exists');
    }

    const hash = await bcrypt.hash(dto.password, this.BCRYPT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hash,
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    // ✅ передаём role явно
    return this.generateTokens(user.id, user.email, user.role, user);
  }

  // ─── LOGIN ─────────────────────────────────────────────────
  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.password);

    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User disabled');
    }

    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    // ✅ передаём role явно
    return this.generateTokens(user.id, user.email, user.role, userData);
  }

  // ─── REFRESH ───────────────────────────────────────────────
  async refresh(userId: string, email: string) {
    // ✅ достаём role из БД при refresh
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    return this.generateTokens(userId, email, user?.role ?? 'user');
  }

  // ─── TOKENS ────────────────────────────────────────────────
  private async generateTokens(
    userId: string,
    email: string,
    role: string,       // ✅ добавили обязательный параметр
    user?: any,
  ) {
    const payload: JwtPayload = {
      sub: userId,
      email,
      role,             // ✅ role теперь в JWT payload
    };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow('JWT_SECRET'),
      expiresIn: this.config.getOrThrow('JWT_ACCESS_EXPIRES'),
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
      expiresIn: this.config.getOrThrow('JWT_REFRESH_EXPIRES'),
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
