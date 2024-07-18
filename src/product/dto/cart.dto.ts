import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  isNotEmpty,
} from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty()
  @IsString()
  cartId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
export class UpdateCartDto {
  @IsNotEmpty()
  @IsString()
  cartId: string;

  @IsNotEmpty()
  @IsString()
  productId: string;
}

export class ClearCartDto {
  @IsNotEmpty()
  @IsString()
  cartId: string;
}
