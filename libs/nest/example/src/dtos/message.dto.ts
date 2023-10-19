import { Type } from 'class-transformer';
import { IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';

export class MessageDataDto {
  @IsString()
  public key1: string;

  @IsNumber()
  public key2: number;
}

export class ReqMessageDto {
  @IsString()
  public key: string;

  @IsObject()
  @Type(() => MessageDataDto)
  @ValidateNested()
  public data: MessageDataDto;
}

export class ResMessageDto {
  @IsString()
  public key: string;

  @IsObject()
  @Type(() => MessageDataDto)
  @ValidateNested()
  public data: MessageDataDto;
}
