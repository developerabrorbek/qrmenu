import { Controller, Post, Body, VERSION_NEUTRAL } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginForAdminDto } from './dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller({
  path: 'auth',
  version: ["1"],
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({summary: "Login for admins"})
  @Post('/login/admin')
  loginForAdmin(@Body() payload: LoginForAdminDto) {
    return this.authService.loginForAdmin(payload);
  }
}
