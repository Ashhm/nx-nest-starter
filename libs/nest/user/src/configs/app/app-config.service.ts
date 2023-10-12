import { Inject } from '@nestjs/common';
import { getConfigToken } from '@nestjs/config';
import { APP_CONFIG_TOKEN } from './app-config.constants';
import { type configFactory } from './app-config.factory';

export class AppConfigService {
  constructor(
    @Inject(getConfigToken(APP_CONFIG_TOKEN))
    private readonly config: ReturnType<typeof configFactory>,
  ) {}

  get saltRounds(): number {
    return this.config.saltRounds;
  }

  get passwordMinLength(): number {
    return this.config.passwordMinLength;
  }

  get passwordMaxLength(): number {
    return this.config.passwordMaxLength;
  }
}
