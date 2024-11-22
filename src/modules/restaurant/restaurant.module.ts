import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantSchema } from './models';
import { Language, LanguageSchema } from '../language';
import { User, UserSchema } from '../user';
import { UploadService } from '../upload';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
      { name: Language.name, schema: LanguageSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService, UploadService],
})
export class RestaurantModule {}
