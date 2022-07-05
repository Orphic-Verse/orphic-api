import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import AdminJSMongoose from '@adminjs/mongoose';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  const config = new DocumentBuilder()
    .setTitle('Orphic V2 API Documentation - Onpar Labs')
    .setDescription(
      "This is the API Documentation for the Orphic V2 API's, provided by Onpar Labs",
    )
    .setVersion('2.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customCssUrl:
      'https://raw.githubusercontent.com/ostranme/swagger-ui-themes/develop/themes/3.x/theme-newspaper.css',
    customSiteTitle: 'Orphic V2',
  });
  app.useGlobalPipes(new ValidationPipe());
  console.log({ AdminJSMongoose });
  app.use(cookieParser());
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
