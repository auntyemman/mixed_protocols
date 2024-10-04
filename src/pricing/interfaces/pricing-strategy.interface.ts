export interface PricingStrategy {
  calculateFinalPrice(basePrice: number, value: number): number;
  calculateDiscount(basePrice: number, value: number): number;
}
