import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dtos/createUser.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { EventEmitter2 } from '@nestjs/event-emitter';

@ApiTags('auth service')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post('register')
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ): Promise<any> {
    const user = await this.authService.registerUser(createUserDto);
    if (!user) {
      throw new InternalServerErrorException('Failed to create user');
    }

    this.eventEmitter.emit('user created', user);
    return res.status(201).json({ message: 'User created', data: user });
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<any> {
    const token = await this.authService.login(loginDto);
    return res.status(200).json({ message: 'Login successful', data: token });
  }
}
