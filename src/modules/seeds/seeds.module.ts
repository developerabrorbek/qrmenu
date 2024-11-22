import { Module } from '@nestjs/common';
import { SeedsService } from './seeds.service';
import { User, UserSchema, UserSeed } from '../user';
import { Language, LanguageSchema, LanguageSeed } from '../language';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Language.name, schema: LanguageSchema },
    ]),
  ],
  providers: [SeedsService, UserSeed, LanguageSeed],
})
export class SeedsModule {}
