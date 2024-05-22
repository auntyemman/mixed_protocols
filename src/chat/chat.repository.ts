import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateChatDto } from './dto/create-chat.dto';
import { Chat } from './entities/chat.entity';
import { JoinChatDto } from './dto/join-chat.dto';

@Injectable()
export class ChatRepository {
  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {}

  async create(createChatDto: CreateChatDto): Promise<Chat> {
    const createdChat = new this.chatModel(createChatDto);
    if (!createdChat) {
      throw new InternalServerErrorException('Failed to create chat');
    }
    return await createdChat.save();
  }

//   async joinRoom(joinChatDto: JoinChatDto, socketId: string): Promise<Chat> {
//     const findRoom = await this.chatModel.findOne({ clientId: socketId });
//     if (!findRoom) {
//       throw new BadRequestException('Room does not exists');
//     }
//     joinChatDto.receivers.map((receiver) => {
//       return findRoom.receivers.push(receiver);
//     });
//     return await findRoom.save();
//   }

  async findAll(): Promise<Chat[]> {
    return await this.chatModel.find();
  }

  async findOne(id: string): Promise<Chat> {
    return await this.chatModel.findById(id);
  }

  async findByClientId(socketId: string): Promise<Chat> {
    return await this.chatModel
      .findOne({ clientId: socketId })
      .populate('sender');
  }

  async update(id: string, updateChatDto: CreateChatDto): Promise<Chat> {
    return await this.chatModel.findByIdAndUpdate(id, updateChatDto, {
      new: true,
    });
  }

  async delete(id: string): Promise<Chat> {
    return await this.chatModel.findByIdAndDelete(id);
  }
}
