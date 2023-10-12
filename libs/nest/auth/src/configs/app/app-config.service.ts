import { Inject } from '@nestjs/common';
import { getConfigToken } from '@nestjs/config';
import { APP_CONFIG_TOKEN } from './app-config.constants';
import { configFactory } from './app-config.factory';

export class AppConfigService {
  constructor(
    @Inject(getConfigToken(APP_CONFIG_TOKEN))
    private readonly config: ReturnType<typeof configFactory>,
  ) {}

  get accessTokenJwtSecret(): string {
    return this.config.accessTokenJwtSecret;
  }

  get refreshTokenJwtSecret(): string {
    return this.config.refreshTokenJwtSecret;
  }

  get accessTokenExpirationTime(): string {
    return this.config.accessTokenExpirationTime;
  }

  get refreshTokenExpirationTime(): string {
    return this.config.refreshTokenExpirationTime;
  }
}
