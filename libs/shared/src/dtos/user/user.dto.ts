import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRole } from '../../enums/';
import { User } from '../../interfaces';

export class UserDto implements User {
  @ApiProperty()
  @IsString()
  public id: string;

  @ApiProperty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  public username: string;

  @ApiProperty({ type: String, enum: UserRole })
  @IsEnum(UserRole)
  public role: UserRole;

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
