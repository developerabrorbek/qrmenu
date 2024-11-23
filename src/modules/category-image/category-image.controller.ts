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
import { CategoryImageService } from './category-image.service';
import { CreateCategorImageDto, UpdateCategoryImageDto } from './dto';
import { ParseObjectIdPipe } from '@pipes';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Protected, Roles } from '@decorators';
import { UserRoles } from '../user';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Category Image')
@Controller('category-image')
export class CategoryImageController {
  constructor(private readonly categoryImageService: CategoryImageService) {}

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN])
  @ApiOperation({ summary: 'Yangi kategoriya rasmini yaratish' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async create(
    @Body() payload: CreateCategorImageDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.categoryImageService.create({ ...payload, image });
  }

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN, UserRoles.ADMIN])
  @ApiOperation({ summary: 'Barcha kategoriya rasmlarini olish' })
  @Get('/all')
  async findAll() {
    return await this.categoryImageService.findAll();
  }

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN, UserRoles.ADMIN])
  @ApiOperation({ summary: 'Bitta kategoriya rasmini olish' })
  @Get('/one/:id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.categoryImageService.findOne(id);
  }

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN])
  @ApiOperation({ summary: 'Kategoriya rasmini tahrirlash' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() payload: UpdateCategoryImageDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.categoryImageService.update(id, {...payload, image});
  }

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN])
  @ApiOperation({ summary: "Kategoriya rasmini o'chirish" })
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.categoryImageService.remove(id);
  }
}
