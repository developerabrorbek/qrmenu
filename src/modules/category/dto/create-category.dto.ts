import { IsObjectId } from '@decorators';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    type: "string",
    required: true,
    example: `{uz: "1-taomlar",en: "1-meals"}`,
  })
  @IsString()
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
