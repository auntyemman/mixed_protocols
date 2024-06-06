import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, SchemaTypes } from 'mongoose';
// import { User } from 'src/users/entities/user.entity';
// import { Conversation } from 'src/chat/entities/conversation.entity';

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop({ type: String, trim: true })
  content: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  authorId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Conversation' })
  conversationId: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
