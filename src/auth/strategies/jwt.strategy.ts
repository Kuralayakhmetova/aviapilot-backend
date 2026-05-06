import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

export interface JwtPayload {
  sub: string;
  email: string;
   role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
  jwtFromRequest: ExtractJwt.fromExtractors([
    // 1. Сначала пробуем cookie
    (req: Request) => req?.cookies?.accessToken ?? null,
    // 2. Потом Bearer заголовок
    ExtractJwt.fromAuthHeaderAsBearerToken(),
  ]),
  ignoreExpiration: false,
  secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
});
  }

  async validate(payload: JwtPayload) {
   console.log('=== JWT validate called ===');
  console.log('payload:', payload);
  
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Пользователь не найден');
    }
 
  console.log('found user:', user?.email, user?.role);
    return user;
  }
}