import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { phoneRegex } from '@constants';
import { UserRoles } from '../models';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'admin',
  })
  @IsString()
  username: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: 'admin',
  })
  @IsString()
  password: string;

  @ApiProperty({
    type: 'string',
    required: false,
    example: '941234567',
  })
  @IsOptional()
  @Matches(phoneRegex)
  @IsString()
  phone?: string;

  @ApiProperty({
    type: 'string',
    required: false,
    example: 'Tomas Shelbi',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    type: 'string',
    enum: UserRoles,
    default: UserRoles.USER,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRoles)
  role?: UserRoles;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  image?: Express.Multer.File;
}
