import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { JoinChatDto } from './dto/join-chat.dto';
import { Server, Socket } from 'socket.io';
import { OnModuleInit, UseGuards } from '@nestjs/common';
import { ServerToClientEvents } from './common/interfaces/event.interface';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { WsMiddleware } from './common/middlewares/ws.middleware';

@WebSocketGateway(3001, { namespace: '/chat' })
@UseGuards(JwtAuthGuard)
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server<any, ServerToClientEvents>;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('a user connected', socket.id);
    });
  }
  afterInit(client: Socket) {
    client.use(WsMiddleware() as any);
  }
  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ): Promise<any> {
    const userId = client.data.user?.userId;
    console.log('user', userId);
    return 'Hello there';
  }

  async handleSendMessage(createChatDto: CreateChatDto) {
    await this.chatService.create(createChatDto);
    this.server
      //.to(createChatDto.receiver)
      .emit('receiveMessage', createChatDto);
  }

  @SubscribeMessage('newMessage')
  async newMessage(@MessageBody() createChatDto: CreateChatDto) {
    const createdMessage = await this.chatService.create(createChatDto);
    this.server.emit('newMessage', createdMessage);
  }

  @SubscribeMessage('createChat')
  async create(
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    createChatDto.sender = client.id;
    const newChat = await this.chatService.create(createChatDto);
    // this.server.emit('onMessage', {
    //   msg: 'new message',
    //   content: createChatDto,
    // });
    return newChat;
  }

  // @SubscribeMessage('joinChat')
  // async joinRoom(
  //   @MessageBody() joinChatDto: JoinChatDto,
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   return await this.chatService.joinRoom(joinChatDto, client.id);
  // }

  @SubscribeMessage('typing')
  async onTyping(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const getUserName = await this.chatService.getUserFromClientId(client.id);
    client.broadcast.emit('typing', { isTyping, serverName: getUserName });
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    return this.chatService.findOne(id);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatService.remove(id);
  }
}
