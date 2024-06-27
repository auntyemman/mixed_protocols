import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Cart' }] })
  items: string[];

  @Prop({ required: true, default: 0 })
  total: number;

  @Prop({ type: String, required: true, default: 'pending' })
  status: string;

  @Prop({ required: true })
  paymentReference: string;

  @Prop({
    required: true,
    enum: ['paid', 'failed', 'unpaid'],
    default: 'unpaid',
  })
  paymentStatus: string;

  @Prop({ required: true })
  paymentAmount: number;

  @Prop({ required: true })
  paymentCurrency: string;

  @Prop({ required: true })
  transactionDate: Date;

  @Prop({ required: true })
  customerEmail: string;

  @Prop({ required: true })
  paymentMethod: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
