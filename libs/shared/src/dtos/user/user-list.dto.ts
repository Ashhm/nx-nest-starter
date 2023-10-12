import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { PaginationListDto } from '../pagination-list.dto';
import { UserDto } from './user.dto';

export class UserListDto extends PaginationListDto {
  @ApiProperty({ isArray: true, type: UserDto })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserDto)
  public declare items: UserDto[];
}
