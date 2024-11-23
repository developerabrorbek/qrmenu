import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UploadService } from '../upload';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models';
import { Restaurant, RestaurantSchema } from '../restaurant';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UploadService],
})
export class UserModule {}
