import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configFactory } from './app-config.factory';
import { AppConfigService } from './app-config.service';

@Module({
  imports: [ConfigModule.forFeature(configFactory)],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
