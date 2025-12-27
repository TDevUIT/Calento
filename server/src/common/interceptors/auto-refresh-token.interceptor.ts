import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { CookieAuthService } from '../../modules/auth/services/cookie-auth.service';
import { TokenExpiredException } from '../../modules/auth/exceptions/auth.exceptions';

@Injectable()
export class AutoRefreshTokenInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AutoRefreshTokenInterceptor.name);

  constructor(private readonly cookieAuthService: CookieAuthService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      catchError((error) => {
        this.logger.debug(
          `Interceptor caught error: ${error.constructor.name} - ${error.message}`,
        );

        if (!(error instanceof TokenExpiredException)) {
          this.logger.debug('Not a TokenExpiredException, passing through');
          return throwError(() => error);
        }

        this.logger.log('Access token expired, attempting automatic refresh');

        return this.attemptTokenRefresh(request, response, context, next);
      }),
    );
  }

  private attemptTokenRefresh(
    request: Request,
    response: Response,
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    return new Observable((observer) => {
      this.cookieAuthService
        .refreshTokenFromCookies(request, response)
        .then((tokens) => {
          if (!tokens) {
            this.logger.warn(
              'Refresh token invalid or expired, clearing auth cookies',
            );
            this.cookieAuthService.clearAuthCookies(response);

            observer.error(
              new UnauthorizedException({
                status: 401,
                message: 'Session expired. Please login again.',
                errors: ['Refresh token invalid or expired'],
                timestamp: new Date().toISOString(),
                requiresLogin: true,
              }),
            );
            return;
          }

          this.logger.log(
            'Access token refreshed successfully via interceptor',
          );

          request.cookies.access_token = tokens.access_token;

          next
            .handle()
            .pipe(
              catchError((retryError) => {
                this.logger.error(
                  'Request failed after token refresh',
                  retryError,
                );
                return throwError(() => retryError);
              }),
            )
            .subscribe({
              next: (value) => observer.next(value),
              error: (err) => observer.error(err),
              complete: () => observer.complete(),
            });
        })
        .catch((error) => {
          this.logger.error('Token refresh failed', error);
          this.cookieAuthService.clearAuthCookies(response);

          observer.error(
            new UnauthorizedException({
              status: 401,
              message: 'Session expired. Please login again.',
              errors: ['Token refresh failed'],
              timestamp: new Date().toISOString(),
              requiresLogin: true,
            }),
          );
        });
    });
  }
}
