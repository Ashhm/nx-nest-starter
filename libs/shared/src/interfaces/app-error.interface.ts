import { Primitive } from 'type-fest';

export interface AppError {
  code: string;
  message: string;
  details?: Record<string, Primitive>;
}
