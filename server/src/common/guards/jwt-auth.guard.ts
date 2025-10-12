import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import {
  InvalidTokenException,
} from '../../modules/auth/exceptions/auth.exceptions';
import { CookieAuthService } from '../../modules/auth/services/cookie-auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt', 'jwt-cookie']) {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private reflector: Reflector,
    private cookieAuthService: CookieAuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
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
      const accessTokenCookie = request.cookies?.access_token;

      if (!authHeader && !accessTokenCookie) {
        return true;
      }
    }

    try {
      const result = await super.canActivate(context);
      return result as boolean;
    } catch (error) {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();
      
      const shouldRefresh = 
        error.name === 'TokenExpiredError' || 
        error.message?.includes('expired') ||
        error.message?.includes('jwt malformed') ||
        error.message?.includes('invalid token') ||
        (error instanceof InvalidTokenException);
      
      if (shouldRefresh) {
        const refreshToken = request.cookies?.refresh_token;
        
        if (!refreshToken) {
          this.logger.warn('❌ No refresh token available');
          throw new UnauthorizedException({
            status: 401,
            message: 'Session expired. Please login again.',
            errors: ['No valid session found'],
            timestamp: new Date().toISOString(),
            requiresLogin: true,
          });
        }
        
        this.logger.log('🔄 Access token invalid/missing, attempting automatic refresh');
        
        const tokens = await this.cookieAuthService.refreshTokenFromCookies(request, response);
        
        if (tokens) {
          this.logger.log('✅ Token refreshed successfully, retrying authentication');
          request.cookies.access_token = tokens.access_token;
          
          try {
            const retryResult = await super.canActivate(context);
            return retryResult as boolean;
          } catch (retryError) {
            this.logger.error('❌ Authentication failed after token refresh', retryError);
            throw retryError;
          }
        } else {
          this.logger.warn('❌ Refresh token invalid or expired');
          throw new UnauthorizedException({
            status: 401,
            message: 'Session expired. Please login again.',
            errors: ['Refresh token invalid or expired'],
            timestamp: new Date().toISOString(),
            requiresLogin: true,
          });
        }
      }
      
      throw error;
    }
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const isOptional = this.reflector.getAllAndOverride<boolean>(
      'isOptionalAuth',
      [context.getHandler(), context.getClass()],
    );

    // Debug logging
    if (err || !user) {
      const ip = request.ip || request.connection.remoteAddress;
      const endpoint = `${request.method} ${request.url}`;
      const hasAccessToken = !!request.cookies?.access_token;
      const hasRefreshToken = !!request.cookies?.refresh_token;
      const hasAuthHeader = !!request.headers.authorization;
      
      this.logger.debug(
        `Auth Debug - err: ${err?.name || 'none'} (${err?.message || 'N/A'}), ` +
        `info: ${info?.name || 'none'} (${info?.message || 'N/A'}), ` +
        `user: ${!!user}, accessToken: ${hasAccessToken}, refreshToken: ${hasRefreshToken}, authHeader: ${hasAuthHeader}`
      );
      
      this.logger.warn(
        `Authentication failed for ${endpoint} from ${ip}: ${err?.message || info?.message || 'Unknown error'}`,
      );
    }

    // Handle specific JWT errors from err parameter
    if (err) {
      if (err.name === 'TokenExpiredError') {
        this.logger.debug('Token expired (from err)');
        throw err; // Let canActivate handle this
      }
      if (err.name === 'JsonWebTokenError') {
        this.logger.warn('Invalid JWT token format (from err)');
        throw new InvalidTokenException();
      }
      throw err;
    }

    // Handle missing user errors - check info parameter for JWT errors
    if (!user && !isOptional) {
      // Passport JWT strategy puts TokenExpiredError in info, not err
      if (info?.name === 'TokenExpiredError') {
        this.logger.debug('Token expired (from info)');
        throw new Error('jwt expired'); // Let canActivate handle this
      }
      
      if (info?.name === 'JsonWebTokenError') {
        this.logger.warn('Invalid JWT token format (from info)');
        throw new InvalidTokenException();
      }
      
      if (info?.message) {
        this.logger.warn(`Authentication info: ${info.message}`);
        
        // Check if message indicates token expiration
        if (info.message.toLowerCase().includes('expired')) {
          this.logger.debug('Token expired detected from message');
          throw new Error('jwt expired'); // Let canActivate handle this
        }
      }
      
      // No token provided or invalid
      throw new InvalidTokenException();
    }

    if (!user && isOptional) {
      return null;
    }

    if (user) {
      this.logger.debug(`User ${user.email} authenticated successfully`);
    }

    return user;
  }
}
