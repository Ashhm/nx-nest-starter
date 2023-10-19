import { Message } from '@nestjs/microservices/external/kafka.interface';
import { KafkaRequestSerializer } from '@nestjs/microservices/serializers';
import * as _ from 'lodash';
import { DtoFactory } from '@libs/shared/factories';

export class KafkaMessageSerializer extends KafkaRequestSerializer {
  public override serialize(value: unknown): Message {
    if (_.isObject(value)) {
      const message: { value: object | string; key?: string } = { value: DtoFactory.serialize(value) };
      if ('key' in value && typeof value.key === 'string') {
        message.key = value.key;
      }
      return super.serialize(message);
    }
    return super.serialize(value);
  }
}
