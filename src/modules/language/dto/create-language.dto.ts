import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateLanguageDto {
  @ApiProperty({
    type: 'string',
    description: 'Name for the language',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
    maxLength: 2,
    minLength: 2,
    required: true,
    description: 'Unique code for the language',
  })
  @Length(2, 2)
  @IsString()
  code: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    description: 'Image file for the language',
  })
  image: Express.Multer.File;
}
