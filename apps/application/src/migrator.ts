import { NestFactory } from '@nestjs/core';
import { getConnectionToken } from '@nestjs/mongoose';
import { DEFAULT_DB_CONNECTION } from '@nestjs/mongoose/dist/mongoose.constants';
import { NestExpressApplication } from '@nestjs/platform-express';
import mongoose from 'mongoose';
import { Logger, PinoLogger } from 'nestjs-pino';
import { MigrationContext } from '@libs/nest/shared/interfaces';
import { createMigrator } from '@libs/node/migration';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useLogger(app.get(Logger));
  const logger = await app.resolve(PinoLogger);
  logger.setContext('Migrations');
  const connection: mongoose.Connection = app.get(getConnectionToken());
  const context: MigrationContext = {
    app,
    connections: { [DEFAULT_DB_CONNECTION]: connection },
    logger,
  };

  const migrator = createMigrator<MigrationContext>(context, connection, logger);

  if (require.main === module) {
    // noinspection ES6MissingAwait
    migrator.runAsCLI();
  }

  migrator.on('afterCommand', app.close);

  return migrator;
}

exports.umzug = bootstrap();
