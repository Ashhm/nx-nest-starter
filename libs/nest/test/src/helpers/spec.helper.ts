import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { MongooseExceptionFilter } from '@libs/nest/shared/exception-filters';
import { TransportConfigModule, TransportConfigService } from '@libs/nest/shared/transport';
import { BaseSpecHelper } from '@libs/test/helpers';
import { ConfigModule } from '../config';
import { EventCompletionInterceptor } from '../interceptors';
import { HandlerWithResolver } from '../interfaces';
import { KafkaClientService, RedisClientService, TransportClientModule } from '../transport-client';
import FunctionPropertyNames = jest.FunctionPropertyNames;

export class SpecHelper extends BaseSpecHelper {
  protected app: INestApplication;

  public httpClient: request.SuperTest<request.Test>;

  public kafkaClient: KafkaClientService;

  public redisClient: RedisClientService;

  public override init(): void {
    this.app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );

    this.app.useGlobalFilters(new MongooseExceptionFilter());
  }

  public async createApp(
    metadata: ModuleMetadata,
    {
      replyTopics = [],
    }: {
      replyTopics?: string[];
    } = {},
  ): Promise<INestApplication> {
    // Import testing module configurations
    metadata.imports = metadata.imports || [];
    metadata.imports.push(ConfigModule, TransportConfigModule, TransportClientModule.forRoot({ replyTopics }));
    metadata.providers = metadata.providers || [];
    metadata.providers.push({
      provide: APP_INTERCEPTOR,
      useClass: EventCompletionInterceptor,
    });
    // Create application
    const module = await Test.createTestingModule(metadata).compile();
    this.app = module.createNestApplication();
    this.httpClient = request(this.app.getHttpServer());
    this.init();
    return this.app;
  }

  public getCompletionPromise<T, K extends FunctionPropertyNames<T>>(object: T, methodName: K) {
    const { promise, resolver } = this.createPromiseWithResolver();
    (object[methodName] as HandlerWithResolver).resolver = resolver;
    return promise;
  }

  public async initMicroservices() {
    // Load and run microservice servers
    const transportConfigService = this.app.get(TransportConfigService);
    [Transport.KAFKA, Transport.REDIS].forEach((transport) => {
      this.app.connectMicroservice(transportConfigService.createServerOptions(transport), { inheritAppConfig: true });
    });
    await this.app.startAllMicroservices();
    this.kafkaClient = this.app.get(KafkaClientService);
    this.redisClient = this.app.get(RedisClientService);
  }
}
