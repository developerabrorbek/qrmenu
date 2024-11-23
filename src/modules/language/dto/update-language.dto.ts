import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateLanguageDto } from './create-language.dto';

export class UpdateLanguageDto extends OmitType(
  PartialType(CreateLanguageDto),
  ['code'],
) {}
