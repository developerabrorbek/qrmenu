import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models';
import { Model } from 'mongoose';
import { UploadService } from '../upload';
import { Restaurant } from '../restaurant';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
    private uplaodService: UploadService,
  ) {}

  async create(payload: CreateUserDto) {
    let image = null;
    if (payload?.image) {
      image = await this.uplaodService.uploadFile({
        destination: 'public/users',
        file: payload.image,
      });
    }

    const user = await this.userModel.create({
      name: payload?.name,
      password: payload.password,
      username: payload.username,
      phone: payload?.phone,
      image: image?.imageUrl,
      role: payload?.role,
    });
    return user;
  }

  async findAll() {
    const response = [];
    const users = await this.userModel.find();

    for (const user of users) {
      const restaurant = await this.restaurantModel.findOne({ user: user.id });
      response.push({ user, restaurant });
    }
    return response;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    const restaurant = await this.restaurantModel.findOne({ user: user.id });
    return { user, restaurant };
  }

  async update(id: string, payload: UpdateUserDto) {
    const user = await this.userModel.findById(id)

    if(!user) {
      throw new NotFoundException('User not found');
    }

    if(payload?.image) {
      if(user?.image) {
        await this.uplaodService.removeFile({
          fileName: user.image,
        });
      }

      const image = await this.uplaodService.uploadFile({
        destination: 'public/users',
        file: payload.image,
      });

      return await this.userModel.updateOne({ id }, {
        name: payload.name,
        phone: payload.phone,
        password: payload.password,
        username: payload.username,
        image: image.imageUrl,
      });
    }

    const newUser = await this.userModel.updateOne({ id }, {
      name: payload?.name,
      phone: payload?.phone,
      password: payload?.password,
      username: payload?.username,
    });
    return newUser;
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id);

    if(!user) {
      throw new NotFoundException('User not found');
    }

    if (user?.image) {
      await this.uplaodService.removeFile({
        fileName: user.image,
      });
    }

    await this.userModel.deleteOne({ id });
    return user;
  }
}
