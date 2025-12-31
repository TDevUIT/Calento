import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  UseGuards,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiExtraModels } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { CookieAuthService } from './services/cookie-auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  PasswordResetRequestDto,
  PasswordResetDto,
} from './dto/password-reset.dto';
import { AuthResponseDto, AuthUserResponseDto } from './dto/auth-response.dto';
import { AuthResponse } from './interfaces/auth.interface';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SuccessResponseDto } from '../../common/dto/base-response.dto';
import { MessageService } from '../../common/message/message.service';
import { GoogleAuthService } from '../google/services/google-auth.service';
import {
  ApiRegister,
  ApiLogin,
  ApiLogout,
  ApiRefreshToken,
  ApiGetCurrentUser,
  ApiVerifyAuth,
  ApiGetGoogleAuthUrl,
  ApiGoogleCallback,
  ApiGoogleLogin,
  ApiRequestPasswordReset,
  ApiResetPassword,
} from './auth.swagger';

@ApiTags('Authentication')
@ApiExtraModels(AuthResponseDto, AuthUserResponseDto, SuccessResponseDto)
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly cookieAuthService: CookieAuthService,
    private readonly messageService: MessageService,
    private readonly GoogleAuthService: GoogleAuthService,
    private readonly configService: ConfigService,
  ) { }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiRegister()
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SuccessResponseDto<AuthResponse>> {
    const result = await this.authService.register(registerDto);

    this.cookieAuthService.setAuthCookies(response, result.tokens);

    return new SuccessResponseDto(
      this.messageService.get('auth.register_success'),
      result,
      HttpStatus.CREATED,
    );
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiLogin()
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SuccessResponseDto<AuthResponse>> {
    const result = await this.authService.login(loginDto);
    this.cookieAuthService.setAuthCookies(response, result.tokens);
    return new SuccessResponseDto(
      this.messageService.get('auth.login_success'),
      result,
    );
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiLogout()
  async logout(
    @Res({ passthrough: true }) response: Response,
  ): Promise<SuccessResponseDto<null>> {
    this.cookieAuthService.clearAuthCookies(response);
    return new SuccessResponseDto(
      this.messageService.get('auth.logout_success'),
      null,
    );
  }

  @Public()
  @Post('refresh')
  @ApiRefreshToken()
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SuccessResponseDto<{ tokens: any }>> {
    const tokens = await this.cookieAuthService.refreshTokenFromCookies(
      request,
      response,
    );

    if (!tokens) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return new SuccessResponseDto(
      this.messageService.get('auth.token_refresh_success'),
      { tokens },
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiGetCurrentUser()
  async getCurrentUser(
    @Req() request: Request,
  ): Promise<SuccessResponseDto<any>> {
    const user = (request as any).user;
    return new SuccessResponseDto(
      this.messageService.get('auth.profile_retrieved'),
      user,
    );
  }

  @Public()
  @Get('verify')
  @HttpCode(HttpStatus.OK)
  @ApiVerifyAuth()
  async verifyAuth(
    @Req() request: Request,
  ): Promise<SuccessResponseDto<{ authenticated: boolean; user?: any }>> {
    try {
      const token = this.cookieAuthService.extractTokenFromCookies(request);

      if (!token) {
        return new SuccessResponseDto(
          this.messageService.get('auth.not_authenticated'),
          { authenticated: false },
        );
      }

      const user = await this.authService.validateAccessToken(token);

      if (!user) {
        return new SuccessResponseDto(
          this.messageService.get('auth.not_authenticated'),
          { authenticated: false },
        );
      }

      return new SuccessResponseDto(
        this.messageService.get('auth.authenticated'),
        {
          authenticated: true,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
          },
        },
      );
    } catch (error) {
      this.logger.warn(`Auth verification failed: ${error.message}`);
      return new SuccessResponseDto(
        this.messageService.get('auth.not_authenticated'),
        { authenticated: false },
      );
    }
  }

  @Public()
  @Get('google/url')
  @ApiGetGoogleAuthUrl()
  async getGoogleAuthUrl(): Promise<SuccessResponseDto> {
    const authUrl = this.GoogleAuthService.getAuthUrl();

    return new SuccessResponseDto(
      this.messageService.get('google.auth_url_generated'),
      { auth_url: authUrl },
    );
  }

  @Public()
  @Get('google/callback')
  @ApiGoogleCallback()
  async handleGoogleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Res() res: Response,
  ) {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const callbackPath = '/auth/callback/google';

    const params = new URLSearchParams();

    if (error) {
      params.append('error', error);
    } else if (!code) {
      params.append('error', 'no_code');
    } else {
      params.append('code', code);
      if (state) {
        params.append('state', state);
      }
    }

    const redirectUrl = `${frontendUrl}${callbackPath}?${params.toString()}`;

    this.logger.log(`Redirecting to frontend: ${redirectUrl}`);

    return res.redirect(redirectUrl);
  }

  @Public()
  @Post('google/login')
  @HttpCode(HttpStatus.OK)
  @ApiGoogleLogin()
  async googleLogin(
    @Body() body: { code: string; state?: string },
    @Res({ passthrough: true }) response: Response,
  ): Promise<SuccessResponseDto<AuthResponse>> {
    const result = await this.authService.loginWithGoogle(body.code);

    this.cookieAuthService.setAuthCookies(response, result.tokens);

    return new SuccessResponseDto(
      this.messageService.get('auth.google_login_success'),
      result,
    );
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiRequestPasswordReset()
  async requestPasswordReset(
    @Body() dto: PasswordResetRequestDto,
  ): Promise<SuccessResponseDto<null>> {
    await this.authService.requestPasswordReset(dto.email);

    return new SuccessResponseDto(
      'If an account exists with this email, a password reset link has been sent',
      null,
    );
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiResetPassword()
  async resetPassword(
    @Body() dto: PasswordResetDto,
  ): Promise<SuccessResponseDto<null>> {
    await this.authService.resetPassword(dto.token, dto.new_password);

    return new SuccessResponseDto(
      this.messageService.get('auth.password_reset_success'),
      null,
    );
  }
}
