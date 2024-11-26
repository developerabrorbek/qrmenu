import { IsObjectId } from '@decorators';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

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
  @IsString()
  description?: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: '{uz: "1-taomlar",en: "1-meals"}',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: '6740d72e5d8b643546bc700b',
  })
  @IsObjectId()
  userId: string;

  @ApiProperty({
    type: [String],
    required: true,
  })
  @Transform(({ value }) => JSON.parse(value))
  @IsArray()
  @IsObjectId({ each: true })
  languages: string[] | string;
}
