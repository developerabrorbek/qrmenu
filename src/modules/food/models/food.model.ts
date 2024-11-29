import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type FoodDocument = HydratedDocument<Food>;

@Schema({ collection: 'foods', timestamps: true })
export class Food {
  @Prop({ type: SchemaTypes.Mixed, required: true })
  name: Record<string, string>;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  description: Record<string, string>;

  @Prop({ type: SchemaTypes.Number, required: true })
  price: number;

  @Prop({ type: SchemaTypes.String, required: true })
  image: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Restaurant' })
  restaurant: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Category' })
  category: string;
}

export const FoodSchema = SchemaFactory.createForClass(Food);
