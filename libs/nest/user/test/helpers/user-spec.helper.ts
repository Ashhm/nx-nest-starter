import { INestApplication } from '@nestjs/common';
import { User } from '@libs/shared/interfaces';
import { BaseFixtureHelper, BaseSpecHelper } from '@libs/test/helpers';
import { UserService } from '../../src/';
import { UserFixtureHelper } from './user-fixture.helper';

export class UserSpecHelper extends BaseSpecHelper<{ user: User }> {
  public userService: UserService;

  protected app: INestApplication;

  protected fixtureHelper: BaseFixtureHelper & UserFixtureHelper;

  public withUser() {
    const [contextId, context] = this.createContext();

    beforeAll(async () => {
      const createUserDto = this.fixtureHelper.createUserDto();
      context.user = await this.userService.create(createUserDto);
      context.user.password = createUserDto.password;
    });

    afterAll(async () => {
      await this.userService.deleteByUsername(context.user.username);
      this.deleteContext(contextId);
    });

    return context;
  }

  public useFixtureHelper(fixtureHelper: BaseFixtureHelper & UserFixtureHelper & unknown) {
    this.fixtureHelper = fixtureHelper;
    return this;
  }

  public override init() {
    this.userService = this.app.get(UserService);
  }
}
