import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateUser } from '../../interfaces';
import { UserDto } from './user.dto';

export class CreateUserDto
  extends PickType(UserDto, ['username', 'role', 'firstName', 'lastName'])
  implements CreateUser
{
  @IsString()
  @ApiProperty()
  public password: string;
}
