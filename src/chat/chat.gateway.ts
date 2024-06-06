import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { Server, Socket } from 'socket.io';
import { OnModuleInit, UseGuards } from '@nestjs/common';
import { ServerToClientEvents } from './common/interfaces/event.interface';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { WsMiddleware } from './common/middlewares/ws.middleware';
import { Chat } from './entities/chat.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { JoinGroupDto } from './dto/join-group.dto';

@WebSocketGateway(3001, { namespace: '/chat' })
@UseGuards(JwtAuthGuard)
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server; // <any, ServerToClientEvents>;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('a user connected', socket.id);
    });
  }
  afterInit(client: Socket) {
    client.use(WsMiddleware() as any);
  }
  constructor(private readonly chatService: ChatService) {}

  /**---------------http hybrid method--------------- */
  // chat
  async handleSendMessage(createChatDto: CreateChatDto) {
    const chat = await this.chatService.createChat(createChatDto);
    this.server.emit(
      `receiveMessage ${createChatDto.conversationId}`,
      createChatDto,
    );
    return chat;
  }
  async joinGroup(groupId: string, userId: string) {
    this.server.emit(`joinGroup ${groupId}`, userId);
  }

  async leaveGroup(groupId: string, userId: string) {
    this.server.emit(`joinGroup ${groupId}`, userId);
  }
  /**------xx---------http hybrid method--------xx------- */

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ): Promise<any> {
    const userId = client.data.user?.userId;
    console.log('user', userId);
    return 'Hello there';
  }

  @SubscribeMessage('newMessage')
  async newMessage(@MessageBody() createChatDto: CreateChatDto) {
    const createdMessage = await this.chatService.createChat(createChatDto);
    this.server.emit('newMessage', createdMessage);
  }

  @SubscribeMessage('createChat')
  async create(
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    // createChatDto.sender = client.id;
    console.log('create chat', createChatDto, client.id);
    const newChat = await this.chatService.createChat(createChatDto);
    this.server.emit('newMessage', {
      msg: 'new message',
      content: createChatDto.content,
    });
    return newChat;
  }

  // @SubscribeMessage('joinChat')
  // async joinRoom(
  //   @MessageBody() joinChatDto: JoinChatDto,
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   // return await this.chatService.joinRoom(joinChatDto, client.id);
  // }

  @SubscribeMessage('typing')
  async onTyping(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    //const getUserName = await this.chatService.getUserFromClientId(client.id);
    client.broadcast.emit('typing', { isTyping });
  }

}
