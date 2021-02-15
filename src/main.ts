import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import * as fs from "fs";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  if (!fs.existsSync('data')){
    fs.mkdirSync('data');
  }

  if (!fs.existsSync('data/users.json')) {
    fs.appendFileSync('data/users.json', '[{"id":"b4ecd54e-6f4a-4b60-897c-01b55f324e3e","name":"Bob","email":"bob@gmail.com","password":"865e9ae77ebf2710dbd793777c3a7ad9c49c3e66642ad8ee780e6a5cf475348c"}]')
  }
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
