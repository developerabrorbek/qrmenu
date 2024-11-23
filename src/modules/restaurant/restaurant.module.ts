import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantSchema } from './models';
import { Language, LanguageSchema } from '../language';
import { User, UserSchema } from '../user';
import { UploadService } from '../upload';
import { Food, FoodSchema } from '../food';
import { Category, CategorySchema } from '../category';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
      { name: Language.name, schema: LanguageSchema },
      { name: User.name, schema: UserSchema },
      { name: Food.name, schema: FoodSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService, UploadService],
})
export class RestaurantModule {}
