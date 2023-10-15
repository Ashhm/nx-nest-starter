import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { defaultMongodbSchemaOptions } from '@libs/nest/shared/schemas';
import { createHash } from '@libs/nest/shared/utils';
import { UserRole } from '@libs/shared/enums';
import { User } from '@libs/shared/interfaces';

import 'mongoose-paginate-v2';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const paginate = require('mongoose-paginate-v2');

@Schema(defaultMongodbSchemaOptions)
export class UserSchemaMetadata implements User {
  public id: string;

  @Prop({ required: true, unique: true, lowercase: true })
  public username: string;

  @Prop({ required: true, enum: UserRole })
  public role: UserRole;

  @Prop({ required: true })
  public firstName: string;

  @Prop({ required: true })
  public lastName: string;

  @Prop({ required: true })
  public password: string;

  public createdAt: Date;

  public updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserSchemaMetadata);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await createHash(this.password);
  }
  next();
});
UserSchema.plugin(paginate);

export const userModelDefinition = {
  name: UserSchemaMetadata.name,
  schema: UserSchema,
  collection: 'users',
};
