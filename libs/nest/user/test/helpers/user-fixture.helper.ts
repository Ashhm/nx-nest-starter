import { CreateUserDto, UpdateUserDto } from '@libs/shared/dtos';
import { UpdateUserPasswordDto } from '@libs/shared/dtos/user/update-user-password.dto';
import { DtoFactory } from '@libs/shared/factories';
import { BaseFixtureHelper } from '@libs/test/helpers';

export class UserFixtureHelper extends BaseFixtureHelper {
  public createUserDto() {
    return DtoFactory.create(CreateUserDto, {
      username: this.randomEmail(),
      password: this.randomHash(),
      firstName: this.randomFirstName(),
      lastName: this.randomLastName(),
    });
  }

  public updateUserDto() {
    return DtoFactory.create(UpdateUserDto, {
      firstName: this.randomFirstName(),
      lastName: this.randomLastName(),
    });
  }

  public updateUserPasswordDto() {
    return DtoFactory.create(UpdateUserPasswordDto, {
      password: this.randomHash(),
    });
  }
}
