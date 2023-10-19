import { INestApplication } from '@nestjs/common';
import { SpecHelperFactory } from '@libs/nest/test';
import { DtoFactory } from '@libs/shared/factories';
import { EventDto, ReqMessageDto, ResMessageDto } from './dtos';
import { ExampleController } from './example.controller';
import { ExampleModule } from './example.module';

describe('ExampleController', () => {
  let app: INestApplication;
  let exampleController: ExampleController;
  const specHelper = SpecHelperFactory.create();

  beforeAll(async () => {
    app = await specHelper.createApp(
      {
        imports: [ExampleModule],
      },
      {
        // Reply topics are required for testing Kafka
        replyTopics: ['example.kafka.message.pattern'],
      },
    );
    exampleController = app.get(ExampleController);
    await specHelper.initMicroservices();
    await app.init();
  }, 30_000);

  afterAll(async () => {
    await app.close();
  }, 30_000);

  describe('handleKafkaMessage', () => {
    it('should return a response', async () => {
      const reqMessageDto = DtoFactory.create(ReqMessageDto, {
        key: '123',
        data: { key1: '123', key2: 123 },
      });
      const resMessage = await specHelper.kafkaClient.send<ResMessageDto>(
        'example.kafka.message.pattern',
        reqMessageDto,
      );
      // Response is not in serialized format
      // Client should serialize the response
      expect(resMessage).toEqual(expect.objectContaining(reqMessageDto));
    });
  });

  describe('handleKafkaEvent', () => {
    it('should return a ResMessageDto', async () => {
      // Event is asynchronous process and nothing indicates that it is completed
      // Use getCompletionPromise to get the completion promise
      // It will be resolved when the event is completed
      const eventCompletionPromise = specHelper.getCompletionPromise(exampleController, 'handleKafkaEvent');
      const eventDto = DtoFactory.create(EventDto, {
        key: '123',
        data: { key1: '123', key2: 123 },
      });
      specHelper.kafkaClient.emit('example.kafka.event.pattern', eventDto);
      // Bellow, you may check side effects of the event
      await expect(eventCompletionPromise).resolves.not.toThrow();
    });
  });

  describe('handleRedisMessage', () => {
    it('should return a response', async () => {
      const reqMessageDto = DtoFactory.create(ReqMessageDto, {
        key: '123',
        data: { key1: '123', key2: 123 },
      });
      const resMessage = await specHelper.redisClient.send<ResMessageDto>(
        'example.redis.message.pattern',
        reqMessageDto,
      );
      // Response is not in serialized format
      // Client should serialize the response
      expect(resMessage).toEqual(expect.objectContaining(reqMessageDto));
    });
  });

  describe('handleRedisEvent', () => {
    it('should return a ResMessageDto', async () => {
      // Event is asynchronous process and nothing indicates that it is completed
      // Use getCompletionPromise to get the completion promise
      // It will be resolved when the event is completed
      const eventCompletionPromise = specHelper.getCompletionPromise(exampleController, 'handleRedisEvent');
      const eventDto = DtoFactory.create(EventDto, {
        key: '123',
        data: { key1: '123', key2: 123 },
      });
      specHelper.redisClient.emit('example.redis.event.pattern', eventDto);
      // Bellow, you may check side effects of the event
      await expect(eventCompletionPromise).resolves.not.toThrow();
    });
  });
});
