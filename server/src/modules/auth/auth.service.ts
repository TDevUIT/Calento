import { Injectable, Logger, OnModuleInit, Inject, forwardRef } from '@nestjs/common';
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
import { TIME_CONSTANTS, SECURITY_CONSTANTS } from '../../common/constants';

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

  async forgetPassword(email: string) {
    try {
      const user = await this.userValidationService.findUserByEmail(email);
      if (!user) {
        this.logger.warn(
          `Forget password attempt with non-existent email: ${email}`,
        );
        throw new InvalidCredentialsException();
      }

      const resetToken = randomBytes(32).toString('hex');
      const identifier = resetToken.slice(
        0,
        SECURITY_CONSTANTS.TOKEN_LENGTHS.RESET_TOKEN_IDENTIFIER,
      );
      const secret = resetToken.slice(
        SECURITY_CONSTANTS.TOKEN_LENGTHS.RESET_TOKEN_IDENTIFIER,
      );

      const hashedSecret = await this.passwordService.hashPassword(secret);

      await this.authRepository.updateResetToken(
        user.id,
        identifier,
        hashedSecret,
        new Date(Date.now() + TIME_CONSTANTS.AUTH.PASSWORD_RESET_EXPIRY),
      );

      await this.emailService.sendPasswordResetEmail(
        user.id,
        user.email,
        user.username,
        identifier,
        secret,
      );
      this.logger.log(`Password reset email sent to: ${user.email}`);

      this.logger.log(`User forget password successfully: ${user.email}`);

      return {
        email: user.email,
      };
    } catch (error) {
      if (error instanceof InvalidCredentialsException) {
        throw error;
      }

      this.logger.error('Forget password failed:', error);
      throw new AuthenticationFailedException(
        this.messageService.get('auth.forget_password_failed'),
      );
    }
  }

  async resetPassword(identifier: string, secret: string, password: string) {
    try {
      const user =
        await this.userValidationService.findUserByResetToken(identifier);
      if (!user) {
        this.logger.warn(
          `Reset password attempt with non-existent reset token: ${identifier}`,
        );
        throw new InvalidCredentialsException();
      }

      const hashedPassword = await this.passwordService.hashPassword(password);
      const isPasswordValid = await this.passwordService.comparePassword(
        secret,
        user.reset_token_secret,
      );
      if (!isPasswordValid) {
        this.logger.warn(
          `Invalid password attempt for reset token: ${identifier}`,
        );
        throw new InvalidCredentialsException();
      }
      await this.authRepository.updatePassword(user.id, hashedPassword);
      this.logger.log(`User reset password successfully: ${user.email}`);
      return {
        email: user.email,
      };
    } catch (error) {
      if (error instanceof InvalidCredentialsException) {
        throw error;
      }

      this.logger.error('Reset password failed:', error);
      throw new AuthenticationFailedException(
        this.messageService.get('auth.reset_password_failed'),
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

      // Log JWT configuration for debugging
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
}
