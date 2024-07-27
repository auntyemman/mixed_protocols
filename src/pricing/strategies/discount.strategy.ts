import { Injectable } from '@nestjs/common';
import { PricingStrategy } from '../interfaces/pricing-strategy.interface';
  
@Injectable()
export class PercentageDiscountStrategy implements PricingStrategy {
  calculateFinalPrice(basePrice: number, value: number): number {
    return basePrice * (1 - value / 100);
  }

  calculateDiscount(basePrice: number, value: number): number {
    return (value / basePrice) * 100;
  }
}

@Injectable()
export class FixedDiscountStrategy implements PricingStrategy {
  calculateFinalPrice(basePrice: number, value: number): number {
    return basePrice - value;
  }

  calculateDiscount(basePrice: number, value: number): number {
    return value;
  }
}

@Injectable()
export class NoDiscountStrategy implements PricingStrategy {
  calculateFinalPrice(basePrice: number, value: number): number {
    return basePrice;
  }

  calculateDiscount(basePrice: number, value: number): number {
    return 0;
  }
}

