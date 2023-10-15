import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { User } from '../../interfaces';
import { PaginationOptionsDto } from '../pagination-options.dto';

export class FindUserDto implements Partial<Record<keyof User, unknown>> {
  @ApiPropertyOptional({ name: 'filter[id]' })
  @IsOptional()
  @IsString()
  public id?: string;

  @ApiPropertyOptional({ name: 'filter[username]' })
  @IsOptional()
  @IsEmail()
  public username?: string;

  @ApiPropertyOptional({ name: 'filter[firstName]' })
  @IsOptional()
  @IsString()
  public firstName?: string;

  @ApiPropertyOptional({ name: 'filter[lastName]' })
  @IsOptional()
  @IsString()
  public lastName?: string;
}

export class FindAllUsersDto extends PaginationOptionsDto {
  @ApiPropertyOptional({ type: FindUserDto })
  @IsOptional()
  @Type(() => FindUserDto)
  @ValidateNested()
  public filter?: FindUserDto;
}
