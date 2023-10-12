import mongoose from 'mongoose';
import { UmzugOptions } from 'umzug';

export interface BaseMigrationContext {
  connections: Record<string, mongoose.Connection>;
  logger: UmzugOptions['logger'];

  [key: string]: unknown;
}
