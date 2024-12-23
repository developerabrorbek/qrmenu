import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SeedsService } from '@modules';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  });

  app.setGlobalPrefix('/api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "2",
  })

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true
  }));

  app.enableCors({
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    optionsSuccessStatus: 200,
    origin: '*',
  });

  const seeds = app.get(SeedsService);
  await seeds.seedAll();

  const config = app.get(ConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('QRmenu')
    .setDescription('The qrmenu API description')
    .setVersion('2')
    .addBearerAuth()
    // .addServer(`http://localhost:${config.get<number>('app.port')}`, config.get<string>('app.host'))
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(config.get<number>('app.port'), (): void => {
    console.log(`listening on port ${config.get<number>('app.port')}`);
  });
}
bootstrap();
