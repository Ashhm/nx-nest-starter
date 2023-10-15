import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { AccessTokenGuard, AuthModule } from '@libs/nest/auth';
import { HealthModule } from '@libs/nest/health';
import { RolesGuard } from '@libs/nest/shared/guards';
import { UserModule } from '@libs/nest/user';
import { AppConfigModule, AppConfigService, DataAccessConfigModule, DataAccessConfigService } from './configs';

@Module({
  controllers: [],
  imports: [
    // Config modules
    AppConfigModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [DataAccessConfigModule],
      useExisting: DataAccessConfigService,
    }),

    // Service modules
    AuthModule,
    HealthModule,
    LoggerModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory(appConfigService: AppConfigService) {
        return appConfigService.loggerSettings;
      },
      inject: [AppConfigService],
    }),

    // Feature modules
    AuthModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
