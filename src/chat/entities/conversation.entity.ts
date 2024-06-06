import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { Chat } from 'src/chat/entities/chat.entity';

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  senderId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  recipientId: string;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'User' })
  receivers?: string[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
