import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FixtureHelperFactory, SpecHelperFactory } from '@libs/nest/test';
import { CreateUserDto } from '@libs/shared/dtos';
import { User } from '@libs/shared/interfaces';
import { UserFixtureHelper, UserSpecHelper } from '../test/helpers';
import { UserController } from './user.controller';
import { userModelDefinition } from './user.schema';
import { UserService } from './user.service';

describe('UserController', () => {
  let app: INestApplication;
  let userService: UserService;
  let createUserDto: CreateUserDto;
  const fixtureHelper = FixtureHelperFactory.create(UserFixtureHelper);
  const specHelper = SpecHelperFactory.create(UserSpecHelper).useFixtureHelper(fixtureHelper);

  beforeAll(async () => {
    app = await specHelper.createApp({
      imports: [MongooseModule.forFeature([userModelDefinition])],
      controllers: [UserController],
      providers: [UserService],
    });
    userService = app.get(UserService);
    await app.init();
  });

  describe('POST /users', () => {
    beforeAll(() => {
      createUserDto = fixtureHelper.createUserDto();
    });

    afterAll(async () => {
      await userService.deleteByUsername(createUserDto.username);
    });

    it('should create user', async () => {
      await specHelper.httpClient
        .post('/users')
        .send(createUserDto)
        .expect(201)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.id).toBeDefined();
          expect(body.username).toEqual(createUserDto.username);
          expect(body.role).toEqual(createUserDto.role);
          expect(body.firstName).toEqual(createUserDto.firstName);
          expect(body.lastName).toEqual(createUserDto.lastName);
          expect(body?.password).not.toBeDefined();
        });
    });

    it('should throw error if user already exists', async () => {
      await specHelper.httpClient
        .post('/users')
        .send(createUserDto)
        .expect(409)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.message).toMatchInlineSnapshot(`"Duplicate field value"`);
        });
    });

    it('should throw error if username is invalid', async () => {
      await specHelper.httpClient
        .post('/users')
        .send({ ...createUserDto, username: 'invalid' })
        .expect(400)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.message).toMatchInlineSnapshot(`
            [
              "username must be an email",
            ]
          `);
        });
    });
  });

  describe('GET /users/:userId', () => {
    const context = specHelper.withUser();

    it('should return user', async () => {
      await specHelper.httpClient
        .get(`/users/${context.user.id}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.id).toEqual(context.user.id);
          expect(body.username).toEqual(context.user.username);
          expect(body.role).toEqual(context.user.role);
          expect(body.firstName).toEqual(context.user.firstName);
          expect(body.lastName).toEqual(context.user.lastName);
          expect(body?.password).not.toBeDefined();
        });
    });
  });

  describe('PATCH /users/:userId', () => {
    const context = specHelper.withUser();

    it('should update user', async () => {
      const updateUserDto = fixtureHelper.updateUserDto();
      await specHelper.httpClient
        .patch(`/users/${context.user.id}`)
        .send(updateUserDto)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.id).toEqual(context.user.id);
          expect(body.username).toEqual(context.user.username);
          expect(body.role).toEqual(context.user.role);
          expect(body.firstName).toEqual(updateUserDto.firstName);
          expect(body.lastName).toEqual(updateUserDto.lastName);
          expect(body?.password).not.toBeDefined();
        });
    });
  });

  describe('PATCH /users/:userId/password', () => {
    const context = specHelper.withUser();

    it('should update user password', async () => {
      const updatePasswordDto = fixtureHelper.updateUserPasswordDto();
      await specHelper.httpClient
        .patch(`/users/${context.user.id}/password`)
        .send(updatePasswordDto)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.id).toEqual(context.user.id);
          expect(body.username).toEqual(context.user.username);
          expect(body.role).toEqual(context.user.role);
          expect(body.firstName).toEqual(context.user.firstName);
          expect(body.lastName).toEqual(context.user.lastName);
          expect(body?.password).not.toBeDefined();
        });
    });
  });

  describe('GET /users', () => {
    specHelper.withUser();
    const context = specHelper.withUser();

    it('should return users', async () => {
      await specHelper.httpClient
        .get(`/users`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.items).toBeDefined();
          expect(body.items).toHaveLength(2);
          body.items.forEach((user: User) => {
            expect(user.id).toBeDefined();
            expect(user.username).toBeDefined();
            expect(user.role).toBeDefined();
            expect(user.firstName).toBeDefined();
            expect(user.lastName).toBeDefined();
            expect(user?.password).not.toBeDefined();
          });
        });
    });

    it('should return users filtered by username', async () => {
      const username = context.user.username;
      await specHelper.httpClient
        .get(`/users?filter[username]=${username}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.items).toBeDefined();
          expect(body.items).toHaveLength(1);
          expect(body.items[0].username).toEqual(username);
        });
    });
  });
});
