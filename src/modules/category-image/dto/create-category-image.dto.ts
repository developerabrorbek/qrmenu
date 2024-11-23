import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class CreateCategorImageDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: `{uz: "1-taomlar",en: "1-meals"}`,
  })
  @IsObject()
  description: Record<string, string>;

  @ApiProperty({
    type: String,
    format: "binary",
    required: true,
  })
  image: Express.Multer.File;
}
