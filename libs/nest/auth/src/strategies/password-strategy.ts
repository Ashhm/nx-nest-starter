import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthRequest } from '@libs/nest/shared/interfaces';
import { AuthService } from '../auth.service';
import { StrategyName } from '../enums';

@Injectable()
export class PasswordStrategy extends PassportStrategy(Strategy, StrategyName.Password) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  public async validate(username: string, password: string): Promise<AuthRequest['user'] | null> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
