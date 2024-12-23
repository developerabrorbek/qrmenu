import { Injectable, NotFoundException } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Category } from './models';
import { Restaurant } from '../restaurant';
import { UploadService } from '../upload';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
    private uploadService: UploadService,
  ) {}

  async create(payload: CreateCategoryDto) {
    await this.#_checkRestaurant(payload.restaurantId);

    const newCategoryImage = await this.uploadService.uploadFile({
      file: payload.image,
      destination: 'public/category-image',
    });

    const category = await this.categoryModel.create({
      image: newCategoryImage.imageUrl,
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
    if (payload?.image) {
      const category = await this.categoryModel.findById(id);

      if (category.image) {
        await this.uploadService.removeFile({
          fileName: category.image,
        });
      }
      // await this.#_checkCategoryImage(payload.image);
      const newCategoryImage = await this.uploadService.uploadFile({
        file: payload.image,
        destination: 'public/category-image',
      });
      payload.image = newCategoryImage.imageUrl;
    }
    const category = await this.categoryModel.updateOne(
      { _id: id },
      { image: payload.image, name: payload.name },
    );
    return category;
  }

  async remove(id: string) {
    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.image) {
      await this.uploadService.removeFile({
        fileName: category.image,
      });
    }

    await this.categoryModel.deleteOne({ _id: id });
    return category;
  }

  async #_checkRestaurant(id: string) {
    const restaurant = await this.restaurantModel.findById(id);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
  }
}
