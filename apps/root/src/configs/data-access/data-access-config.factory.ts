import { registerAs } from '@nestjs/config';
import { DATA_ACCESS_CONFIG_TOKEN } from './data-access-config.constants';

export const configFactory = registerAs(DATA_ACCESS_CONFIG_TOKEN, () => ({
  mongodb: {
    uri: process.env['MONGODB_URI'] || 'mongodb://localhost/example',
  },
  redis: {
    uri: process.env['REDIS_URI'] || 'redis://localhost:6379',
  },
}));
