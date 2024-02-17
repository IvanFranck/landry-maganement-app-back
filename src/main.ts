import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { CustomExptionFilter } from '@common/filters/custom-exeption.filter';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['warn', 'error', 'log'],
  });
  const configService = app.get(ConfigService);

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.enableCors();
  app.useGlobalFilters(new CustomExptionFilter());
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
      skipMissingProperties: false,
      skipUndefinedProperties: false,
    }),
  );

  await app.listen(configService.get('PORT'));
}
bootstrap();
