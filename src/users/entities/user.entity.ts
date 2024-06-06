import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Schema({ timestamps: true })
export class User extends Document {
  @ApiProperty()
  @Field()
  @Prop({ trim: true, required: true })
  firstName: string;

  @ApiProperty()
  @Field()
  @Prop({ trim: true, required: true })
  lastName: string;

  @ApiProperty()
  @Field()
  @Prop({ unique: true, trim: true, required: true, lowercase: true })
  email: string;

  @ApiProperty()
  @Prop({ trim: true, required: true })
  password: string;

  @ApiProperty()
  @Field()
  @Prop({ trim: true })
  phone: string;

  @ApiProperty()
  @Field()
  @Prop({ trim: true })
  gender: string;

  @Field()
  @Prop({ trim: true })
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
