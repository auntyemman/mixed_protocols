import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DiscountType } from '../dto/discount.dto';

@Schema({ timestamps: true })
export class Discount extends Document {
  @Prop({ required: true, default: DiscountType.none })
  type: DiscountType;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
  products: Types.ObjectId[];
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);
