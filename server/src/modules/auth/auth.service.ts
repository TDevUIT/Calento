import {
  Injectable,
  Logger,
  OnModuleInit,
  Inject,
  forwardRef,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { PasswordService } from '../../common/services/password.service';
import { UserValidationService } from '../../common/services/user-validation.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  AuthResponse,
  JwtPayload,
  AuthTokens,
  AuthUser,
} from './interfaces/auth.interface';
import {
  InvalidCredentialsException,
  AuthenticationFailedException,
  DuplicateEmailException,
  DuplicateUsernameException,
} from './exceptions/auth.exceptions';
import { MessageService } from '../../common/message/message.service';
import { ConfigService } from '../../config/config.service';
import { randomBytes } from 'crypto';
import { EmailService } from '../email/services/email.service';
import { EmailQueueService } from '../../common/queue/services/email-queue.service';
import { CalendarService } from '../calendar/calendar.service';
import { GoogleAuthService } from '../google/services/google-auth.service';
import { TIME_CONSTANTS, SECURITY_CONSTANTS } from '../../common/constants';
import { google } from 'googleapis';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
    private readonly messageService: MessageService,
    private readonly configService: ConfigService,
    private readonly passwordService: PasswordService,
    private readonly userValidationService: UserValidationService,
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
    private readonly emailQueueService: EmailQueueService,
    private readonly calendarService: CalendarService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly userService: UserService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    try {
      const { emailExists, usernameExists } =
        await this.userValidationService.validateUserUniqueness(
          registerDto.email,
          registerDto.username,
        );

      if (emailExists) {
        this.logger.warn(
          `Registration attempt with existing email: ${registerDto.email}`,
        );
        throw new DuplicateEmailException(registerDto.email);
      }

      if (usernameExists) {
        this.logger.warn(
          `Registration attempt with existing username: ${registerDto.username}`,
        );
        throw new DuplicateUsernameException(registerDto.username);
      }

      const hashedPassword = await this.passwordService.hashPassword(
        registerDto.password,
      );

      const user = await this.authRepository.createUser({
        ...registerDto,
        password_hash: hashedPassword,
      });

      this.logger.log(`User registered successfully: ${user.email}`);

      await this.userService.ensureUserSettingsInitialized(user.id, {
        timezone: registerDto.timezone || 'UTC',
      });

      await this.createDefaultCalendar(user);

      // Send welcome email (via queue)
      await this.emailQueueService.queueWelcomeEmail(
        user.id,
        user.email,
        user.first_name || user.username,
      );

      const tokens = await this.generateTokens(user);

      const userResponse = this.createUserResponse(user);

      return {
        tokens,
        user: userResponse,
        login_at: new Date(),
      };
    } catch (error) {
      if (
        error instanceof DuplicateEmailException ||
        error instanceof DuplicateUsernameException
      ) {
        throw error;
      }

      this.logger.error('Registration failed:', error);
      throw new AuthenticationFailedException(
        this.messageService.get('auth.registration_failed'),
      );
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    try {
      const user = await this.userValidationService.findUserByEmail(
        loginDto.email,
      );
      if (!user) {
        this.logger.warn(
          `Login attempt with non-existent email: ${loginDto.email}`,
        );
        throw new InvalidCredentialsException();
      }

      const isPasswordValid = await this.passwordService.comparePassword(
        loginDto.password,
        user.password_hash,
      );
      if (!isPasswordValid) {
        this.logger.warn(
          `Invalid password attempt for email: ${loginDto.email}`,
        );
        throw new InvalidCredentialsException();
      }

      await this.authRepository.updateLastLogin(user.id);

      this.logger.log(`User logged in successfully: ${user.email}`);

      const tokens = await this.generateTokens(user);

      const userResponse = this.createUserResponse(user);

      return {
        tokens,
        user: userResponse,
        login_at: new Date(),
      };
    } catch (error) {
      if (error instanceof InvalidCredentialsException) {
        throw error;
      }

      this.logger.error('Login failed:', error);
      throw new AuthenticationFailedException(
        this.messageService.get('auth.login_failed'),
      );
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const user = await this.authRepository.findByPasswordResetToken(token);

      if (!user) {
        this.logger.warn('Invalid or expired password reset token');
        throw new InvalidCredentialsException();
      }

      const hashedPassword =
        await this.passwordService.hashPassword(newPassword);
      await this.authRepository.updatePassword(user.id, hashedPassword);

      this.logger.log(`Password successfully reset for user: ${user.email}`);

      await this.emailService.sendEmail({
        to: user.email,
        subject: 'Password Successfully Reset',
        template: 'password-reset-confirmation',
        context: {
          user_name: user.first_name || user.username,
        },
      });
    } catch (error) {
      this.logger.error(`Password reset failed: ${error.message}`, error.stack);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to reset password: ${error.message}`,
      );
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userValidationService.findUserByEmail(email);
    if (
      user &&
      (await this.passwordService.comparePassword(password, user.password_hash))
    ) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }

  async validateAccessToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.jwtSecret,
      });

      if (payload.type !== 'access') {
        this.logger.warn('Invalid token type, expected access token');
        return null;
      }

      const user = await this.userValidationService.findUserById(payload.sub);

      if (!user) {
        this.logger.warn(`User not found for token: ${payload.sub}`);
        return null;
      }

      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      this.logger.warn(`Token validation failed: ${error.message}`);
      return null;
    }
  }

  private async generateTokens(user: any): Promise<AuthTokens> {
    try {
      this.logger.debug(`Generating tokens for user: ${user.email}`);

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

      this.logger.debug('Generating access token...');
      const access_token = this.jwtService.sign(payload, {
        expiresIn: this.configService.jwtExpiresIn,
      });

      this.logger.debug('Generating refresh token...');
      const refresh_token = this.jwtService.sign(refreshPayload, {
        secret: this.configService.jwtRefreshSecret,
        expiresIn: this.configService.jwtRefreshExpiresIn,
      });

      this.logger.debug(
        `Tokens generated successfully for user: ${user.email}`,
      );

      return {
        access_token,
        refresh_token,
        token_type: 'Bearer',
        expires_in: this.parseExpirationTime(this.configService.jwtExpiresIn),
      };
    } catch (error) {
      this.logger.error(
        `Token generation failed for user ${user.email}:`,
        error,
      );

      this.logger.error('JWT Configuration Debug:', {
        jwtSecretLength: this.configService.jwtSecret?.length || 0,
        jwtRefreshSecretLength:
          this.configService.jwtRefreshSecret?.length || 0,
        jwtExpiresIn: this.configService.jwtExpiresIn,
        jwtRefreshExpiresIn: this.configService.jwtRefreshExpiresIn,
      });

      throw new AuthenticationFailedException(
        'Failed to generate authentication tokens',
      );
    }
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

  private createUserResponse(user: any): AuthUser {
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private async createDefaultCalendar(user: any): Promise<void> {
    try {
      const timezone = await this.userService.getUserTimezone(user.id);
      const defaultCalendar = await this.calendarService.createCalendar(
        {
          google_calendar_id: `personal_${user.id}`,
          name: 'Personal Calendar',
          description:
            'Your default personal calendar for events and appointments',
          timezone,
          is_primary: true,
        },
        user.id,
      );

      this.logger.log(
        `Default calendar created for user ${user.id}: ${defaultCalendar.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to create default calendar for user ${user.id}:`,
        error.message,
      );
      this.logger.warn(
        `User ${user.id} registered without default calendar. They can create one manually.`,
      );
    }
  }

  async loginWithGoogle(code: string): Promise<AuthResponse> {
    try {
      const oauth2Client = this.googleAuthService.getOAuth2Client();
      const { tokens } = await oauth2Client.getToken(code);

      if (!tokens.access_token) {
        throw new AuthenticationFailedException(
          'No access token received from Google',
        );
      }

      oauth2Client.setCredentials(tokens);
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const { data: googleUser } = await oauth2.userinfo.get();

      if (!googleUser.email) {
        throw new AuthenticationFailedException(
          'No email received from Google',
        );
      }

      let user = await this.authRepository.findByEmail(googleUser.email);

      if (!user) {
        const hashedPassword = await this.passwordService.hashPassword(
          randomBytes(32).toString('hex'),
        );

        const userData = {
          email: googleUser.email,
          username: googleUser.email.split('@')[0], // Use email prefix as username
          first_name: googleUser.given_name || 'User',
          last_name: googleUser.family_name || '',
          avatar: googleUser.picture || undefined,
          password: 'google-oauth', // Dummy password (will be hashed)
          password_hash: hashedPassword,
        };

        user = await this.authRepository.createUser(userData);
        this.logger.log(`Created new user from Google: ${user.email}`);

        await this.userService.ensureUserSettingsInitialized(user.id);

        await this.createDefaultCalendar(user);

        await this.emailQueueService.queueWelcomeEmail(
          user.id,
          user.email,
          user.first_name || user.username,
        );
      }

      const expiresAt = tokens.expiry_date
        ? new Date(tokens.expiry_date)
        : new Date(Date.now() + TIME_CONSTANTS.GOOGLE.TOKEN_DEFAULT_EXPIRY);

      await this.googleAuthService['credentialsRepo'].upsert({
        user_id: user.id,
        provider: 'google',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || undefined,
        expires_at: expiresAt,
        scope: tokens.scope,
      });

      const authTokens = await this.generateTokens(user);
      const authUser = this.createUserResponse(user);

      this.logger.log(`Google login successful for user: ${user.email}`);

      return {
        user: authUser,
        tokens: authTokens,
        login_at: new Date(),
      };
    } catch (error) {
      this.logger.error('Google login failed:', error);

      if (error instanceof AuthenticationFailedException) {
        throw error;
      }

      throw new AuthenticationFailedException('Google login failed');
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    try {
      const user = await this.authRepository.findByEmail(email);

      if (!user) {
        this.logger.warn(
          `Password reset requested for non-existent email: ${email}`,
        );
        return;
      }

      const resetToken = randomBytes(32).toString('hex');
      const expiresAt = new Date(
        Date.now() + SECURITY_CONSTANTS.PASSWORD_RESET_TOKEN_EXPIRY,
      );

      await this.authRepository.savePasswordResetToken(
        user.id,
        resetToken,
        expiresAt,
      );

      const frontendUrl = this.configService.frontendUrl;
      const resetUrl = `${frontendUrl}/auth/reset-password?token=${resetToken}`;

      await this.emailService.sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        template: 'password-reset',
        context: {
          user_name: user.first_name || user.username,
          reset_url: resetUrl,
          expiry_hours:
            SECURITY_CONSTANTS.PASSWORD_RESET_TOKEN_EXPIRY / (1000 * 60 * 60),
        },
      });

      this.logger.log(`Password reset email sent to: ${email}`);
    } catch (error) {
      this.logger.error(
        `Password reset request failed: ${error.message}`,
        error.stack,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to process password reset request: ${error.message}`,
      );
    }
  }
}
