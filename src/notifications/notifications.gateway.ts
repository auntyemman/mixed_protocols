import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { WsMiddleware } from 'src/common/middlewares/ws.middleware';

@WebSocketGateway({ namespace: '/notifications', cors: true })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(client: Socket) {
    client.use(WsMiddleware() as any); 
  }

  constructor(private readonly notificationsService: NotificationsService) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    const userId = client.data.user?.userId; // get user id from the decoded data
    client.join(userId); // User joins websocket client room by id
    console.log(`Client connected: ${client.id}, joined room: ${userId}`);
  }
  

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  async handleNotification(
    @MessageBody() data: { userId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Connected User Id', client.data.user?.userId);
    const notification =
      await this.notificationsService.create(data);

    // emits to the client
    this.server.to(data.userId).emit('newNotification', notification);
  }

  async sendNotification(userId: string, message: string) {
    // emits within the server
    this.server.to(userId).emit('profileChanged', { userId, message });
  }
}
