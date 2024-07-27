import { Injectable } from '@nestjs/common';
import { DiscountService } from './services/discount.service';
import { CouponService } from './services/coupon.service';
import { PricingStrategyFactory } from './pricing.strategy.factory';
import { PricingStrategy } from './interfaces/pricing-strategy.interface';
import { ProductDocument } from '../product/entities/product.entity';
import { DiscountType } from './dto/discount.dto';

@Injectable()
export class PricingService {
  constructor(
    private discountService: DiscountService,
    private couponService: CouponService,
    private pricingStrategyFactory: PricingStrategyFactory,
  ) {}

  async applyDiscount(product: ProductDocument): Promise<ProductDocument> {
    const now = new Date();
    const activeDiscount = await this.discountService.getActiveDiscount(
      product._id,
      now,
    );

    const strategy = activeDiscount
      ? this.pricingStrategyFactory.getStrategy(activeDiscount.type)
      : this.pricingStrategyFactory.getStrategy('none');

    this.applyPricingStrategy(
      product,
      strategy,
      activeDiscount ? activeDiscount.value : 0,
      activeDiscount,
    );
    return product;
  }

  async applyCoupon(
    product: ProductDocument,
    couponCode: string,
  ): Promise<ProductDocument> {
    const now = new Date();
    const activeCoupon = await this.couponService.getActiveCoupon(
      product._id,
      couponCode,
      now,
    );

    const strategy = activeCoupon
      ? this.pricingStrategyFactory.getStrategy(activeCoupon.type)
      : this.pricingStrategyFactory.getStrategy('none');

    this.applyPricingStrategy(
      product,
      strategy,
      activeCoupon ? activeCoupon.value : 0,
      activeCoupon,
    );
    return product;
  }

  private applyPricingStrategy(
    product: ProductDocument,
    strategy: PricingStrategy,
    value: number,
    discountOrCoupon: any,
  ): void {
    product.price = strategy.calculateFinalPrice(product.basePrice, value);
    product.discountPercentage = strategy.calculateDiscount(
      product.basePrice,
      value,
    );
    product.isDiscounted = value !== 0;
    if (discountOrCoupon) {
      product.discountStartDate = discountOrCoupon.startDate;
      product.discountEndDate = discountOrCoupon.endDate;
    } else {
      product.discountStartDate = undefined;
      product.discountEndDate = undefined;
    }
  }
}
