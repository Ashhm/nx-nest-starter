import { Injectable } from '@nestjs/common';
import { DtoFactory } from '@libs/shared/factories';
import { EventDto, ReqMessageDto, ResMessageDto } from './dtos';

@Injectable()
export class ExampleService {
  constructor() {}

  public handleMessage(message: ReqMessageDto): Promise<ResMessageDto> {
    return Promise.resolve(DtoFactory.create(ResMessageDto, message));
  }

  public async handleEvent(event: EventDto): Promise<void> {
    await Promise.resolve(event);
  }
}
