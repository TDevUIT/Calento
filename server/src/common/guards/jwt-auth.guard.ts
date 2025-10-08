import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import {
  InvalidTokenException,
  TokenExpiredException,
} from '../../modules/auth/exceptions/auth.exceptions';

@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt', 'jwt-cookie']) {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const isOptional = this.reflector.getAllAndOverride<boolean>(
      'isOptionalAuth',
      [context.getHandler(), context.getClass()],
    );

    if (isOptional) {
      const request = context.switchToHttp().getRequest<Request>();
      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return true;
      }
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const isOptional = this.reflector.getAllAndOverride<boolean>(
      'isOptionalAuth',
      [context.getHandler(), context.getClass()],
    );

    if (err || !user) {
      const ip = request.ip || request.connection.remoteAddress;
      const userAgent = request.headers['user-agent'];
      const endpoint = `${request.method} ${request.url}`;

      this.logger.warn(
        `Authentication failed for ${endpoint} from ${ip}: ${err?.message || info?.message || 'Unknown error'}`,
      );
    }

    if (err) {
      if (err.name === 'TokenExpiredError') {
        throw new TokenExpiredException();
      }
      if (err.name === 'JsonWebTokenError') {
        throw new InvalidTokenException();
      }
      throw err;
    }

    if (!user && isOptional) {
      return null;
    }

    if (!user) {
      throw new InvalidTokenException();
    }

    if (user) {
      this.logger.debug(`User ${user.email} authenticated successfully`);
    }

    return user;
  }
}
