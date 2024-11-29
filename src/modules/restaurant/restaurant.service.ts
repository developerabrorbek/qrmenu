import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as QRCode from 'qrcode';
import { Restaurant } from './models';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto';
import { User } from '../user';
import { Language } from '../language';
import { UploadService } from '../upload';
import { Food } from '../food';
import { Category } from '../category';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Language.name) private languageModel: Model<Language>,
    @InjectModel(Food.name) private foodModel: Model<Food>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
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
      .populate(['user', 'languages'])
      .lean();

    const response = [];

    for (const restaurant of restaurants) {
      const categoriesResponse = [];

      const categories = await this.categoryModel
        .find({ restaurant: restaurant._id })
        .lean();

      for (const category of categories) {
        const foods = await this.foodModel.find({ category: category._id });
        categoriesResponse.push({ ...category, foods: foods });
      }

      response.push({ ...restaurant, categories: categoriesResponse });
    }
    return response;
  }

  async findOne(id: string) {
    const restaurant = await this.restaurantModel
      .findById(id)
      .populate(['user', 'languages'])
      .lean();
    const categoriesResponse = [];

    const categories = await this.categoryModel
      .find({ restaurant: restaurant._id })
      .lean();

    for (const category of categories) {
      const foods = await this.foodModel.find({ category: category._id });
      categoriesResponse.push({ ...category, foods: foods });
    }

    return { ...restaurant, categories: categoriesResponse };
  }

  async generateQRcode(link: string) {
    try {
      // Generate a QR code and return it as a data URL (base64)
      return await QRCode.toDataURL(link);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to generate QR code: ' + error.message,
      );
    }
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

    await this.restaurantModel.deleteOne({ _id: id });

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
    const languages = await this.languageModel.find({ _id: { $in: payload } });
    if (languages.length !== payload.length) {
      throw new NotFoundException('One or more languages not found');
    }
    return languages;
  }
}
