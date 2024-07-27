import { Controller, Post, Body } from '@nestjs/common';
import { DiscountService } from './services/discount.service';
import { CreateDiscountDto } from './dto/discount.dto';
import { CouponService } from './services/coupon.service';
import { CreateCouponDto } from './dto/coupon.dto';

@Controller('pricing')
export class PricingController {
  constructor(
    private readonly discountService: DiscountService,
    private readonly couponService: CouponService,

  ) {}

  @Post('/discount')
  async createDiscount(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.createDiscount(createDiscountDto);
  }

  @Post('/coupon')
  async createCoupon(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.createCoupon(createCouponDto);
  }
}
