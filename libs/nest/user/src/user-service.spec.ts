import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FixtureHelperFactory, SpecHelperFactory } from '@libs/nest/test';
import { CreateUserDto } from '@libs/shared/dtos';
import { UserFixtureHelper } from '../test/helpers';
import { userModelDefinition } from './user.schema';
import { UserService } from './user.service';

describe('UserService', () => {
  let app: INestApplication;
  let userService: UserService;
  let createUserDto: CreateUserDto;
  const fixtureHelper = FixtureHelperFactory.create(UserFixtureHelper);
  const specHelper = SpecHelperFactory.create();

  beforeAll(async () => {
    app = await specHelper.createApp({
      imports: [MongooseModule.forFeature([userModelDefinition])],
      providers: [UserService],
    });

    userService = app.get(UserService);
  });

  beforeEach(() => {
    createUserDto = fixtureHelper.createUserDto();
  });

  afterEach(async () => {
    await userService.deleteByUsername(createUserDto.username);
  });

  describe('create', () => {
    it('should create user', async () => {
      const user = await userService.create(createUserDto);
      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.username).toEqual(createUserDto.username);
      expect(user.firstName).toEqual(createUserDto.firstName);
      expect(user.lastName).toEqual(createUserDto.lastName);
      expect(user?.password).not.toEqual(createUserDto.password);
    });
  });

  describe('findOneByUsername', () => {
    it('should return user by username', async () => {
      const user = await userService.create(createUserDto);
      const foundUser = await userService.findOneByUsername(createUserDto.username);
      expect(foundUser).toBeDefined();
      expect(foundUser?.username).toEqual(user.username);
      expect(foundUser?.firstName).toEqual(user.firstName);
      expect(foundUser?.lastName).toEqual(user.lastName);
    });

    it('should return null if user not found', async () => {
      const foundUser = await userService.findOneByUsername(fixtureHelper.randomEmail());
      expect(foundUser).toBeNull();
    });
  });

  describe('findOneById', () => {
    it('should return user by id', async () => {
      const user = await userService.create(createUserDto);
      const foundUser = await userService.findOneById(user.id);
      expect(foundUser).toBeDefined();
      expect(foundUser?.username).toEqual(user.username);
      expect(foundUser?.firstName).toEqual(user.firstName);
      expect(foundUser?.lastName).toEqual(user.lastName);
    });

    it('should return null if user not found', async () => {
      const foundUser = await userService.findOneById(fixtureHelper.randomMongoId());
      expect(foundUser).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const user = await userService.create(createUserDto);
      const updateDto = fixtureHelper.updateUserDto();
      const updatedUser = await userService.update(user.id, updateDto);
      expect(updatedUser).toBeDefined();
      expect(updatedUser?.firstName).toEqual(updateDto.firstName);
      expect(updatedUser?.lastName).toEqual(updateDto.lastName);
    });

    it('should return null if user not found', async () => {
      const updateDto = fixtureHelper.updateUserDto();
      const updatedUser = await userService.update(fixtureHelper.randomMongoId(), updateDto);
      expect(updatedUser).toBeNull();
    });
  });

  describe('deleteByUserName', () => {
    it('should delete user', async () => {
      const user = await userService.create(createUserDto);
      await userService.deleteByUsername(user.username);
      const foundUser = await userService.findOneById(user.id);
      expect(foundUser).toBeNull();
    });
  });

  describe('updatePassword', () => {
    it('should update password', async () => {
      const user = await userService.create(createUserDto);
      const newPassword = fixtureHelper.randomString();
      const updatedUser = await userService.updatePassword(user.id, newPassword);
      expect(updatedUser).toBeDefined();
      expect(user.password).not.toEqual(updatedUser?.password);
    });

    it('should return null if user not found', async () => {
      const newPassword = fixtureHelper.randomString();
      const updatedUser = await userService.updatePassword(fixtureHelper.randomMongoId(), newPassword);
      expect(updatedUser).toBeNull();
    });
  });
});
