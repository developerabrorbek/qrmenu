import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Food } from './models';
import { Model } from 'mongoose';
import { UploadService } from '../upload';
import { Restaurant } from '../restaurant';

@Injectable()
export class FoodService {
  constructor(
    @InjectModel(Food.name) private foodModel: Model<Food>,
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
    private uploadService: UploadService,
  ) {}
  async create(payload: CreateFoodDto) {
    await this.#_checkRestaurant(payload.restaurantId);

    const image = await this.uploadService.uploadFile({
      destination: 'public/foods',
      file: payload.image,
    });

    const food = await this.foodModel.create({
      name: payload.name,
      description: payload.description,
      price: payload.price,
      image: image.imageUrl,
      restaurant: payload.restaurantId,
      category: payload.categoryId,
    });

    return food;
  }

  async findAll(restaurantId: string) {
    const foods = await this.foodModel
      .find({ restaurant: restaurantId })
      .populate(['restaurant', 'category']);
    return foods;
  }

  async findOne(id: string) {
    const food = await this.foodModel
      .findById(id)
      .populate(['restaurant', 'category']);
    return food;
  }

  async update(id: string, payload: UpdateFoodDto) {
    const food = await this.foodModel.findById(id);

    if (!food) {
      throw new NotFoundException('Food not found');
    }

    if (payload?.image) {
      if (food?.image) {
        await this.uploadService.removeFile({ fileName: food.image });
      }

      const image = await this.uploadService.uploadFile({
        destination: 'public/foods',
        file: payload.image,
      });

      await this.foodModel.updateOne({ id }, { image: image.imageUrl });
    }

    const newFood = await this.foodModel.updateOne(
      { id },
      {
        name: payload.name,
        description: payload.description,
        price: payload.price,
      },
    );
    return newFood;
  }

  async remove(id: string) {
    const food = await this.foodModel.findById(id);
    if (!food) {
      throw new NotFoundException('Food not found');
    }

    if (food?.image) {
      await this.uploadService.removeFile({ fileName: food.image });
    }

    await this.foodModel.deleteOne({ _id: id });
    return food;
  }

  async #_checkRestaurant(id: string) {
    const restaurant = await this.restaurantModel.findById(id);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return restaurant;
  }
}
