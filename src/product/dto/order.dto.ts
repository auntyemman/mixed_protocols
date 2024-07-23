import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum OrderStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}
export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsArray()
  items: Items;

  @IsNumber()
  total: number;
}

export type Items = [
  {
    productId: string;
    quantity: number;
  },
];

export class UpdateOrderDto {}
