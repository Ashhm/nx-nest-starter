import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { Primitive } from 'type-fest';
import { AppError } from '../interfaces';

export class AppErrorDto implements AppError {
  @ApiProperty()
  @IsString()
  public code: string;

  @ApiProperty()
  @IsString()
  public message: string;

  @ApiPropertyOptional({ type: Object })
  @IsObject()
  @IsOptional()
  public details?: Record<string, Primitive>;
}
