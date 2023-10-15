import { PartialType, PickType } from '@nestjs/swagger';
import { UpdateUser } from '../../interfaces';
import { UserDto } from './user.dto';

export class UpdateUserDto
  extends PartialType(PickType(UserDto, ['role', 'firstName', 'lastName']))
  implements UpdateUser {}
