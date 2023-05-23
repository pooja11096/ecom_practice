import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
 
  app.setViewEngine('ejs');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true}))
  app.use(cookieParser());

  await app.listen(5000);
}
bootstrap();
