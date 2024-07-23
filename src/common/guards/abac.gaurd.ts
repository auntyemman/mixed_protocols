import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const attributes = this.reflector.get<string[]>(
      'attributes',
      context.getHandler(),
    );
    
    if (!attributes) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return attributes.every((attribute) => {
      const [key, value] = Object.entries(attribute)[0];
      return user[key] === value
    });

  }
}
