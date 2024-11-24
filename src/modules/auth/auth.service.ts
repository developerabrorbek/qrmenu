import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginForAdminDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user';
import { Model } from 'mongoose';
import { Restaurant } from '../restaurant';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
  ) {}
  async loginForAdmin(payload: LoginForAdminDto) {
    const foundedUser = await this.userModel.findOne({
      username: payload.username,
      password: payload.password,
    });

    const restaurant = await this.restaurantModel.findOne({ user: foundedUser.id }).populate(["languages", "user"]);

    if (!foundedUser) {
      throw new NotFoundException('User not found');
    }

    const accessToken = this.jwtService.sign({
      id: foundedUser.id,
      role: foundedUser.role,
    });

    return {
      success: true,
      access_token: accessToken,
      role: foundedUser.role,
      restaurant,
    };
  }
}
