import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserRepository } from './users.repository';
import { GetUsersDto } from './dtos/getUsers.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dtos/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    try {
      const newUser = await this.userRepository.createUser(createUserDto);
      return newUser;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    try {
      const updateUser = await this.userRepository.findOneAndUpdate(
        id,
        updateUserDto,
      );
      return updateUser;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.getAllUsers();
  }

  async getUserById(id: string): Promise<User> {
    return await this.userRepository.getUserById(id);
  }

  async getUsers(query: GetUsersDto): Promise<any> {
    if (Object.keys(query).length === 0) {
      return await this.userRepository.getAllUsers();
    }
    const result = await this.userRepository.getFilteredUsers(query);
    if (!result) {
      throw new InternalServerErrorException('Failed to get users');
    }
    return result;
  }
}
