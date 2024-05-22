import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

enum Gender {
  Male = 'Male',
  Female = 'Female',
}
@InputType()
export class UpdateUserDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @Field()
  @IsEnum(Gender)
  @IsString()
  gender: Gender;

  @Field()
  //@IsString()
  avatar: string;
}
