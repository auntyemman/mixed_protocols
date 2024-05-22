import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dtos/createUser.dto';
import { LoginDto } from './dto/login.dto';
import { AuthRepository } from './auth.repository';
import { UtilFunctions } from 'src/common/utils/functions.util';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private utilFunctions: UtilFunctions,
    private jwtService: JwtService,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<any> {
    const hashedPassword = await this.utilFunctions.hashPassword(
      createUserDto.password,
    );
    createUserDto.password = hashedPassword;
    const user = await this.authRepository.register(createUserDto);
    return user;
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    const user = await this.authRepository.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const comparePassword = await this.utilFunctions.comparePassword(
      password,
      user.password,
    );
    if (!comparePassword) {
      throw new BadRequestException('Password is incorrect');
    }
    const payload = { userId: user._id, email: user.email };
    const token = this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    });
    return token;
  }

  async validateUser(validatePayload: any): Promise<any> {
    const { userId, password } = validatePayload;
    const user = await this.authRepository.getUserById(userId);
    if (user && user.password === password) {
      // const { password, ...result } = user;
      // return result;
    }
    return null;
  }
}
