import { Inject } from '@nestjs/common';
import { KafkaOptions, MicroserviceOptions, RedisOptions, Transport } from '@nestjs/microservices';
import * as _ from 'lodash';
import { KafkaMessageSerializer } from '../../serializers';
import { configFactory } from './transport-config.factory';

export class TransportConfigService {
  constructor(
    @Inject(configFactory.KEY)
    private readonly config: ReturnType<typeof configFactory>,
  ) {}

  public createServerOptions(transport: Transport) {
    if (transport === Transport.KAFKA) {
      return <KafkaOptions>{
        transport,
        options: {
          client: {
            clientId: this.config.kafka.clientId,
            brokers: this.config.kafka.brokers,
            ssl: this.config.kafka.ssl,
          },
          consumer: {
            groupId: this.config.kafka.clientId,
            allowAutoTopicCreation: true,
          },
          producer: {
            allowAutoTopicCreation: true,
          },
          serializer: new KafkaMessageSerializer(),
        },
      };
    } else if (transport === Transport.REDIS) {
      return <RedisOptions>{
        transport,
        options: this.parseRedisUri(this.config.redis.uri),
      };
    }
    throw new Error(`Unknown transport: ${transport}`);
  }

  public createClientOptions(transport: Transport, clientToken: string, options: MicroserviceOptions = {}) {
    if (transport === Transport.KAFKA) {
      return <KafkaOptions>{
        transport,
        options: _.merge(options, {
          client: {
            clientId: `${this.config.kafka.clientId}-${clientToken}`,
            brokers: this.config.kafka.brokers,
            ssl: this.config.kafka.ssl,
          },
          consumer: {
            groupId: `${this.config.kafka.clientId}-${clientToken}`,
            allowAutoTopicCreation: true,
          },
          producer: {
            allowAutoTopicCreation: true,
          },
          run: {
            partitionsConsumedConcurrently: this.config.kafka.partitionsConsumedConcurrently,
          },
          serializer: new KafkaMessageSerializer(),
        }),
      };
    } else if (transport === Transport.REDIS) {
      return <RedisOptions>{
        transport,
        options: _.merge(options, this.parseRedisUri(this.config.redis.uri)),
      };
    }
    throw new Error(`Unknown transport: ${transport}`);
  }

  private parseRedisUri(uri: string) {
    const url = new URL(uri);
    return {
      host: url.hostname,
      port: Number(url.port),
    };
  }
}
