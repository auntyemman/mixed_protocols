import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  senderId: string;

  @IsNotEmpty()
  @IsString({ each: true })
  @IsArray()
  receivers: string[];
}
