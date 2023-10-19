import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { RpcMessage } from '../interfaces';
import { AppErrorDto } from './app-error.dto';

class RpcMessageMetadataDto {
  @IsString()
  @ApiProperty({ description: 'Unique identifier of the request to trace process' })
  public requestId: string;

  @IsString()
  @ApiProperty({ description: 'Unique identifier of the correlation to associate response with request' })
  public correlationId: string;

  @IsString()
  @ApiProperty()
  public replyTo?: string;

  @IsDate()
  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  public timestamp: Date;
}

export abstract class RpcMessageDto<D> implements RpcMessage<D> {
  abstract get key(): string;

  @ApiProperty({ type: RpcMessageMetadataDto })
  @IsObject()
  @Type(() => RpcMessageMetadataDto)
  @ValidateNested()
  public metadata: RpcMessageMetadataDto;

  public abstract data?: D;

  @ApiPropertyOptional({ type: AppErrorDto })
  @IsObject()
  @IsOptional()
  @Type(() => AppErrorDto)
  @ValidateNested()
  public error?: AppErrorDto;
}
