import { IsArray, IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum DiscountType {
  none = 'none',
  percentage = 'percentage',
  fixed = 'fixed',
}

export class CreateDiscountDto {
  @IsNotEmpty()
  @IsString()
  type: DiscountType;

  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsString()
  startDate: Date;

  @IsNotEmpty()
  @IsString()
  endDate: Date;

  @IsNotEmpty()
  @IsString({ each: true })
  @IsArray()
  products: string[];
}