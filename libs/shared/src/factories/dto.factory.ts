import { randomUUID } from 'crypto';
import { type ClassConstructor, instanceToPlain, plainToInstance } from 'class-transformer';
import { EventMessageDto, RpcMessageDto } from '../dtos';
import { type DeepPropertiesOnly } from '../types';

export class DtoFactory {
  public static create<T>(cls: ClassConstructor<T>, params: Omit<DeepPropertiesOnly<T>, 'toJSON'>): T {
    return plainToInstance(cls, params);
  }

  public static createEventMessage<D>(cls: new () => EventMessageDto<D>, data: D): EventMessageDto<D> {
    const metadata = {
      requestId: randomUUID(),
      timestamp: new Date(),
    };
    return plainToInstance(cls, { metadata, data: data });
  }

  // TODO: Improve DTO structure. Most probably, replyTo and correlationId are not required for internal communication.
  public static createRpcMessage<D>(cls: new () => RpcMessageDto<D>, data: D): RpcMessageDto<D> {
    const metadata = {
      requestId: randomUUID(),
      correlationId: randomUUID(),
      timestamp: new Date(),
    };
    return plainToInstance(cls, { metadata, data: data });
  }

  public static serialize<T>(value: T): Record<string, unknown> | T {
    return typeof value === 'object' && value !== null ? instanceToPlain(value) : value;
  }
}
