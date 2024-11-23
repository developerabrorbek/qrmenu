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
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseObjectIdPipe } from '@pipes';
import { Protected, Roles } from '@decorators';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto';
import { UserRoles } from '../user';

@ApiTags('Restaurant')
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN])
  @ApiOperation({ summary: 'Yangi restoran yaratish' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async create(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.restaurantService.create({
      ...createRestaurantDto,
      image,
    });
  }

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN])
  @ApiOperation({ summary: 'Barcha restoranlarni olish' })
  @Get()
  async findAll() {
    return await this.restaurantService.findAll();
  }

  @Protected(false)
  @Roles([UserRoles.SUPER_ADMIN, UserRoles.ADMIN, UserRoles.USER])
  @ApiOperation({ summary: 'Bitta restoranni olish' })
  @Get('/one/:id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.restaurantService.findOne(id);
  }

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN, UserRoles.ADMIN])
  @ApiOperation({ summary: 'QRcode generatsiya qilish (restoran uchun)' })
  @Get('/generate/qrcode')
  async generateQRcode(@Query('link') link: string) {
    return await this.restaurantService.generateQRcode(link);
  }

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN, UserRoles.ADMIN])
  @ApiOperation({ summary: 'Restoranni tahrirlash' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.restaurantService.update(id, { ...updateRestaurantDto, image });
  }

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN])
  @ApiOperation({ summary: "Restoranni o'chirish" })
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.restaurantService.remove(id);
  }
}
