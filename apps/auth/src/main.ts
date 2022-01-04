import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('AuthService');

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Swagger

  const options = new DocumentBuilder()
    .setTitle('Auth-Service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  //

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const port = configService.get('PORT');
  await app.listen(port);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
