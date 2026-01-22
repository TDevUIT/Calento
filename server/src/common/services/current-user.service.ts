import { Injectable, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  is_admin?: boolean;
  is_active: boolean;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class CurrentUserService {
  getCurrentUser(request: Request): AuthenticatedUser | null {
    const user = (request as any).user;

    if (!user) {
      return null;
    }

    return user as AuthenticatedUser;
  }

  getCurrentUserId(request: Request): string | null {
    const user = this.getCurrentUser(request);
    return user?.id || null;
  }

  getCurrentUserEmail(request: Request): string | null {
    const user = this.getCurrentUser(request);
    return user?.email || null;
  }

  isAuthenticated(request: Request): boolean {
    return this.getCurrentUser(request) !== null;
  }

  isUserVerified(request: Request): boolean {
    const user = this.getCurrentUser(request);
    return user?.is_verified || false;
  }

  getCurrentUserFromContext(
    context: ExecutionContext,
  ): AuthenticatedUser | null {
    const request = context.switchToHttp().getRequest<Request>();
    return this.getCurrentUser(request);
  }

  getCurrentUserIdFromContext(context: ExecutionContext): string | null {
    const user = this.getCurrentUserFromContext(context);
    return user?.id || null;
  }
}
