import mongoose from 'mongoose';
import { MongoDBStorage, Umzug, UmzugStorage } from 'umzug';
import { BaseMigrationContext } from '../interfaces';

export function createMigrator<Ctx extends BaseMigrationContext>(
  context: Ctx | (() => Promise<Ctx> | Ctx),
  connection: mongoose.Connection | never,
  logger: Ctx['logger'],
) {
  let storage: UmzugStorage;
  if (connection instanceof mongoose.Connection) {
    storage = new MongoDBStorage({ connection });
  } else {
    throw new Error('Migration connection have no proper storage support');
  }
  const cwd = process.env['NX_WORKSPACE_ROOT'] ? process.env['NX_WORKSPACE_ROOT'] : process.cwd();
  const globPattern = process.env['NX_WORKSPACE_ROOT'] ? '**/src/migrations/*.{ts,js}' : '**/db/migrations/*.js';
  return new Umzug({
    storage,
    logger,
    context,
    migrations: { glob: [globPattern, { cwd }] },
  });
}
