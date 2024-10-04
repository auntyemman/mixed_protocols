import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Order', required: true })
  orderId: string;

  @Prop({ trim: true })
  paymentId: number;

  @Prop({ trim: true, required: true })
  paymentReference: string;

  @Prop({ trim: true })
  paymentlink: string;

  @Prop({
    trim: true,
    enum: ['paid', 'failed', 'unpaid'],
    default: 'unpaid',
  })
  paymentStatus: string;

  @Prop({ trim: true })
  paymentAmount: number;

  @Prop({ trim: true })
  paymentFees: number;

  @Prop({ trim: true })
  paymentCurrency: string;

  @Prop({ trim: true })
  transactionDate: Date;

  @Prop({ trim: true })
  customerEmail: string;

  @Prop({ trim: true })
  paymentMethod: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
