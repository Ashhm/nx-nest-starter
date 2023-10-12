import { Body, Controller, Get, NotFoundException, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClassSerializerInterceptor } from '@libs/nest/shared/interceptors';
import { EntityIdValidationPipe } from '@libs/nest/shared/pipes';
import { CreateUserDto, FindAllUsersDto, UpdateUserDto, UserDto, UserListDto } from '@libs/shared/dtos';
import { UpdateUserPasswordDto } from '@libs/shared/dtos/user/update-user-password.dto';
import { DtoFactory } from '@libs/shared/factories';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  @ApiResponse({ type: UserDto })
  public async getUser(@Param('userId', EntityIdValidationPipe) userId: string) {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return DtoFactory.create(UserDto, user);
  }

  @Get()
  @ApiResponse({ type: UserListDto })
  public async getUsers(@Query() query: FindAllUsersDto) {
    const { filter, ...paginateOptions } = query;
    const userList = await this.userService.findAll(filter, paginateOptions);
    return DtoFactory.create(UserListDto, userList);
  }

  @Post()
  @ApiResponse({ type: UserDto })
  public async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return DtoFactory.create(UserDto, user);
  }

  @Patch(':userId')
  @ApiResponse({ type: UserDto })
  public async updateUser(@Param('userId', EntityIdValidationPipe) userId: string, @Body() body: UpdateUserDto) {
    const user = await this.userService.update(userId, body);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return DtoFactory.create(UserDto, user);
  }

  @Patch(':userId/password')
  @ApiResponse({ type: UserDto })
  public async updatePassword(
    @Param('userId', EntityIdValidationPipe) userId: string,
    @Body() body: UpdateUserPasswordDto,
  ) {
    const user = await this.userService.updatePassword(userId, body.password);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return DtoFactory.create(UserDto, user);
  }
}
