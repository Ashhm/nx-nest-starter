import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateRefreshTokenDto, DeleteRefreshTokenDto, FindRefreshTokenDto } from './dtos';
import { RefreshToken } from './interfaces';
import { RefreshTokenSchemaMetadata } from './refresh-token.schema';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectModel(RefreshTokenSchemaMetadata.name)
    private readonly refreshTokenModel: Model<RefreshTokenSchemaMetadata>,
  ) {}

  public async create(createRefreshTokenDto: CreateRefreshTokenDto): Promise<RefreshToken> {
    const refreshTokenDocument = await this.refreshTokenModel.create(createRefreshTokenDto);
    return this.toDomainObject(refreshTokenDocument);
  }

  public async deleteMany(deleteRefreshTokenDto: DeleteRefreshTokenDto) {
    await this.refreshTokenModel.deleteMany(deleteRefreshTokenDto);
  }

  public async findOneBy(findRefreshTokenDto: FindRefreshTokenDto): Promise<RefreshToken | null> {
    return this.toDomainObject(await this.refreshTokenModel.findOne(findRefreshTokenDto));
  }

  private toDomainObject<
    T extends HydratedDocument<RefreshTokenSchemaMetadata> | null,
    R = T extends HydratedDocument<RefreshTokenSchemaMetadata> ? RefreshToken : null,
  >(refreshTokenDocument: T): R {
    return (refreshTokenDocument?.toObject() ?? null) as R;
  }
}
