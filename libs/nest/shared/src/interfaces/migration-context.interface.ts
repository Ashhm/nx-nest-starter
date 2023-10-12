import { INestApplication } from '@nestjs/common';
import { BaseMigrationContext } from '@libs/node/migration';

export interface MigrationContext extends BaseMigrationContext {
  app: INestApplication;
}
