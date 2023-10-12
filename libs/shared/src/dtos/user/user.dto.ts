import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { IsDate, IsEmail, IsString } from 'class-validator';
import { User } from '../../interfaces';

export class UserDto implements User {
  @ApiProperty()
  @IsString()
  public id: string;

  @ApiProperty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  public username: string;

  @ApiProperty()
  @IsString()
  public firstName: string;

  @ApiProperty()
  @IsString()
  public lastName: string;

  @Exclude()
  public password: string;

  @ApiProperty()
  @IsDate()
  public createdAt: Date;

  @ApiProperty()
  @IsDate()
  public updatedAt: Date;
}
