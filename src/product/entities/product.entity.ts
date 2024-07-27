import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  price: number;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true })
  basePrice: number;

  @Prop({ default: false })
  isDiscounted: boolean;

  @Prop()
  discountPercentage: number;

  @Prop()
  discountStartDate: Date;

  @Prop()
  discountEndDate: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
