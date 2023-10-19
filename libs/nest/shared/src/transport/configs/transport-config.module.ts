import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configFactory } from './transport-config.factory';
import { TransportConfigService } from './transport-config.service';

@Module({
  imports: [ConfigModule.forFeature(configFactory)],
  providers: [TransportConfigService],
  exports: [TransportConfigService],
})
export class TransportConfigModule {}
