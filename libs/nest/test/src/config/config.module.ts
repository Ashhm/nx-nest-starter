import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigHostModule } from '../config-host';
import { DataAccessConfigModule, DataAccessConfigService } from './data-access';

@Module({
  imports: [
    ConfigHostModule,
    MongooseModule.forRootAsync({
      imports: [DataAccessConfigModule],
      useExisting: DataAccessConfigService,
    }),
  ],
})
export class ConfigModule {}
