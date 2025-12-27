import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

/**
 * Logging Interceptor
 *
 * Provides structured request/response logging with:
 * - Request details (method, url, user, ip)
 * - Response status and duration
 * - Error logging
 * - Performance tracking
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, originalUrl, ip, headers } = request;
    const userAgent = headers['user-agent'] || 'Unknown';
    const userId = (request as any).user?.id || 'Anonymous';

    const startTime = Date.now();

    // Log incoming request
    this.logger.log(`→ ${method} ${originalUrl} | User: ${userId} | IP: ${ip}`);

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const { statusCode } = response;

          // Log successful response
          if (statusCode >= 400) {
            this.logger.warn(
              `← ${statusCode} ${method} ${originalUrl} | ${duration}ms | User: ${userId}`,
            );
          } else {
            this.logger.log(
              `← ${statusCode} ${method} ${originalUrl} | ${duration}ms | User: ${userId}`,
            );
          }
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;

          // Log error response
          this.logger.error(
            `← ${statusCode} ${method} ${originalUrl} | ${duration}ms | User: ${userId}`,
            error.stack,
          );
        },
      }),
    );
  }
}
