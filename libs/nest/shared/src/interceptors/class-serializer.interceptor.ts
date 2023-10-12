import {
  ClassSerializerInterceptor as ClassSerializerInterceptorBase,
  ClassSerializerInterceptorOptions,
  ExecutionContext,
  StreamableFile,
} from '@nestjs/common';
import { CallHandler } from '@nestjs/common/interfaces/features/nest-interceptor.interface';
import { Reflector } from '@nestjs/core';
import { MetadataStorage, ValidationTypes, getMetadataStorage } from 'class-validator';
import { type ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata';
import { map } from 'rxjs/operators';

export class ClassSerializerInterceptor extends ClassSerializerInterceptorBase {
  private metadataStorage: MetadataStorage;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(reflector: Reflector, defaultOptions?: ClassSerializerInterceptorOptions) {
    super(reflector, defaultOptions);
    this.metadataStorage = getMetadataStorage();
  }

  public override intercept(context: ExecutionContext, next: CallHandler) {
    const contextOptions = this.getContextOptions(context);
    const options = Object.assign(Object.assign({}, this.defaultOptions), contextOptions);
    return next.handle().pipe(
      map((res) => {
        this.sanitize(res);
        return this.serialize(res, options);
      }),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sanitize<T = any>(response: T, targetSchema?: string): void {
    if (!(response instanceof Object) || response instanceof StreamableFile) {
      return;
    }
    if (Array.isArray(response)) {
      response.forEach((item) => {
        this.sanitize(item);
      });
    } else if (typeof response === 'object') {
      const targetMetadata = this.metadataStorage.getTargetValidationMetadatas(
        response.constructor,
        targetSchema || '',
        true,
        false,
      );
      const groupedMetadata = this.metadataStorage.groupByPropertyName(targetMetadata);
      this.stripNonDecoratedProperties(response as Record<string, unknown>, groupedMetadata);
      Object.keys(groupedMetadata).forEach((key) => {
        const metadata = groupedMetadata[key];
        metadata.forEach(({ type, target }) => {
          if (type === ValidationTypes.NESTED_VALIDATION) {
            const targetSchemaName = typeof target === 'string' ? target : target.name;
            this.sanitize(response[key as keyof T], targetSchemaName);
          }
        });
      });
    }
  }

  private stripNonDecoratedProperties<T extends Record<string, unknown>>(
    response: T,
    groupedMetadata: Record<string, ValidationMetadata[]>,
  ): void {
    Object.keys(response).forEach((key) => {
      if (!groupedMetadata[key] || groupedMetadata[key].length === 0) {
        delete response[key];
      }
    });
  }
}
