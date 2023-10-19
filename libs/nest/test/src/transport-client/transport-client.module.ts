import { DynamicModule, Module } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { TransportFactory } from '@libs/nest/shared/transport';
import { KAFKA_CLIENT_KEY, KAFKA_REPLY_TOPICS_KEY, REDIS_CLIENT_KEY } from '../constants';
import { KafkaClientService } from './kafka-client.service';
import { RedisClientService } from './redis-client.service';

@Module({
  imports: [
    TransportFactory.createClients([
      {
        clientToken: REDIS_CLIENT_KEY,
        transport: Transport.REDIS,
      },
      {
        clientToken: KAFKA_CLIENT_KEY,
        transport: Transport.KAFKA,
      },
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class TransportClientModule {
  public static forRoot({ replyTopics = [] }: { replyTopics?: string[] } = {}): DynamicModule {
    return {
      module: TransportClientModule,
      providers: [
        {
          provide: KAFKA_REPLY_TOPICS_KEY,
          useValue: replyTopics,
        },
        KafkaClientService,
        RedisClientService,
      ],
      exports: [KafkaClientService, RedisClientService],
    };
  }
}
