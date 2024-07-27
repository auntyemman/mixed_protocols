import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Discount } from '../entities/discount.entity';
import { CreateDiscountDto } from '../dto/discount.dto';

@Injectable()
export class DiscountService {
  constructor(
    @InjectModel(Discount.name) private discountModel: Model<Discount>,
  ) {}

  async createDiscount(
    createDiscountDto: CreateDiscountDto,
  ): Promise<Discount> {
    const discount = new this.discountModel(createDiscountDto);
    return discount.save();
  }
  async getActiveDiscount(productId: string, now: Date): Promise<Discount> {
    return this.discountModel.findOne({
      products: productId,
      startDate: { $lte: now },
      endDate: { $gte: now },
    });
  }
}
