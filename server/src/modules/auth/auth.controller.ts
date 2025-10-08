import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiExtraModels,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CookieAuthService } from './services/cookie-auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthResponse } from './interfaces/auth.interface';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SuccessResponseDto } from '../../common/dto/base-response.dto';
import { MessageService } from '../../common/message/message.service';

@ApiTags('Authentication')
@ApiExtraModels(AuthResponseDto, SuccessResponseDto)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieAuthService: CookieAuthService,
    private readonly messageService: MessageService,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '🔐 Register new user',
    description: 'Create a new user account with secure authentication',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: SuccessResponseDto<AuthResponseDto>,
  })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
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
  @ApiOperation({
    summary: 'Login user',
    description: 'Authenticate user and return JWT tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: SuccessResponseDto<AuthResponseDto>,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
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

  @Post('forget-password')
  @ApiOperation({
    summary: 'Forget password',
    description: 'Send password reset email to user',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully forget password',
  })
  async forgetPassword(
    @Body() loginDto: { email: string },
  ): Promise<SuccessResponseDto<{ email: string }>> {
    const result = await this.authService.forgetPassword(loginDto.email);
    return new SuccessResponseDto(
      this.messageService.get('auth.forget_password_success'),
      result,
    );
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset password',
    description: 'Reset user password',
  })
  @ApiResponse({ status: 200, description: 'User successfully reset password' })
  async resetPassword(
    @Body() identifier: string,
    @Body() secret: string,
    @Body() password: string,
  ): Promise<SuccessResponseDto<{ email: string }>> {
    const result = await this.authService.resetPassword(
      identifier,
      secret,
      password,
    );
    return new SuccessResponseDto(
      this.messageService.get('auth.reset_password_success'),
      result,
    );
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Logout user',
    description: 'Clear authentication cookies and invalidate session',
  })
  @ApiCookieAuth()
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
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
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Refresh access token using refresh token from cookies',
  })
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: SuccessResponseDto<AuthResponseDto>,
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
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

  @Post('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Get current authenticated user information',
  })
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  async getCurrentUser(
    @Req() request: Request,
  ): Promise<SuccessResponseDto<any>> {
    const user = (request as any).user;
    return new SuccessResponseDto(
      this.messageService.get('auth.profile_retrieved'),
      user,
    );
  }
}
