import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/v1');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('QRmenu')
    .setDescription('The qrmenu API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:3000', 'localhost')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);

  const config = app.get(ConfigService);

  await app.listen(config.get<number>('app.port'), (): void => {
    console.log(`listening on port ${config.get<number>('app.port')}`);
  });
}
bootstrap();
