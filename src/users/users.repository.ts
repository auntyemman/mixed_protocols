import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const isExist = await this.getUserByEmail(createUserDto.email);
    if (isExist) {
      throw new BadRequestException('User already exists');
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
    return this.userModel.findOne({ email });
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userModel.find();
  }
  async getFilteredUsers(query: FilterQuery<User>): Promise<any> {
    let { search, sort, sortOrder, limit, page } = query;
    page = page || 1;
    limit = limit || 1;
    let filter: any = {};
    if (search) {
      filter = {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      };
    }
    const sortOptions: any = {};
    if (sort && sortOrder) {
      const sortOrderValue = sortOrder.toLowerCase() === 'desc' ? -1 : 1;
      sortOptions[sort] = sortOrderValue;
    }
    const options: any = {};
    if (limit && page) {
      const skip = (parseInt(page) - 1) * limit;
      options['limit'] = parseInt(limit) || 1;
      options['skip'] = skip;
    }
    const users = await this.userModel
      .find(filter)
      .select('-password')
      .lean()
      .sort(sortOptions)
      .skip(options.skip)
      .limit(options.limit);

    const totalUsers = await this.userModel.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / options.limit);
    return { users, totalUsers, totalPages };
  }

  async findOneAndUpdate(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return await this.userModel
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
      })
      .select('-password');
  }
}
