import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { MongooseExceptionFilter } from '@libs/nest/shared/exception-filters';
import { BaseSpecHelper } from '@libs/test/helpers';
import { ConfigModule } from '../config';
import FunctionPropertyNames = jest.FunctionPropertyNames;

export class SpecHelper extends BaseSpecHelper {
  protected app: INestApplication;

  public httpClient: request.SuperTest<request.Test>;

  public async spyOnMethodCompletion<T extends object, M extends FunctionPropertyNames<Required<T>>>(
    target: T,
    methodName: M,
    { count = 1, restore = true }: { count?: number; restore?: boolean } = {},
  ) {
    const originFn = target[methodName];
    if (typeof originFn !== 'function') {
      throw new Error('You cannot spy on non functional method');
    }
    const spy = jest.spyOn(target, methodName);
    const { promise, resolver } = this.createPromiseWithResolver();
    let called = 0;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error Code below is valid but typings are not supporting Promise<ReturnType<T>[M]>
    spy.mockImplementation(async (...args) => {
      try {
        return await originFn.apply(target, args);
      } finally {
        called += 1;
        if (count === called) {
          if (restore) {
            spy.mockRestore();
          }
          resolver(undefined);
        }
      }
    });

    return await promise;
  }

  public override init(): void {
    this.app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );

    this.app.useGlobalFilters(new MongooseExceptionFilter());
  }

  public async createApp(metadata: ModuleMetadata) {
    metadata.imports = metadata.imports || [];
    metadata.imports.push(ConfigModule);
    const module = await Test.createTestingModule(metadata).compile();
    this.app = module.createNestApplication();
    this.httpClient = request(this.app.getHttpServer());
    this.init();
    return this.app;
  }
}
