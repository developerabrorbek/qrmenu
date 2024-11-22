import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from './models';
import { Model } from 'mongoose';
import { User } from '../user';
import { Language } from '../language';
import { UploadService } from '../upload';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Language.name) private languageModel: Model<Language>,
    private uploadService: UploadService,
  ) {}

  async create(payload: CreateRestaurantDto) {
    await this.#_checkUser(payload.userId);
    await this.#_checkLanguages(payload.languages);

    const restaurantImage = await this.uploadService.uploadFile({
      destination: 'public',
      file: payload.image,
    });

    const restaurant = await this.restaurantModel.create({
      image: restaurantImage.imageUrl,
      name: payload.name,
      description: payload.description,
      user: payload.userId,
      languages: payload.languages,
    });

    return restaurant;
  }

  async findAll() {
    const restaurants = await this.restaurantModel
      .find()
      .populate(['user', 'languages']);
    return restaurants;
  }

  async findOne(id: string) {
    const restaurant = await this.restaurantModel
      .findById(id)
      .populate(['user', 'languages']);
    return restaurant;
  }

  async update(id: string, payload: UpdateRestaurantDto) {
    const restaurant = await this.restaurantModel.findById(id);

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (payload.languages && payload.languages.length > 0) {
      await this.#_checkLanguages(payload.languages);

      await this.restaurantModel.updateOne(
        { id },
        {
          languages: payload.languages,
        },
      );
    }

    if (payload.image) {
      await this.uploadService.removeFile({ fileName: restaurant.image });

      const restaurantImage = await this.uploadService.uploadFile({
        destination: 'public',
        file: payload.image,
      });
      await this.restaurantModel.updateOne(
        { id },
        {
          image: restaurantImage.imageUrl,
        },
      );
    }

    await this.restaurantModel.updateOne(
      { id },
      {
        name: payload.name,
        description: payload.description,
      },
    );
    return `updated successfully`;
  }

  async remove(id: string) {
    const restaurant = await this.restaurantModel.findById(id);

    if (!restaurant) {
      return 'success';
    }

    await this.uploadService.removeFile({ fileName: restaurant.image });

    await this.restaurantModel.deleteOne({ id });

    return restaurant;
  }

  async #_checkUser(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async #_checkLanguages(payload: string[]) {
    const languages = await this.languageModel.find({ id: { $in: payload } });
    if (languages.length !== payload.length) {
      throw new NotFoundException('One or more languages not found');
    }
    return languages;
  }
}
