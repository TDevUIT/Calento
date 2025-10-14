import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Response, Request, CookieOptions } from 'express';
import env from '../../../config/env';
import { AuthTokens, JwtPayload } from '../interfaces/auth.interface';

@Injectable()
export class CookieAuthService {
  private readonly logger = new Logger(CookieAuthService.name);

  constructor(private readonly jwtService: JwtService) {}

  setAuthCookies(response: Response, tokens: AuthTokens): void {
    const isProd = env.NODE_ENV === 'production';
    const frontendDomain = env.FRONTEND_DOMAIN || 'localhost';
    
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      ...(isProd && frontendDomain !== 'localhost' && { domain: `.${frontendDomain}` }),
    };

    response.cookie('access_token', tokens.access_token, {
      ...cookieOptions,
      maxAge: tokens.expires_in * 1000,
    });

    response.cookie('refresh_token', tokens.refresh_token, {
      ...cookieOptions,
      maxAge: this.parseExpirationTime(env.JWT_REFRESH_EXPIRES_IN) * 1000,
    });

    this.logger.debug('Authentication cookies set successfully', {
      domain: cookieOptions.domain || 'no-domain',
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      isProd,
      frontendDomain
    });
  }

  clearAuthCookies(response: Response): void {
    const isProd = env.NODE_ENV === 'production';
    const frontendDomain = env.FRONTEND_DOMAIN || 'localhost';
    
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      ...(isProd && frontendDomain !== 'localhost' && { domain: `.${frontendDomain}` }),
    };

    response.clearCookie('access_token', cookieOptions);
    response.clearCookie('refresh_token', cookieOptions);

    this.logger.debug('Authentication cookies cleared', {
      domain: cookieOptions.domain || 'no-domain',
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite
    });
  }

  extractTokenFromCookies(request: Request): string | null {
    const accessToken = request.cookies?.access_token;

    if (!accessToken) {
      this.logger.debug('No access token found in cookies');
      return null;
    }

    return accessToken;
  }

  extractRefreshTokenFromCookies(request: Request): string | null {
    const refreshToken = request.cookies?.refresh_token;

    if (!refreshToken) {
      this.logger.debug('No refresh token found in cookies');
      return null;
    }

    return refreshToken;
  }

  async verifyTokenFromCookies(request: Request): Promise<JwtPayload | null> {
    const token = this.extractTokenFromCookies(request);

    if (!token) {
      return null;
    }

    try {
      const decoded = this.jwtService.verify(token);
      this.logger.debug(`Token verified for user: ${decoded.email}`);
      return decoded;
    } catch (error) {
      this.logger.warn(`Token verification failed: ${error.message}`);
      return null;
    }
  }

  async refreshTokenFromCookies(
    request: Request,
    response: Response,
  ): Promise<AuthTokens | null> {
    this.logger.debug('Attempting to refresh token from cookies...');
    
    const refreshToken = this.extractRefreshTokenFromCookies(request);

    if (!refreshToken) {
      this.logger.warn('No refresh token found in cookies');
      return null;
    }

    this.logger.debug(`Refresh token found, length: ${refreshToken.length}`);

    try {
      this.logger.debug('Verifying refresh token...');
      const decoded = this.jwtService.verify(refreshToken, {
        secret: env.JWT_REFRESH_SECRET,
      });

      this.logger.debug(`Token decoded - type: ${decoded.type}, email: ${decoded.email}`);

      if (decoded.type !== 'refresh') {
        this.logger.warn(`Invalid token type: ${decoded.type}, expected 'refresh'`);
        return null;
      }

      this.logger.debug('Generating new tokens...');
      const newTokens = await this.generateTokens({
        id: decoded.sub,
        email: decoded.email,
        username: decoded.username,
      });

      this.logger.debug('Setting new auth cookies...');
      this.setAuthCookies(response, newTokens);

      this.logger.log(`✅ Tokens refreshed successfully for user: ${decoded.email}`);
      return newTokens;
    } catch (error) {
      this.logger.error(`❌ Token refresh failed: ${error.name} - ${error.message}`);
      this.clearAuthCookies(response);
      return null;
    }
  }

  private async generateTokens(user: any): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      type: 'access',
    };

    const refreshPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      type: 'refresh',
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    const refresh_token = this.jwtService.sign(refreshPayload, {
      secret: env.JWT_REFRESH_SECRET,
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    });

    return {
      access_token,
      refresh_token,
      token_type: 'Bearer',
      expires_in: this.parseExpirationTime(env.JWT_EXPIRES_IN),
    };
  }

  private parseExpirationTime(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 3600;

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 3600;
      case 'd':
        return value * 86400;
      default:
        return 3600;
    }
  }
}
