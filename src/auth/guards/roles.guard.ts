import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, UserRole } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest();

    console.log('=== RolesGuard ===');
    console.log('cookies:', req.cookies);
    console.log('authorization:', req.headers?.authorization);
    console.log('user:', req.user);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const user = req.user;

    if (!user) throw new ForbiddenException('Нет доступа');

    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) throw new ForbiddenException('Недостаточно прав');

    return true;
  }
}
