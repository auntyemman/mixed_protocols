import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class newChatDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  authorId: string;

  @IsNotEmpty()
  @IsString()
  conversationId: string;
}
