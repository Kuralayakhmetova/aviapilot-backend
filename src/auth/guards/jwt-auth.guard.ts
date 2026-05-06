import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, user: TUser, info: any): TUser {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          info?.message === 'jwt expired'
            ? 'Токен истёк'
            : 'Необходима авторизация',
        )
      );
    }
    return user;
  }
}

// Guard для refresh-эндпоинта
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, user: TUser, info: any): TUser {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          info?.message === 'jwt expired'
            ? 'Refresh-токен истёк, войдите заново'
            : 'Невалидный refresh-токен',
        )
      );
    }
    return user;
  }
}
