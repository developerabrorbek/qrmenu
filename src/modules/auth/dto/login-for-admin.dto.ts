import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginForAdminDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'admin',
  })
  @IsString()
  username: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'admin',
  })
  @IsString()
  password: string;
}
