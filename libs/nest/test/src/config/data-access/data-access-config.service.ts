import { Inject, Injectable } from '@nestjs/common';
import { getConfigToken } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import { DATA_ACCESS_CONFIG_TOKEN } from './data-access-config.constants';
import { configFactory } from './data-access-config.factory';

@Injectable()
export class DataAccessConfigService implements MongooseOptionsFactory {
  constructor(
    @Inject(getConfigToken(DATA_ACCESS_CONFIG_TOKEN))
    private readonly config: ReturnType<typeof configFactory>,
  ) {}

  public createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.config.mongodb.uri,
    };
  }
}
