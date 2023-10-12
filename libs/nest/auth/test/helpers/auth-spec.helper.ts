import { INestApplication } from '@nestjs/common';
import { RefreshTokenService } from '@libs/nest/refresh-token';
import { User } from '@libs/shared/interfaces';
import { BaseSpecHelper } from '@libs/test/helpers';
import { AuthService } from '../../src/auth.service';

type Context = { user: User };

export class AuthSpecHelper extends BaseSpecHelper<Context> {
  protected app: INestApplication;

  public authService: AuthService;

  public refreshTokenService: RefreshTokenService;

  public clearRefreshTokens(userId: string) {
    return this.refreshTokenService.deleteMany({
      userId,
    });
  }

  public clearAll(context: Context) {
    afterAll(async () => {
      await this.refreshTokenService.deleteMany({ userId: context.user.id });
    });
  }

  public override init() {
    this.authService = this.app.get(AuthService);
    this.refreshTokenService = this.app.get(RefreshTokenService);
  }
}
