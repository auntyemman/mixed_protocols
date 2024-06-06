import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateChatDto } from './dto/create-chat.dto';
import { Chat } from './entities/chat.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    @InjectModel(Group.name) private groupModel: Model<Group>,
  ) {}

  /**---------------------------conversation----------------------- */
  async createConversation(
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    const createdConversation = await this.conversationModel.create(
      createConversationDto,
    );
    if (!createdConversation) {
      throw new InternalServerErrorException('Failed to create conversation');
    }
    return createdConversation;
  }

  async findOneConversation(
    FilterQuery: FilterQuery<Conversation>,
  ): Promise<Conversation> {
    const conversation = await this.conversationModel.findOne(FilterQuery);
    return conversation;
  }

  /**---------------------------Group----------------------- */
  async createGroup(createGroupDto: CreateGroupDto): Promise<Group> {
    const createdGroup = await this.groupModel.create(createGroupDto);
    if (!createdGroup) {
      throw new InternalServerErrorException('Failed to create group');
    }
    return createdGroup;
  }

  async findGroups(filter: FilterQuery<Group>): Promise<Group[]> {
    return await this.groupModel.find(filter);
  }

  async findOneGroup(id: string): Promise<Group> {
    const group = await this.groupModel.findOne({ _id: id });
    return group;
  }

  async UpdateGroup(id: string, updateGroupDto: any): Promise<Group> {
    const group = await this.groupModel.findByIdAndUpdate(id, updateGroupDto, {
      new: true,
    });
    return group;
  }

  /**---------------------------Chat message----------------------- */
  async createChat(createChatDto: CreateChatDto): Promise<Chat> {
    const createdChat = new this.chatModel(createChatDto);
    if (!createdChat) {
      throw new InternalServerErrorException('Failed to create chat');
    }
    return await createdChat.save();
  }

  async getChatWithFilter(filter: FilterQuery<Chat>): Promise<Chat[]> {
    return await this.chatModel.find(filter).sort({ createdAt: -1 });
  }
}
