import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { TokenExpiredException } from '../../modules/auth/exceptions/auth.exceptions';
import { CookieAuthService } from '../../modules/auth/services/cookie-auth.service';

@Catch(TokenExpiredException)
export class TokenRefreshFilter implements ExceptionFilter {
  private readonly logger = new Logger(TokenRefreshFilter.name);

  constructor(private readonly cookieAuthService: CookieAuthService) {}

  async catch(exception: TokenExpiredException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    this.logger.log('Token expired, attempting automatic refresh via filter');

    try {
      const tokens = await this.cookieAuthService.refreshTokenFromCookies(
        request,
        response,
      );

      if (!tokens) {
        this.logger.warn('Refresh token invalid or expired');
        this.sendUnauthorizedResponse(response);
        return;
      }

      this.logger.log('Token refreshed successfully, retrying request');

      request.cookies.access_token = tokens.access_token;

      response.status(HttpStatus.OK).json({
        success: true,
        message: 'Token refreshed successfully. Request will be retried.',
        data: null,
        tokenRefreshed: true,
      });
    } catch (error) {
      this.logger.error('Token refresh failed in filter', error);
      this.sendUnauthorizedResponse(response);
    }
  }

  private sendUnauthorizedResponse(response: Response) {
    response.status(HttpStatus.UNAUTHORIZED).json({
      status: HttpStatus.UNAUTHORIZED,
      message: 'Session expired. Please login again.',
      errors: ['Refresh token invalid or expired'],
      timestamp: new Date().toISOString(),
      requiresLogin: true,
    });
  }
}
