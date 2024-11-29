import { IsObjectId } from '@decorators';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsObject, IsString } from 'class-validator';

export class CreateCategoryDto {
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
  name: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  image: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsObjectId()
  restaurantId: string;
}
