import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class JoinChatDto {
  // @IsNotEmpty()
  // @IsString()
  // clientId: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  senderName: string;

  @IsNotEmpty()
  @IsString()
  sender: string;

  @IsNotEmpty()
  @IsString()
  @IsArray()
  receivers: string[];
}
