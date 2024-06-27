import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trime: true })
  name: string;

  @Prop({ required: true, trime: true })
  price: number;

  @Prop({ required: true, trime: true })
  description: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
