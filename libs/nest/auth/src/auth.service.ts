import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateRefreshTokenDto, DeleteRefreshTokenDto, RefreshTokenService } from '@libs/nest/refresh-token';
import { AuthRequest } from '@libs/nest/shared/interfaces';
import { verifyHash } from '@libs/nest/shared/utils';
import { UserService } from '@libs/nest/user';
import { TokenType } from '@libs/shared/enums';
import { DtoFactory } from '@libs/shared/factories';
import { AppConfigService } from './configs';
import { AuthResult } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  public async validateUser(username: string, password: string): Promise<AuthRequest['user'] | null> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isPasswordValid = await verifyHash(password, user.password);
      if (isPasswordValid) {
        return { id: user.id };
      }
    }
    return null;
  }

  public async validateRefreshToken(
    userId: string,
    deviceId: string,
    token: string,
  ): Promise<AuthRequest['user'] | null> {
    const refreshToken = await this.refreshTokenService.findOneBy({
      userId,
      deviceId,
    });
    if (!refreshToken || !(await verifyHash(token, refreshToken.token))) {
      throw new ForbiddenException();
    }
    return null;
  }

  public async login(user: AuthRequest['user'], deviceId: string): Promise<AuthResult> {
    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, deviceId, tokens.refreshToken);
    return {
      type: TokenType.Bearer,
      expiresIn: this.getExpirationIn(tokens.accessToken),
      ...tokens,
    };
  }

  public async logout(userId: string, deviceId?: string): Promise<void> {
    const deleteRefreshTokenDto = DtoFactory.create(DeleteRefreshTokenDto, {
      userId,
    });
    if (deviceId) {
      deleteRefreshTokenDto.deviceId = deviceId;
    }
    await this.refreshTokenService.deleteMany(deleteRefreshTokenDto);
  }

  private async generateTokens(user: AuthRequest['user']): Promise<Pick<AuthResult, 'accessToken' | 'refreshToken'>> {
    const payload = { sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.appConfigService.accessTokenJwtSecret,
      expiresIn: this.appConfigService.accessTokenExpirationTime,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.appConfigService.refreshTokenJwtSecret,
      expiresIn: this.appConfigService.refreshTokenExpirationTime,
    });
    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, deviceId: string, refreshToken: string) {
    await this.refreshTokenService.deleteMany(
      DtoFactory.create(DeleteRefreshTokenDto, {
        userId,
        deviceId,
      }),
    );
    await this.refreshTokenService.create(
      DtoFactory.create(CreateRefreshTokenDto, {
        token: refreshToken,
        userId,
        deviceId,
        expiresAt: this.getExpiresAt(refreshToken),
      }),
    );
  }

  private deserializeToken(token: string): {
    sub: string;
    exp: number;
    iat: number;
    [key: string]: unknown;
  } {
    return this.jwtService.decode(token) as {
      sub: string;
      exp: number;
      iat: number;
      [key: string]: unknown;
    };
  }

  private getExpirationIn(token: string): number {
    const payload = this.deserializeToken(token);
    return (payload.exp - payload.iat) * 1000;
  }

  private getExpiresAt(token: string): Date {
    const payload = this.deserializeToken(token);
    return new Date(payload.exp * 1000);
  }
}
