import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { CreateChatDto } from './dto/create-chat.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Post('send')
  async sendMessage(@Body() createChatDto: CreateChatDto) {
    const message = await this.chatService.create(createChatDto);
    await this.chatGateway.handleSendMessage(createChatDto);
    return message;
  }

//   @Get('history/:sender/:recipient')
//   async getChatHistory(
//     @Param('sender') sender: string,
//     @Param('recipient') recipient: string,
//   ) {
//     return this.chatService.getChatHistory(sender, recipient);
//   }
}
