import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthRequest } from '@libs/nest/shared/interfaces';
import { AppConfigService } from '../configs';
import { StrategyName } from '../enums';
import { JwtPayload } from '../interfaces';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, StrategyName.AccessToken) {
  constructor(@Inject(AppConfigService) appConfigService: AppConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfigService.accessTokenJwtSecret,
    });
  }

  public async validate(payload: JwtPayload): Promise<AuthRequest['user']> {
    return { id: payload.sub };
  }
}
