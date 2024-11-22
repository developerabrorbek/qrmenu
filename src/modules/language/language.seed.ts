import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Language } from './models';

@Injectable()
export class LanguageSeed {
  constructor(
    @InjectModel(Language.name) private languageModel: Model<Language>,
  ) {}

  async seed() {
    const count = await this.languageModel.countDocuments();
    if (count > 0) {
      console.log('Languages already exist, skipping seed.');
      return;
    }

    const languages: Language[] = [
      { name: 'English', code: 'en', image: 'public/united-kingdom.png' },
      { name: "O'zbek", code: 'uz', image: 'public/uzbekistan.png' },
      { name: 'Türkçe', code: 'tr', image: 'public/turkey.png' },
      { name: 'Русский', code: 'ru', image: 'public/russia.png' },
    ];

    await this.languageModel.insertMany(languages);
    console.log('Languages seeded!');
  }
}
