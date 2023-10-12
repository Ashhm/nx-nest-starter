import { IsDate, IsString } from 'class-validator';
import { RefreshToken } from '../interfaces';

export class RefreshTokenDto implements RefreshToken {
  @IsString()
  public id: string;

  @IsString()
  public userId: string;

  @IsString()
  public deviceId: string;

  @IsString()
  public token: string;

  @IsDate()
  public expiresAt: Date;

  @IsDate()
  public createdAt: Date;
}
