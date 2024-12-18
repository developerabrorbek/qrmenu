import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCategorImageDto } from './dto/create-category-image.dto';
import { CategoryImage } from './models';
import { UploadService } from '../upload';
import { UpdateCategoryImageDto } from './dto';

@Injectable()
export class CategoryImageService {
  constructor(
    @InjectModel(CategoryImage.name)
    private categoryImageModel: Model<CategoryImage>,
    private uploadService: UploadService,
  ) {}

  async create(payload: CreateCategorImageDto) {
    const image = await this.uploadService.uploadFile({
      destination: 'public/category-image',
      file: payload.image,
    });

    const categoryImage = await this.categoryImageModel.create({
      image: image.imageUrl,
      description: payload.description,
    });

    return categoryImage;
  }

  async findAll() {
    const categoryImages = await this.categoryImageModel.find();
    return categoryImages;
  }

  async findOne(id: string) {
    const categoryImage = await this.categoryImageModel.findById(id);
    return categoryImage;
  }

  async update(id: string, payload: UpdateCategoryImageDto) {
    const categoryImage = await this.categoryImageModel.findById(id);

    if (!categoryImage) {
      throw new NotFoundException('Category Image not found');
    }

    if (payload?.image) {
      if (categoryImage?.image) {
        await this.uploadService.removeFile({
          fileName: categoryImage.image,
        });
      }

      const image = await this.uploadService.uploadFile({
        destination: 'public/category-image',
        file: payload.image,
      });

      const updatedImage = await this.categoryImageModel.updateOne(
        { _id: id },
        { image: image.imageUrl },
      );
      console.log(updatedImage, id)
    }

    return await this.categoryImageModel.updateOne(
      { _id: id },
      { description: payload?.description },
    );
  }

  async remove(id: string) {
    const categoryImage = await this.categoryImageModel.findById(id);

    if (!categoryImage) {
      throw new NotFoundException('Category Image not found');
    }

    await this.uploadService.removeFile({ fileName: categoryImage.image });

    await this.categoryImageModel.deleteOne({ _id: id });
    return categoryImage;
  }
}
