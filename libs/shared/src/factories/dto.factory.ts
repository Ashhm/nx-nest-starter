import { type ClassConstructor, plainToInstance } from 'class-transformer';
import { type DeepPropertiesOnly } from '../types';

export class DtoFactory {
  public static create<T>(cls: ClassConstructor<T>, params: Omit<DeepPropertiesOnly<T>, 'toJSON'>): T {
    return plainToInstance(cls, params);
  }
}
