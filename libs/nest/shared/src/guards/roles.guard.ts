import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@libs/shared/enums';
import { Roles } from '../decorators';
import { AuthRequest } from '../interfaces';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRole[]>(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request: AuthRequest = context.switchToHttp().getRequest();
    const user = request.user;
    return this.matchRoles(roles, user.role);
  }

  private matchRoles(roles: UserRole[], userRole: UserRole): boolean {
    return roles.includes(userRole);
  }
}
