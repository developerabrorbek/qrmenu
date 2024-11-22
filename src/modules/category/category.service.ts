import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './models';
import { Restaurant } from '../restaurant';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
  ) {}

  async create(payload: CreateCategoryDto) {
    await this.#_checkRestaurant(payload.restaurantId);

    const category = await this.categoryModel.create({
      image: payload.image,
      name: payload.name,
      restaurant: payload.restaurantId,
    });

    return category;
  }

  async findAll(restaurantId: string) {
    const categories = await this.categoryModel
      .find({ restaurant: restaurantId })
      .populate(['foods']);
    return categories;
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id).populate(['foods']);
    return category;
  }

  async update(id: string, payload: UpdateCategoryDto) {
    const category = await this.categoryModel.updateOne(
      { id },
      { image: payload.image, name: payload.name },
    );
    return category;
  }

  async remove(id: string) {
    const category = await this.categoryModel.deleteOne({ id });
    return category;
  }

  async #_checkRestaurant(id: string) {
    const restaurant = await this.restaurantModel.findById(id);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
  }
}
