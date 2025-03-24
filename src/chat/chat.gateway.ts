import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { newChatDto } from './dto/create-chat.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { Server, Socket } from 'socket.io';
import { OnModuleInit, UseGuards } from '@nestjs/common';
import { ServerToClientEvents } from './common/interfaces/event.interface';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { Chat } from './entities/chat.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { JoinGroupDto } from './dto/join-group.dto';
import { WsMiddleware } from 'src/common/middlewares/ws.middleware';

@WebSocketGateway(3001, { namespace: '/chat' })
@UseGuards(JwtAuthGuard)
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server; // <any, ServerToClientEvents>;

  afterInit(client: Socket) {
    client.use(WsMiddleware() as any);
  }
  async handleConnection(@ConnectedSocket() client: Socket) {
    const userId = client.data.user?.userId; // get user id from the decoded data
    client.join(userId); // User joins websocket client room by id.
    console.log(`Client connected: ${client.id}, joined room: ${userId}`);
}
  constructor(private readonly chatService: ChatService) {}


  /**---------------http hybrid method--------------- */
  // chat
  async sendNewChat(newChatDto: newChatDto) {
    const chat = await this.chatService.newChat(newChatDto);
    this.server.emit(`receiveMessage ${newChatDto.conversationId}`, newChatDto);
    return chat;
  }
  async joinGroup(groupId: string, userId: string) {
    this.server.emit(`joinGroup ${groupId}`, userId);
  }

  async leaveGroup(groupId: string, userId: string) {
    this.server.emit(`joinGroup ${groupId}`, userId);
  }
  /**------xx---------http hybrid method--------xx------- */


  @SubscribeMessage('typing')
  async onTyping(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    //const getUserName = await this.chatService.getUserFromClientId(client.id);
    client.broadcast.emit('typing', { isTyping });
  }
}
