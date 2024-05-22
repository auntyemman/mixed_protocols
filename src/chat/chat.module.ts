import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatRepository } from './chat.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from './entities/chat.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    // AuthModule,
    MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }]),
    UsersModule,
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, ChatRepository, JwtService],
})
export class ChatModule {}
