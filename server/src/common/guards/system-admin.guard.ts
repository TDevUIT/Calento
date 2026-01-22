import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class SystemAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = (request as any).user as { is_admin?: boolean } | undefined;

    if (!user) {
      throw new UnauthorizedException({
        status: 401,
        message: 'Session expired. Please login again.',
        errors: ['No valid session found'],
        timestamp: new Date().toISOString(),
        requiresLogin: true,
      });
    }

    if (!user.is_admin) {
      throw new ForbiddenException({
        status: 403,
        message: 'System admin access required',
        errors: ['Insufficient permissions'],
        timestamp: new Date().toISOString(),
      });
    }

    return true;
  }
}
