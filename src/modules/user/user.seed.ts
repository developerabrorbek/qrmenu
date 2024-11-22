import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRoles } from './models';

@Injectable()
export class UserSeed {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async seed() {
    const count = await this.userModel.countDocuments();
    if (count > 0) {
      console.log('Users already exist, skipping seed.');
      return;
    }

    const users: User[] = [
      {
        username: 'jaloliddin',
        password: 'jaloliddin',
        role: UserRoles.SUPER_ADMIN,
      },
      {
        username: 'abrorbek',
        password: 'abrorbek',
        role: UserRoles.SUPER_ADMIN,
      },
    ];

    await this.userModel.insertMany(users);
    console.log('Users seeded!');
  }
}
