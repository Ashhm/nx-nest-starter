import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { EventDto, ReqMessageDto, ResMessageDto } from './dtos';
import { ExampleService } from './example.service';

@Controller()
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @MessagePattern('example.kafka.message.pattern', Transport.KAFKA)
  public handleKafkaMessage(@Payload() message: ReqMessageDto): Promise<ResMessageDto> {
    return this.exampleService.handleMessage(message);
  }

  @EventPattern('example.kafka.event.pattern', Transport.KAFKA)
  public async handleKafkaEvent(@Payload() event: EventDto): Promise<void> {
    await this.exampleService.handleEvent(event);
  }

  @MessagePattern('example.redis.message.pattern', Transport.REDIS)
  public handleRedisMessage(@Payload() message: ReqMessageDto): Promise<ResMessageDto> {
    return this.exampleService.handleMessage(message);
  }

  @EventPattern('example.redis.event.pattern', Transport.REDIS)
  public async handleRedisEvent(@Payload() event: EventDto): Promise<void> {
    await this.exampleService.handleEvent(event);
  }
}
