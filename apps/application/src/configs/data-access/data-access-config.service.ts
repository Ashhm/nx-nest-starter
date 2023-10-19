import { type SharedBullConfigurationFactory } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { getConfigToken } from '@nestjs/config';
import { type MongooseModuleOptions, type MongooseOptionsFactory } from '@nestjs/mongoose';
import * as Bull from 'bullmq';
import { DATA_ACCESS_CONFIG_TOKEN } from './data-access-config.constants';
import { type configFactory } from './data-access-config.factory';

@Injectable()
export class DataAccessConfigService implements MongooseOptionsFactory, SharedBullConfigurationFactory {
  constructor(
    @Inject(getConfigToken(DATA_ACCESS_CONFIG_TOKEN))
    private readonly config: ReturnType<typeof configFactory>,
  ) {}

  public createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.config.mongodb.uri,
    };
  }

  public createSharedConfiguration(): Bull.QueueOptions {
    const url = new URL(this.config.redis.uri);
    return {
      connection: {
        host: url.hostname,
        port: Number(url.port),
      },
    };
  }
}
