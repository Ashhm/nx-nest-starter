import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { IFingerprint } from 'nestjs-fingerprint';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthRequest } from '@libs/nest/shared/interfaces';
import { AuthService } from '../auth.service';
import { AppConfigService } from '../configs';
import { StrategyName } from '../enums';
import { JwtPayload } from '../interfaces';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, StrategyName.RefreshToken) {
  constructor(
    @Inject(AppConfigService) appConfigService: AppConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfigService.refreshTokenJwtSecret,
      passReqToCallback: true,
    });
  }

  public async validate(req: Request & { fp: IFingerprint }, payload: JwtPayload): Promise<AuthRequest['user'] | null> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) {
      throw new ForbiddenException('No token provided');
    }
    const deviceId = req.fp.id;
    await this.authService.validateRefreshToken(payload.sub, deviceId, token);
    return { id: payload.sub };
  }
}
