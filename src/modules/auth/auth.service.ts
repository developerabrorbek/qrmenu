import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginForAdminDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async loginForAdmin(payload: LoginForAdminDto) {
    const foundedUser = await this.userModel.findOne({
      username: payload.username,
      password: payload.password,
    });

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
      role: foundedUser.role
    };
  }
}
