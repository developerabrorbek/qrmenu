import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { appConfig, databaseConfig, jwtConfig } from '@config';
import {
  AuthModule,
  CategoryModule,
  FoodModule,
  RestaurantModule,
  UserModule,
  LanguageModule,
  SeedsModule,
  UploadModule,
} from '@modules';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.url'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('jwt.accessKey'),
        signOptions: { expiresIn: configService.get<number>('jwt.accessTime') },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    FoodModule,
    CategoryModule,
    RestaurantModule,
    LanguageModule,
    SeedsModule,
    UploadModule,
  ],
})
export class AppModule {}
