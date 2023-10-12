import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [path.resolve(__dirname, '.test.env')],
    }),
  ],
})
export class ConfigHostModule {}
