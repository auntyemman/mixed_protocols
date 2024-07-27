import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon } from '../entities/coupon.entity';
import { CreateCouponDto } from '../dto/coupon.dto';
import { CouponRepository } from '../repositories/coupon.repository';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name)
    private readonly couponRepository: CouponRepository,
  ) {}

  async createCoupon(createCouponDto: CreateCouponDto): Promise<Coupon> {
    const couponCode = this.generateUniqueCouponCode();
    createCouponDto.code = couponCode;
    const coupon = this.couponRepository.create(createCouponDto);
    return coupon;
  }

  async getActiveCoupon(
    productId: string,
    code: string,
    date: Date,
  ): Promise<Coupon | null> {
    return this.couponRepository
      .findOne({
        code,
        products: productId,
        startDate: { $lte: date },
        endDate: { $gte: date },
    });
  }

  private generateUniqueCouponCode(): string {
    return Math.random().toString(36).slice(2, 10); // generate unique coupon code of 8 characters
  }
}
