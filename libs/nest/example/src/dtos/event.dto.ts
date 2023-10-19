import { Type } from 'class-transformer';
import { IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';

export class EventDataDto {
  @IsString()
  public key1: string;

  @IsNumber()
  public key2: number;
}

export class EventDto {
  @IsString()
  public key: string;

  @IsObject()
  @Type(() => EventDataDto)
  @ValidateNested()
  public data: EventDataDto;
}
