import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCategorImageDto } from './create-category-image.dto';

export class UpdateCategoryImageDto extends PartialType(
  CreateCategorImageDto,
) {}
