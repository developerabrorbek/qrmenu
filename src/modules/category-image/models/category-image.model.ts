import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type CategoryImageDocument = HydratedDocument<CategoryImage>;

@Schema({ collection: 'category_images', timestamps: true })
export class CategoryImage {
  @Prop({ type: SchemaTypes.Mixed, required: true })
  description: Record<string, string>;

  @Prop({ type: SchemaTypes.String })
  image: string;
}

export const CategoryImageSchema = SchemaFactory.createForClass(CategoryImage);
