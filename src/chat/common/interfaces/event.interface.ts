import { Chat } from 'src/chat/entities/chat.entity';
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';
export interface ServerToClientEvents {
  newMessage: (data: Chat) => void;
  receiveMessage: (data: CreateChatDto) => void;
  newChat: (data: Chat) => void;
  joinChat: (data: Chat) => void;
  leaveChat: (data: Chat) => void;
  deleteChat: (data: Chat) => void;
  typing: (data: Chat) => void;
}
