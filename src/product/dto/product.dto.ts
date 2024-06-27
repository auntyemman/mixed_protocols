import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class UpdateProductDto {}
