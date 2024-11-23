import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { UploadService } from '../upload';
import { MongooseModule } from '@nestjs/mongoose';
import { Food, FoodSchema } from './models';
import { Restaurant, RestaurantSchema } from '../restaurant';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Food.name, schema: FoodSchema },
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
  ],
  controllers: [FoodController],
  providers: [FoodService, UploadService],
})
export class FoodModule {}
