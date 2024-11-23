import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@pipes';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Protected, Roles } from '@decorators';
import { UserRoles } from './models';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN])
  @ApiOperation({ summary: 'Yangi admin yaratish' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.userService.create({ ...createUserDto, image });
  }

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN])
  @ApiOperation({ summary: 'Barcha foydalanuvchilarni olish' })
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN, UserRoles.ADMIN])
  @ApiOperation({ summary: 'Bitta foydalanuvchini olish' })
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.userService.findOne(id);
  }

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN, UserRoles.ADMIN])
  @ApiOperation({ summary: 'Foydalanuvchini tahrirlash' })
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN])
  @ApiOperation({ summary: "Foydalanuvchini o'chirish" })
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.userService.remove(id);
  }
}
