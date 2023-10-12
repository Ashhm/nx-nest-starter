import type { MigrationFn } from 'umzug';
import { MigrationContext } from '@libs/nest/shared/interfaces';
import { UserService } from '@libs/nest/user';
import { CreateUserDto } from '@libs/shared/dtos';
import { DtoFactory } from '@libs/shared/factories';

const username = process.env['DEFAULT_USERNAME'] || 'admin@mail.com';
const userPassword = process.env['DEFAULT_USER_PASSWORD'] || 'admin';
const userFirstName = process.env['DEFAULT_USER_FIRST_NAME'] || 'Admin';
const userLastName = process.env['DEFAULT_USER_LAST_NAME'] || 'Admin';

export const up: MigrationFn<MigrationContext> = async (params) => {
  const userService = params.context.app.get(UserService);
  const createUserDto = DtoFactory.create(CreateUserDto, {
    username: username,
    password: userPassword,
    firstName: userFirstName,
    lastName: userLastName,
  });
  await userService.create(createUserDto);
};
export const down: MigrationFn<MigrationContext> = async (params) => {
  const userService = params.context.app.get(UserService);
  await userService.deleteByUsername(username);
};
