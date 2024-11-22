import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ParseObjectIdPipe } from '@pipes';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Protected, Roles } from '@decorators';
import { UserRoles } from '../user';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN, UserRoles.ADMIN])
  @ApiOperation({ summary: 'Yangi kategoriya yaratish' })
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Protected(false)
  @Roles([UserRoles.SUPER_ADMIN, UserRoles.ADMIN, UserRoles.USER])
  @ApiOperation({ summary: 'Barcha kategoriyalarni olish' })
  @Get('/all/:restaurantId')
  async findAll(
    @Param('restaurantId', ParseObjectIdPipe) restaurantId: string,
  ) {
    return await this.categoryService.findAll(restaurantId);
  }

  @Protected(false)
  @Roles([UserRoles.SUPER_ADMIN, UserRoles.ADMIN, UserRoles.USER])
  @ApiOperation({ summary: 'Bitta kategoriyani olish' })
  @Get('/one/:id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.categoryService.findOne(id);
  }

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN, UserRoles.ADMIN])
  @ApiOperation({ summary: 'Kategoriyani tahrirlash' })
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN, UserRoles.ADMIN])
  @ApiOperation({ summary: "Kategoriyani o'chirish" })
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.categoryService.remove(id);
  }
}
