import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';
// import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requestType = context.getType();

    if (requestType === 'http') {
      return this.validateHttpRequest(context);
    } else if (requestType === 'ws') {
      const client: Socket = context.switchToWs().getClient();
      const decoded = JwtAuthGuard.validateWsToken(client);
      client.data.user = decoded;
      return true;
    } else {
      throw new UnauthorizedException('Unsupported request type');
    }

    // if (context.getType() !== 'ws') {
    //   return true;
    // }

    // const client: Socket = context.switchToWs().getClient();
    // const decoded = JwtAuthGuard.validateWsToken(client);
    // client.data.user = decoded;
    // return true;
  }

  async validateHttpRequest(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new BadRequestException('Invalid or missing authorization header');
    }

    const token = authorization.split(' ')[1];
    if (!token) {
      throw new BadRequestException('Invalid or missing token');
    }

    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      request.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  static async validateWsToken(client: Socket) {
    const { authorization } = client.handshake.headers;
    if (!authorization) {
      throw new BadRequestException('Invalid or missing authorization header');
    }
    const token = authorization.split(' ')[1];
    if (!token) {
      throw new BadRequestException('Invalid or missing token');
    }
    const payload = verify(token, process.env.JWT_SECRET);
    return payload;
  }
}
