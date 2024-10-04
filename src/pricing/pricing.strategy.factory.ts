import { Injectable } from '@nestjs/common';
import { PricingStrategy } from './interfaces/pricing-strategy.interface';
import {
  PercentageDiscountStrategy,
  FixedDiscountStrategy,
  NoDiscountStrategy,
} from './strategies/discount.strategy';
import { DiscountType } from './dto/discount.dto';

@Injectable()
export class PricingStrategyFactory {
  constructor(
    private readonly percentageDiscountStrategy: PercentageDiscountStrategy,
    private readonly fixedDiscountStrategy: FixedDiscountStrategy,
    private readonly noDiscountStrategy: NoDiscountStrategy,
  ) {}

  getStrategy(type: string): PricingStrategy {
    switch (type) {
      case DiscountType.percentage:
        return this.percentageDiscountStrategy;
      case DiscountType.fixed:
        return this.fixedDiscountStrategy;
      default:
        return this.noDiscountStrategy;
    }
  }
}
