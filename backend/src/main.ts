import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Integrations } from '@sentry/tracing';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const sentryDsn = configService.get<string>('SENTRY_DSN');

  if (sentryDsn) {
    Sentry.init({
      dsn: sentryDsn,
      integrations: [
        new Integrations.Http({ tracingOrigins: ['localhost', /^\[A-Za-z0-9\.-\:]+\Z/'] }),
      ],
      tracesSampleRate: 1.0,
    });
  }

  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    whitelist: true, // Remove properties that are not defined in the DTO
    forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
  }));

  await app.listen(3000);
}
bootstrap();
