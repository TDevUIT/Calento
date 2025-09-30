import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/auth.interface';
import { UserValidationService } from '../../../common/services/user-validation.service';
import { InvalidTokenException } from '../exceptions/auth.exceptions';
import env from '../../../config/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private userValidationService: UserValidationService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    try {
      // Validate that this is an access token
      if (payload.type !== 'access') {
        this.logger.warn(`Invalid token type: ${payload.type}`);
        throw new InvalidTokenException();
      }

      // Get user from database to ensure they still exist and are active
      const user = await this.userValidationService.findUserByEmail(payload.email);
      
      if (!user) {
        this.logger.warn(`JWT validation failed: User ${payload.email} not found`);
        throw new InvalidTokenException();
      }

      if (!user.is_active) {
        this.logger.warn(`Inactive user attempted access: ${payload.email}`);
        throw new InvalidTokenException();
      }

      // Remove sensitive information
      const { password_hash, ...userWithoutPassword } = user;
      this.logger.debug(`User validated successfully: ${user.email}`);
      return userWithoutPassword;
    } catch (error) {
      this.logger.error(`JWT validation error for user ${payload.email}:`, error);
      throw new InvalidTokenException();
    }
  }
}
