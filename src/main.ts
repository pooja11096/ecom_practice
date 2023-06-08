import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { All, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import {join} from "path";
import * as path from "path";
import * as express from 'express'
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './http-exception/http-exception.filter';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
 
  const configService = app.get(ConfigService);
  const httpAdapterHost = app.get(HttpAdapterHost);


  app.setViewEngine('ejs');
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true}))
  app.use(cookieParser());
  const cwd = process.cwd();

  app.useGlobalFilters(new HttpExceptionFilter)
  app.useStaticAssets(cwd + "/public");
  app.use(express.static("public"));

  await app.listen(3000);
}
bootstrap();
