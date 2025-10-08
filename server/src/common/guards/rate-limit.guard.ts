import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { RateLimitException } from '../filters/rate-limit.filter';

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const RATE_LIMIT_KEY = 'rate_limit';

export const RateLimit = (options: RateLimitOptions) =>
  SetMetadata(RATE_LIMIT_KEY, options);

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rateLimitOptions = this.reflector.getAllAndOverride<RateLimitOptions>(
      RATE_LIMIT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!rateLimitOptions) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const key = this.generateKey(request);
    const now = Date.now();

    const record = requestCounts.get(key);

    if (!record || now > record.resetTime) {
      requestCounts.set(key, {
        count: 1,
        resetTime: now + rateLimitOptions.windowMs,
      });
      return true;
    }

    if (record.count >= rateLimitOptions.max) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      throw new RateLimitException(
        rateLimitOptions.max,
        rateLimitOptions.windowMs,
        retryAfter,
      );
    }

    record.count++;
    requestCounts.set(key, record);

    return true;
  }

  private generateKey(request: Request): string {
    const ip = request.ip || request.connection.remoteAddress;
    const userId = (request as any).user?.id || 'anonymous';
    return `${ip}:${userId}`;
  }
}
