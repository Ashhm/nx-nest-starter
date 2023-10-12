import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configFactory } from './data-access-config.factory';
import { DataAccessConfigService } from './data-access-config.service';

@Module({
  imports: [ConfigModule.forFeature(configFactory)],
  providers: [DataAccessConfigService],
  exports: [DataAccessConfigService],
})
export class DataAccessConfigModule {}
