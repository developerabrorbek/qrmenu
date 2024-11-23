import { IsNumberString, IsString } from 'class-validator';
import { IsObjectId } from '@decorators';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFoodDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: '{uz: "1-taomlar",en: "1-meals"}',
  })
  @IsString()
  name: Record<string,string>;

  @ApiProperty({
    type: 'string',
    required: true,
    example: '{uz: "1-taomlar",en: "1-meals"}',
  })
  @IsString()
  description: Record<string,string>;

  @ApiProperty({
    type: 'number',
    required: true,
    example: 55000,
  })
  @IsNumberString()
  price: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  image: Express.Multer.File;

  @ApiProperty({
    type: 'string',
    required: true,
    example: '6740d72e5d8b643546bc700b',
  })
  @IsObjectId()
  categoryId: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: '6740d72e5d8b643546bc700b',
  })
  @IsObjectId()
  restaurantId: string;
}
