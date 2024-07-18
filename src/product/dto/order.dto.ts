import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
