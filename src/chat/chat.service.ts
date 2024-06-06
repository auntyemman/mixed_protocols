import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { ChatRepository } from './chat.repository';
import { UsersService } from 'src/users/users.service';
import { WsException } from '@nestjs/websockets';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { JoinGroupDto } from './dto/join-group.dto';
import { ObjectId } from 'mongoose';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly usersService: UsersService,
  ) {}

  /**---------------------------Conversation----------------------- */
  async createConversation(createConversationDto: CreateConversationDto) {
    const user = await this.usersService.getUserById(
      createConversationDto.recipientId,
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const existingConversation = await this.chatRepository.findOneConversation({
      ...createConversationDto,
    });
    if (!existingConversation) {
      const newConversation = await this.chatRepository.createConversation(
        createConversationDto,
      );
      return newConversation;
    }
    return existingConversation;
  }

  /**---------------------------Group----------------------- */
  async createGroup(createGroupDto: CreateGroupDto) {
    createGroupDto.receivers.push(createGroupDto.senderId);
    const newGroup = await this.chatRepository.createGroup(createGroupDto);
    return newGroup;
  }

  async joinGroup(groupId: string, userId: string) {
    const group = await this.chatRepository.findOneGroup(groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    if (group.receivers.includes(userId)) {
      throw new UnprocessableEntityException('User already in group');
    }
    group.receivers.push(userId);
    return await this.chatRepository.UpdateGroup(groupId, group);
  }
  async leaveGroup(groupId: string, userId: string) {
    const group = await this.chatRepository.findOneGroup(groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    if (!group.receivers.includes(userId)) {
      throw new UnprocessableEntityException('user not in group');
    }
    return await this.chatRepository.UpdateGroup(groupId, {
      $pull: { receivers: userId },
    });
  }

  async findOneGroup(id: string) {
    return await this.chatRepository.findOneGroup(id);
  }

  async createChat(createChatDto: CreateChatDto) {
    const user = await this.usersService.getUserById(createChatDto.authorId);
    if (!user) {
      throw new WsException('User not found');
    }
    const newChat = await this.chatRepository.createChat(createChatDto);
    return newChat;
  }

  async getChatHistory(conversationId: string) {
    return await this.chatRepository.getChatWithFilter({
      conversationId: conversationId,
    });
  }

  // async joinRoom(joinChatDto: JoinChatDto, socketId: string) {
  //   const user = await this.usersService.getUserById(joinChatDto.sender);
  //   if (!user) {
  //     throw new Error('User not found');
  //   }
  //   return await this.chatRepository.joinRoom(joinChatDto, socketId);
  // }

}
