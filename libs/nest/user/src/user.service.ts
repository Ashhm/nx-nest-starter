import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, PaginateOptions } from 'mongoose';
import { normalizeFilterQuery, normalizePaginateOptions } from '@libs/nest/shared/utils';
import { FindUserDto } from '@libs/shared/dtos';
import { CreateUser, UpdateUser, User } from '@libs/shared/interfaces';
import { UserSchemaMetadata } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserSchemaMetadata.name)
    private readonly userModel: mongoose.PaginateModel<UserSchemaMetadata>,
  ) {}

  public async create(params: CreateUser) {
    const user = new this.userModel(params);
    return this.toDomainObject(await user.save());
  }

  public async findOneById(userId: string): Promise<User | null> {
    return this.toDomainObject(await this.userModel.findById(userId));
  }

  public async findOneByUsername(username: string): Promise<User | null> {
    return this.toDomainObject(await this.userModel.findOne({ username: username }));
  }

  public async update(userId: string, params: UpdateUser): Promise<User | null> {
    const user = await this.userModel.findById(userId);
    if (user) {
      user.set(params);
      return this.toDomainObject(await user.save());
    }
    return null;
  }

  public async updatePassword(userId: string, password: string): Promise<User | null> {
    const user = await this.userModel.findById(userId);
    if (user) {
      user.password = password;
      return this.toDomainObject(await user.save());
    }
    return null;
  }

  public async deleteByUsername(username: string): Promise<void> {
    await this.userModel.deleteOne({ username });
  }

  public async findAll(filterQuery: FindUserDto = {}, params: PaginateOptions) {
    const paginateResult = await this.userModel.paginate(
      normalizeFilterQuery(filterQuery),
      normalizePaginateOptions(params),
    );
    return {
      ...paginateResult,
      items: paginateResult.items.map((user) => this.toDomainObject(user)),
    };
  }

  private toDomainObject<
    T extends HydratedDocument<UserSchemaMetadata> | null,
    R = T extends HydratedDocument<UserSchemaMetadata> ? User : null,
  >(userDocument: T): R {
    return (userDocument?.toObject() ?? null) as R;
  }
}
