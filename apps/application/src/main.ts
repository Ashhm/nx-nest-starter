import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { MongooseExceptionFilter } from '@libs/nest/shared/exception-filters';
import { AppModule } from './app.module';
import { AppConfigService } from './configs';

async function bootstrap() {
  const appOptions = {
    rawBody: true,
    bufferLogs: false,
  };
  const app = await NestFactory.create<NestExpressApplication>(AppModule, appOptions);

  const appConfigService = app.get(AppConfigService);

  // Logger configuration
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  // URL configuration
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Security configuration
  app.enableCors();
  app.use(helmet());

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // Exception filters
  app.useGlobalFilters(new MongooseExceptionFilter());

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .setTitle('API Documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  // Other configuration
  app.useBodyParser('text');
  app.enableShutdownHooks();

  await app.listen(appConfigService.port);
  logger.log(`🚀 Application is running on: http://localhost:${appConfigService.port}/${globalPrefix}`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
