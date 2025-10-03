import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import type { Request } from 'express';
import { ConfigService } from '../../../config/config.service';
import { UserValidationService } from '../../../common/services/user-validation.service';
import { JwtPayload } from '../interfaces/auth.interface';

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(Strategy, 'jwt-cookie') {
  private readonly logger = new Logger(JwtCookieStrategy.name);

  constructor(
    private readonly userValidationService: UserValidationService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          const token = request?.cookies?.access_token;
          if (token) {
            this.logger.debug('JWT extracted from cookies');
            return token;
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload): Promise<any> {
    try {
      if (payload.type !== 'access') {
        this.logger.warn(`Invalid token type: ${payload.type}`);
        return null;
      }

      const user = await this.userValidationService.findUserByEmail(payload.email);
      
      if (!user) {
        this.logger.warn(`User not found for token: ${payload.email}`);
        return null;
      }

      if (!user.is_active) {
        this.logger.warn(`Inactive user attempted access: ${payload.email}`);
        return null;
      }

      const { password_hash, ...safeUser } = user;
      
      this.logger.debug(`User validated successfully: ${user.email}`);
      return safeUser;
    } catch (error) {
      this.logger.error(`JWT validation error: ${error.message}`, error.stack);
      return null;
    }
  }
}
