import { Chat } from 'src/chat/entities/chat.entity';
import { newChatDto } from 'src/chat/dto/create-chat.dto';
export interface ServerToClientEvents {
  newMessage: (data: Chat) => void;
  receiveMessage: (data: newChatDto) => void;
  newChat: (data: Chat) => void;
  joinChat: (data: Chat) => void;
  leaveChat: (data: Chat) => void;
  deleteChat: (data: Chat) => void;
  typing: (data: Chat) => void;
}
