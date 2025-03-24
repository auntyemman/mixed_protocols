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
    } else if (requestType === 'rpc') {
      return this.validateRpcRequest(context);
    } else if (requestType === 'ws') {
      return this.validateWsToken(context);
      // const client: Socket = context.switchToWs().getClient();
      // const decoded = JwtAuthGuard.validateWsToken(client);
      // client.data.user = decoded;
      // return true;
    } else {
      throw new UnauthorizedException('Unsupported request type');
    }
  }

  private async validateToken(token: string): Promise<any> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return payload;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractToken(authorization: string | undefined): string {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new BadRequestException('Invalid or missing authorization header');
    }
    const token = authorization.split(' ')[1];
    if (!token) {
      throw new BadRequestException('Invalid or missing token');
    }
    return token;
  }

  async validateHttpRequest(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractToken(request.headers.authorization);
    request.user = await this.validateToken(token);
    return true;
  }

  async validateRpcRequest(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToRpc().getData();
    const token = this.extractToken(request.authorization);
    request.user = await this.validateToken(token);
    return true;
  }

  async validateWsToken(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const { authorization } = client.handshake.headers;
    const token = this.extractToken(authorization);
    const decoded = await this.validateToken(token);
    client.data.user = decoded;
    return true;
  }

  // static method to be used for ws middleware token validation
  static async validateWsToken(client: Socket) {
    const { authorization } = client.handshake.headers;
    if (!authorization) {
      throw new BadRequestException('Invalid or missing authorization header');
    }
    const token = authorization.split(' ')[1];
    if (!token) {
      throw new BadRequestException('Invalid or missing token');
    }
    const decoded = verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      throw new UnauthorizedException('Invalid token');
    }
    client.data.user = decoded;
    return decoded;
  }
}
