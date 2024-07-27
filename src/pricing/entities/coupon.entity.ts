import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CouponType } from '../dto/coupon.dto';

@Schema()
export class Coupon extends Document {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true, default: CouponType.none })
  type: CouponType;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
  products: Types.ObjectId[] | string[];
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
