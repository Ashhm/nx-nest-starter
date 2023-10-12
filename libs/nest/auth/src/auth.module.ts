import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { NestjsFingerprintModule as FingerprintModule } from 'nestjs-fingerprint';
import { RefreshTokenModule } from '@libs/nest/refresh-token';
import { UserModule } from '@libs/nest/user';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppConfigModule, AppConfigService } from './configs';
import { AccessTokenStrategy, PasswordStrategy } from './strategies';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [
    AppConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: async (appConfigService) => ({
        secret: appConfigService.accessTokenJwtSecret,
        signOptions: { expiresIn: appConfigService.accessTokenJwtSecret },
      }),
      inject: [AppConfigService],
    }),
    FingerprintModule.forRoot({
      params: ['userAgent'],
    }),
    UserModule,
    RefreshTokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordStrategy, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [],
})
export class AuthModule {}
