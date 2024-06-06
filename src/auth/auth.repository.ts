import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/users/dtos/createUser.dto';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const findUser = await this.getUserByEmail(createUserDto.email);
    if (findUser) {
      throw new BadRequestException('User already exist');
    }
    const newUser = await this.userModel.create(createUserDto);
    if (!newUser) {
      throw new InternalServerErrorException('Failed to create user');
    }
    return newUser;
  }
  async getUserById(id: string): Promise<User> {
    return await this.userModel.findById(id);
  }
  async getUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email });
  }
}
