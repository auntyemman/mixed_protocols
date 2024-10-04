import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!requiredPermissions) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const userPermissions = await user.role
      .populate('permissions')
      .execPopulate();

    return requiredPermissions.every((permission) =>
      userPermissions.permissions.some(
        (userPermission) => userPermission.name === permission,
      ),
    );
  }
}
