import mongoose from 'mongoose';

export const defaultMongodbSchemaOptions: mongoose.SchemaOptions = {
  timestamps: true,
  virtuals: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret['_id'];
      delete ret['__v'];
      ret['id'] = doc._id.toString();
    },
  },
  toObject: {
    transform: (doc, ret) => {
      delete ret['_id'];
      delete ret['__v'];
      ret['id'] = doc._id.toString();
    },
  },
};
