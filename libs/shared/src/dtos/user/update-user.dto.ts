import { PickType } from '@nestjs/swagger';
import { UpdateUser } from '../../interfaces';
import { UserDto } from './user.dto';

export class UpdateUserDto extends PickType(UserDto, ['firstName', 'lastName']) implements UpdateUser {}
