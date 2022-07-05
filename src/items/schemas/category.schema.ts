import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

/**
 * Types of categories
 */
export enum CategoryType {
  main,
  sub,
}

export type CategoryDocument = Category & Document;

@Schema({
  timestamps: true,
})
export class Category {
  @Prop({ enum: Object.values(CategoryType) })
  type: string;

  @Prop({ unique: true })
  name: string;

  @Prop()
  listOrder: number;

  @Prop()
  backgroundColor: string;

  @Prop()
  borderColor: string;

  @Prop()
  textColor: string;

  @Prop()
  imageUrl: string;

  @Prop({ default: false })
  isSpecial: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
