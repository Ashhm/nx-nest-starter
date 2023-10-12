import * as process from 'process';
import { registerAs } from '@nestjs/config';
import { APP_CONFIG_TOKEN } from './app-config.constants';

export const configFactory = registerAs(APP_CONFIG_TOKEN, () => ({
  accessTokenJwtSecret: process.env['ACCESS_TOKEN_JWT_SECRET'] || 'accessTokenSecretKey',
  refreshTokenJwtSecret: process.env['REFRESH_TOKEN_JWT_SECRET'] || 'refreshTokenSecretKey',
  accessTokenExpirationTime: process.env['ACCESS_TOKEN_EXPIRATION_TIME'] || '60s',
  refreshTokenExpirationTime: process.env['REFRESH_TOKEN_EXPIRATION_TIME'] || '7d',
}));
