import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type RestaurantDocument = HydratedDocument<Restaurant>;

@Schema({ collection: 'restaurants', timestamps: true })
export class Restaurant {
  @Prop({ type: SchemaTypes.Mixed, required: true })
  name: Record<string,string>;

  @Prop({ type: SchemaTypes.Mixed })
  description?: Record<string,string>;

  @Prop({ type: SchemaTypes.String })
  image?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  user: string;

  @Prop({ type: [{ type: SchemaTypes.ObjectId }], ref: 'Language' })
  languages: string[];
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
