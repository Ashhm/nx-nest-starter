import * as process from 'process';
import { registerAs } from '@nestjs/config';

export const configFactory = registerAs('transport', () => ({
  redis: {
    uri: process.env['REDIS_URI'] || 'redis://localhost:6379',
  },
  kafka: {
    clientId: process.env['KAFKA_CLIENT_ID'] || 'application',
    brokers: process.env['KAFKA_BROKERS'] ? process.env['KAFKA_BROKERS'].split(/,\s?/) : ['localhost:9094'],
    ssl: process.env['KAFKA_ENABLE_SSL'] ? process.env['KAFKA_ENABLE_SSL'] === 'true' : false,
    partitionsConsumedConcurrently: process.env['KAFKA_PARTITIONS_CONSUMED_CONCURRENTLY']
      ? parseInt(process.env['KAFKA_PARTITIONS_CONSUMED_CONCURRENTLY'], 10)
      : 5,
  },
}));
