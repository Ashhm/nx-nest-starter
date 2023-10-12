import { ApiResponseProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { TokenType } from '../../enums';

export class LoginResponseDto {
  @ApiResponseProperty()
  @IsString()
  public accessToken: string;

  @ApiResponseProperty()
  @IsString()
  public refreshToken: string;

  @ApiResponseProperty()
  @IsNumber()
  public expiresIn: number;

  @ApiResponseProperty()
  @IsEnum(TokenType)
  public type: string;
}
