import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@pipes';
import { Protected, Roles } from '@decorators';
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
  @Post()
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantService.create(createRestaurantDto);
  }

  @Protected(false)
  @Roles([UserRoles.SUPER_ADMIN, UserRoles.ADMIN, UserRoles.USER])
  @ApiOperation({ summary: 'Barcha restoranlarni olish' })
  @Get()
  findAll() {
    return this.restaurantService.findAll();
  }

  @Protected(false)
  @Roles([UserRoles.SUPER_ADMIN, UserRoles.ADMIN, UserRoles.USER])
  @ApiOperation({ summary: 'Bitta restoranni olish' })
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.restaurantService.findOne(id);
  }

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN, UserRoles.ADMIN])
  @ApiOperation({ summary: 'Restoranni tahrirlash' })
  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantService.update(id, updateRestaurantDto);
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
