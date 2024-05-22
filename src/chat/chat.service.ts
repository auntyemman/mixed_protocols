import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { JoinChatDto } from './dto/join-chat.dto';
import { ChatRepository } from './chat.repository';
import { UsersService } from 'src/users/users.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(createChatDto: CreateChatDto) {
    const user = await this.usersService.getUserById(createChatDto.sender);
    if (!user) {
      throw new WsException('User not found');
    }
    const newChat = await this.chatRepository.create(createChatDto);
    return newChat;
  }
  async getUserFromClientId(id: string) {
    const user = await this.chatRepository.findByClientId(id);
    return user.senderName;
  }

  // async joinRoom(joinChatDto: JoinChatDto, socketId: string) {
  //   const user = await this.usersService.getUserById(joinChatDto.sender);
  //   if (!user) {
  //     throw new Error('User not found');
  //   }
  //   return await this.chatRepository.joinRoom(joinChatDto, socketId);
  // }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
