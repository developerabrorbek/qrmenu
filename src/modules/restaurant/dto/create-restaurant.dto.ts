import { IsObjectId } from '@decorators';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject, IsString } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  image: Express.Multer.File;

  @ApiProperty({
    type: 'string',
    required: false,
    example: '{uz: "1-taomlar",en: "1-meals"}',
  })
  @IsObject()
  description?: Record<string,string>;

  @ApiProperty({
    type: 'string',
    required: true,
    example: '{uz: "1-taomlar",en: "1-meals"}',
  })
  @IsObject()
  name: Record<string,string>;

  @ApiProperty({
    type: 'string',
    required: true,
    example: '6740d72e5d8b643546bc700b',
  })
  @IsObjectId()
  userId: string;

  @ApiProperty({
    type: 'array',
    required: true,
    example: ['6740d72e5d8b643546bc700b', '6740d72e5d8b643546bc700c'],
  })
  @IsArray()
  @IsObjectId({ each: true })
  languages: string[];
}
