import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({ timestamps: true })
export class Group extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  senderId: string;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'User', required: true })
  receivers: string[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
