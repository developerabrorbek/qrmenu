import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type LanguageDocument = HydratedDocument<Language>;

@Schema({ collection: 'languages', timestamps: true })
export class Language {
  @Prop({ type: SchemaTypes.String, required: true })
  name: string;

  @Prop({
    type: SchemaTypes.String,
    maxlength: 2,
    minlength: 2,
    required: true,
    unique: true,
  })
  code: string;

  @Prop({ type: SchemaTypes.String })
  image?: string;
}

export const LanguageSchema = SchemaFactory.createForClass(Language);
