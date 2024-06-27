import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop([
    {
      productId: { type: SchemaTypes.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    },
  ])
  items: { productId: string; quantity: number }[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
