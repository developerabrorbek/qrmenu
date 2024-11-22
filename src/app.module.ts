import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { appConfig, databaseConfig, jwtConfig } from '@config';
import { CheckAuthGuard, CheckRoleGuard } from '@guards';
import { ExceptionHandlerFilter } from '@filters';
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
  providers: [
    {
      useClass: CheckAuthGuard,
      provide: APP_GUARD,
    },
    {
      useClass: CheckRoleGuard,
      provide: APP_GUARD,
    },
    {
      useClass: ExceptionHandlerFilter,
      provide: APP_FILTER,
    },
  ],
})
export class AppModule {}
