import * as process from 'process';
import { registerAs } from '@nestjs/config';
import { APP_CONFIG_TOKEN } from './app-config.constants';

export const configFactory = registerAs(APP_CONFIG_TOKEN, () => ({
  port: process.env.PORT || 3000,

  loggerLevel: process.env.LOGGER_LEVEL || 'info',
  loggerTransport: process.env.LOGGER_TRANSPORT,
}));
