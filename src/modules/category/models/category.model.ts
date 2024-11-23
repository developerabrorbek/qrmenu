import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ collection: 'categories', timestamps: true })
export class Category {
  @Prop({ type: SchemaTypes.Mixed, required: true })
  name: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Restaurant' })
  restaurant: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: "CategoryImage" })
  image: string;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Food' }] })
  foods: string[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
