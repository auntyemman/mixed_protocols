import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Items, OrderStatus } from '../dto/order.dto';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop([
    {
      productId: { type: SchemaTypes.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    },
  ])
  items: Items;

  @Prop({ trim: true, default: 0 })
  total: number;

  @Prop({
    type: String,
    trim: true,
    default: 'pending',
  })
  status: OrderStatus;

  @Prop({ trim: true })
  paymentReference: string;

  @Prop({
    trim: true,
    enum: ['paid', 'failed', 'unpaid'],
    default: 'unpaid',
  })
  paymentStatus: string;

}

export const OrderSchema = SchemaFactory.createForClass(Order);
