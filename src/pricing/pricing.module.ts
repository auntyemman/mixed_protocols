import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { PricingStrategyFactory } from './pricing.strategy.factory';
import { DiscountService } from './services/discount.service';
import { CouponService } from './services/coupon.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Discount, DiscountSchema } from './entities/discount.entity';
import { Coupon, CouponSchema } from './entities/coupon.entity';
import { PricingController } from './pricing.controller';
import {
  PercentageDiscountStrategy,
  FixedDiscountStrategy,
  NoDiscountStrategy,
} from './strategies/discount.strategy';
import { DiscountRepository } from './repositories/discount.repository';
import { CouponRepository } from './repositories/coupon.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Discount.name, schema: DiscountSchema },
    ]),
    MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }]),
  ],
  controllers: [PricingController],
  providers: [
    PricingService,
    PricingStrategyFactory,
    DiscountService,
    CouponService,
    PercentageDiscountStrategy,
    FixedDiscountStrategy,
    NoDiscountStrategy,
    DiscountRepository,
    CouponRepository,
  ],
  exports: [PricingService],
})
export class PricingModule {}
