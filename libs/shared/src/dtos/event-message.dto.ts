import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsObject, IsString, ValidateNested } from 'class-validator';
import { EventMessage } from '../interfaces';

class EventMessageMetadataDto {
  @ApiProperty({ description: 'Unique identifier of the request to trace process' })
  @IsString()
  public requestId: string;

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  public timestamp: Date;
}

export abstract class EventMessageDto<D> implements EventMessage<D> {
  abstract get key(): string;

  @ApiProperty({ type: EventMessageMetadataDto })
  @IsObject()
  @Type(() => EventMessageMetadataDto)
  @ValidateNested()
  public metadata: EventMessageMetadataDto;

  public abstract data: D;
}
