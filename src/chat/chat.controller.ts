import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { Conversation } from './entities/conversation.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { JoinGroupDto } from './dto/join-group.dto';
import { Request } from 'express';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Post('conversation')
  async createConversation(
    @Body() createConversationDto: CreateConversationDto,
  ) {
    return await this.chatService.createConversation(createConversationDto);
  }

  @Post('group')
  async createGroup(@Body() createGroupDto: CreateGroupDto) {
    return await this.chatService.createGroup(createGroupDto);
  }
  @Post('join-group/:groupId')
  async joinGroup(@Req() req: Request, @Param('groupId') groupId: string) {
    const { userId } = req.user as any;
    const group = await this.chatService.joinGroup(groupId, userId);
    this.chatGateway.joinGroup(groupId, userId);
    return group;
  }

  @Post('leave-group/:groupId')
  async leaveGroup(@Req() req: Request, @Param('groupId') groupId: string) {
    const { userId } = req.user as any;
    const group = await this.chatService.leaveGroup(groupId, userId);
    this.chatGateway.leaveGroup(groupId, userId);
    return group;
  }

  @Post('send')
  async sendMessage(@Body() createChatDto: CreateChatDto) {
    return await this.chatGateway.handleSendMessage(createChatDto);
  }

  @Get('history/:conversationId')
  async getChatHistory(
    @Param('conversationId') conversationId: string,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    console.log(user.userId);
    //console.log(req.user);
    return this.chatService.getChatHistory(conversationId);
  }
}
