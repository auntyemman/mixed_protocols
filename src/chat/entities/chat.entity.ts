import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, SchemaTypes } from 'mongoose';

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop({ type: String, trim: true })
  content: string;

  @Prop({ type: String, trim: true })
  senderName: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  sender: string;

  @Prop({ type: { type: SchemaTypes.ObjectId, ref: 'User' } })
  receiver: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
