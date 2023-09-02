import { config } from 'dotenv';
config()

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === "production") app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.NODE_ENV === "production" ? ['https://myalias.pro'] : ['http://localhost:3000']
  });

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(4000);
}
bootstrap();
