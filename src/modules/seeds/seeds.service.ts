import { Injectable } from '@nestjs/common';
import { UserSeed } from '../user';
import { LanguageSeed } from '../language';

@Injectable()
export class SeedsService {
  constructor(
    private usersSeed: UserSeed,
    private languagesSeed: LanguageSeed,
  ) {}

  async seedAll() {
    await this.usersSeed.seed();
    await this.languagesSeed.seed();
  }
}
