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
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseObjectIdPipe } from '@pipes';
import { Protected, Roles } from '@decorators';
import { FoodService } from './food.service';
import { CreateFoodDto, UpdateFoodDto } from './dto';
import { UserRoles } from '../user';

@ApiTags('Foods')
@Controller({
  path: 'food',
  version: ["2"],
})
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN, UserRoles.ADMIN])
  @ApiOperation({ summary: 'Yangi taom yaratish' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async create(
    @Body() createFoodDto: CreateFoodDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.foodService.create({ ...createFoodDto, image });
  }

  @Protected(false)
  @Roles([UserRoles.SUPER_ADMIN, UserRoles.ADMIN, UserRoles.USER])
  @ApiOperation({ summary: 'Barcha taomlarni olish' })
  @Get(':restaurantId')
  async findAll(
    @Param('restaurantId', ParseObjectIdPipe) restaurantId: string,
  ) {
    return await this.foodService.findAll(restaurantId);
  }

  @Protected(false)
  @Roles([UserRoles.SUPER_ADMIN, UserRoles.ADMIN, UserRoles.USER])
  @ApiOperation({ summary: 'Bitta taomni olish' })
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.foodService.findOne(id);
  }

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN, UserRoles.ADMIN])
  @ApiOperation({ summary: 'Taomni tahrirlash' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateFoodDto: UpdateFoodDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.foodService.update(id, { ...updateFoodDto, image });
  }

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN, UserRoles.ADMIN])
  @ApiOperation({ summary: "Taomni o'chirish" })
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.foodService.remove(id);
  }
}
