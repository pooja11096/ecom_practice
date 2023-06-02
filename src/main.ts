import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import {join} from "path";
import * as path from "path";
import * as express from 'express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
 
  app.setViewEngine('ejs');
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true}))
  app.use(cookieParser());
  const cwd = process.cwd();
  console.log("cwd",cwd);

  app.useStaticAssets(cwd + "/public");
  app.use(express.static("public"));

  
  // app.use(express.static(__dirname + '/public'));
  // app.useStaticAssets(path.join(__dirname , "./public"));
  // app.useStaticAssets(join(__dirname, '..', 'public'));



  // app.useStaticAssets(path.join(__dirname , "./public/uploads"));
  console.log("dirname",__dirname);
  

  await app.listen(3000);
}
bootstrap();
