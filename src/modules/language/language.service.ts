import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Language } from './models';
import { Model } from 'mongoose';
import { UploadService } from '../upload';

@Injectable()
export class LanguageService {
  constructor(
    @InjectModel(Language.name) private languageModel: Model<Language>,
    private uploadService: UploadService,
  ) {}

  async create(payload: CreateLanguageDto) {
    const image = await this.uploadService.uploadFile({
      destination: 'public/static',
      file: payload.image,
    });

    const language = await this.languageModel.create({
      name: payload.name,
      code: payload.code,
      image: image.imageUrl,
    });
    return language;
  }

  async findAll() {
    const languages = await this.languageModel.find();
    return languages;
  }

  async findOne(id: string) {
    const language = await this.languageModel.findById(id);
    return language;
  }

  async update(id: string, payload: UpdateLanguageDto) {
    const language = await this.languageModel.findById(id);

    if (!language) {
      throw new NotFoundException('Language not found');
    }

    if (payload?.image) {
      if (language.image) {
        await this.uploadService.removeFile({
          fileName: language.image,
        });
      }

      const image = await this.uploadService.uploadFile({
        destination: 'public/static',
        file: payload.image,
      });

      await this.languageModel.updateOne({ id }, { image: image.imageUrl });
    }

    const newLanguage = await this.languageModel.updateOne(
      { id },
      { name: payload.name },
    );
    return newLanguage;
  }

  async remove(id: string) {
    const language = await this.languageModel.findById(id);
    if (!language) {
      throw new NotFoundException('Language not found');
    }

    if (language?.image) {
      await this.uploadService.removeFile({
        fileName: language.image,
      });
    }

    await this.languageModel.deleteOne({ id });
    return language;
  }
}
