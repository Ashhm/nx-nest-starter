import * as process from 'process';
import { registerAs } from '@nestjs/config';
import { APP_CONFIG_TOKEN } from './app-config.constants';

export const configFactory = registerAs(APP_CONFIG_TOKEN, () => ({
  saltRounds: process.env['SALT_ROUNDS'] ? parseInt(process.env['SALT_ROUNDS'], 10) : 10,
  passwordMinLength: process.env['PASSWORD_MIN_LENGTH'] ? parseInt(process.env['PASSWORD_MIN_LENGTH']) : 8,
  passwordMaxLength: process.env['PASSWORD_MAX_LENGTH'] ? parseInt(process.env['PASSWORD_MAX_LENGTH']) : 20,
}));
