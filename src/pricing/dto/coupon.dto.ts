import {
  IsString,
  IsDate,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum CouponType {
    none = 'none',
    percentage = 'percentage',
    fixed = 'fixed',
}


export class CreateCouponDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsEnum(CouponType)
  type: CouponType;

  @IsNumber()
  value: number;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsArray()
  @IsString({ each: true })
  products: string[];
}
