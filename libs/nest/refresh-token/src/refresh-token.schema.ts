import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { defaultMongodbSchemaOptions } from '@libs/nest/shared/schemas';
import { createHash } from '@libs/nest/shared/utils';
import { RefreshToken } from './interfaces';

@Schema({
  ...defaultMongodbSchemaOptions,
  timestamps: { createdAt: true, updatedAt: false },
})
export class RefreshTokenSchemaMetadata implements RefreshToken {
  public id: string;

  @Prop({ required: true })
  public userId: string;

  @Prop({ required: true })
  public token: string;

  @Prop({ required: true })
  public deviceId: string;

  @Prop({ required: true })
  public expiresAt: Date;

  public createdAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshTokenSchemaMetadata);

RefreshTokenSchema.index({ userId: 1, deviceId: 1 });
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

RefreshTokenSchema.pre('save', async function (next) {
  if (this.isModified('token')) {
    this.token = await createHash(this.token);
  }
  next();
});

export const refreshTokenModelDefinition = {
  name: RefreshTokenSchemaMetadata.name,
  schema: RefreshTokenSchema,
  collection: 'refresh-tokens',
};
