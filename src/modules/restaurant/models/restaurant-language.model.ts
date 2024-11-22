import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type RestaurantLanguageDocument = HydratedDocument<RestaurantLanguage>;

@Schema({
  collection: 'restaurant_language',
  timestamps: true,
  _id: false,
  id: false,
})
export class RestaurantLanguage {
  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'Restaurant' })
  restaurant: string;

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'Language' })
  language: string;
}

export const RestaurantLanguageSchema =
  SchemaFactory.createForClass(RestaurantLanguage);
