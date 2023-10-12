import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_ROUTE_KEY } from '@libs/nest/shared/constants';
import { StrategyName } from '../enums';

@Injectable()
export class AccessTokenGuard extends AuthGuard(StrategyName.AccessToken) {
  constructor(private reflector: Reflector) {
    super();
  }

  public override canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
