import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/createUser.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUserResolver(
    @Args('createUserDto') createUserDto: CreateUserDto,
  ): Promise<User> {
    return await this.usersService.createUser(createUserDto);
  }

  @Query(() => [User])
  async graphQLGetUsersResolver(): Promise<User[]> {
    return await this.usersService.getAllUsers();
  }
}
