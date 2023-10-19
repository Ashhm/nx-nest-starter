import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Jsonify } from 'type-fest';
import { KAFKA_CLIENT_KEY, KAFKA_REPLY_TOPICS_KEY } from '../constants';

@Injectable()
export class KafkaClientService implements OnApplicationBootstrap {
  constructor(
    @Inject(KAFKA_CLIENT_KEY)
    private readonly kafkaClient: ClientKafka,
    @Inject(KAFKA_REPLY_TOPICS_KEY)
    private readonly kafkaReplyTopics: string[],
  ) {}

  public async send<R, T = unknown>(pattern: string, data: T): Promise<Jsonify<R>> {
    return lastValueFrom(this.kafkaClient.send<Jsonify<R>>(pattern, data));
  }

  public emit<T>(pattern: string, data: T): void {
    this.kafkaClient.emit<unknown, T>(pattern, data);
  }

  public async onApplicationBootstrap(): Promise<void> {
    this.kafkaReplyTopics.map((topic) => this.kafkaClient.subscribeToResponseOf(topic));
    await this.kafkaClient.connect();
  }
}
