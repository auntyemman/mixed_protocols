import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Items } from 'src/product/dto/order.dto';

export class InitializeTransactionDto {
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  paymentReference: string;

  @IsOptional()
  @IsString()
  paymentlink: string;
}
export class UpdatePaymentDto {
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  paymentReference: string;

  @IsNotEmpty()
  @IsString()
  paymentStatus: string;

  @IsNotEmpty()
  @IsString()
  paymentAmount: string;

  @IsNotEmpty()
  @IsString()
  paymentCurrency: string;

  @IsNotEmpty()
  @IsString()
  transactionDate: string;

  @IsNotEmpty()
  @IsString()
  customerEmail: string;

  @IsNotEmpty()
  @IsString()
  paymentMethod: string;
}

export type PaymentPayload = {
  email: string;
  amount: number;
  orderId: string;
  userId: string;
  items: Items;
  product: any;
};
