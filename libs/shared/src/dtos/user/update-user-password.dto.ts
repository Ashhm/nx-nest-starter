import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserPasswordDto {
  @ApiProperty()
  @IsString()
  public password: string;
}
