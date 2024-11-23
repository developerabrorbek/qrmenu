import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateFoodDto } from './create-food.dto';

export class UpdateFoodDto extends OmitType(PartialType(CreateFoodDto), ["restaurantId", "categoryId"]) {}
