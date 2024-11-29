import { IsObjectId } from '@decorators';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsObject, IsOptional } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  image: Express.Multer.File;

  @ApiProperty({
    type: 'object',
    properties: {
      uz: {
        type: 'string',
      },
      ru: {
        type: 'string',
      },
    },
  })
  @Transform(({ value }) => {
    if(value?.length) {
      return JSON.parse(value)
    }
  })
  @IsOptional()
  @IsObject()
  description?: Record<string, string> | null;

  @ApiProperty({
    type: 'object',
    properties: {
      uz: {
        type: 'string',
      },
      ru: {
        type: 'string',
      },
    },
  })
  @Transform(({ value }) => JSON.parse(value))
  @IsObject()
  name: Record<string, string>;

  @ApiProperty({
    type: 'string',
    required: true,
    example: '6740d72e5d8b643546bc700b',
  })
  @IsObjectId()
  userId: string;

  @ApiProperty({
    description: "Array of language id's",
    type: [String],
    example: ['tag1', 'tag2'],
  })
  @Transform(({ value }) => {
    if (value.includes('[')) return JSON.parse(value);

    if (value.includes(',')) return value.split(',');
  })
  @IsArray()
  @IsObjectId({ each: true })
  languages: string[];
}
