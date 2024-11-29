import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsObject } from 'class-validator';

export class CreateCategorImageDto {
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
  description: string;

  @ApiProperty({
    type: String,
    format: "binary",
    required: true,
  })
  image: Express.Multer.File;
}
