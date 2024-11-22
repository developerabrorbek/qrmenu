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
} from '@modules';

@Module({
  imports: [
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
  ],
})
export class AppModule {}
