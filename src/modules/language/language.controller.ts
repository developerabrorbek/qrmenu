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
import { LanguageService } from './language.service';
import { CreateLanguageDto, UpdateLanguageDto } from './dto';
import { Protected, Roles } from '@decorators';
import { UserRoles } from '../user';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Language')
@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN])
  @ApiOperation({ summary: 'Yangi til yaratish' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(
    @Body() createLanguageDto: CreateLanguageDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.languageService.create({ ...createLanguageDto, image });
  }

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN, UserRoles.ADMIN])
  @ApiOperation({ summary: 'Barcha tillarni olish' })
  @Get()
  findAll() {
    return this.languageService.findAll();
  }

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN, UserRoles.ADMIN])
  @ApiOperation({ summary: 'Bitta tilni olish' })
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.languageService.findOne(id);
  }

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN])
  @ApiOperation({ summary: 'Tilni tahrirlash' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateLanguageDto: UpdateLanguageDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.languageService.update(id, { ...updateLanguageDto, image });
  }

  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRoles.SUPER_ADMIN])
  @ApiOperation({ summary: "Tilni o'chirish" })
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.languageService.remove(id);
  }
}
