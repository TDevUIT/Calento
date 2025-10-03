import { Controller, Post, Body, HttpCode, HttpStatus, Res, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth, ApiExtraModels } from '@nestjs/swagger';
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

@ApiTags('Authentication')
@ApiExtraModels(AuthResponseDto, SuccessResponseDto)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieAuthService: CookieAuthService,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: '🔐 Register new user',
    description: 'Create a new user account with secure authentication'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered', 
    type: SuccessResponseDto<AuthResponseDto>
  })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SuccessResponseDto<AuthResponse>> {
    const result = await this.authService.register(registerDto);
    
    this.cookieAuthService.setAuthCookies(response, result.tokens);
    
    return new SuccessResponseDto('User registered successfully', result, HttpStatus.CREATED);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Login user',
    description: 'Authenticate user and return JWT tokens'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully logged in', 
    type: SuccessResponseDto<AuthResponseDto>
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SuccessResponseDto<AuthResponse>> {
    const result = await this.authService.login(loginDto);
    this.cookieAuthService.setAuthCookies(response, result.tokens);
    return new SuccessResponseDto('User logged in successfully', result);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Logout user',
    description: 'Clear authentication cookies and invalidate session'
  })
  @ApiCookieAuth()
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  async logout(
    @Res({ passthrough: true }) response: Response,
  ): Promise<SuccessResponseDto<null>> {
    this.cookieAuthService.clearAuthCookies(response);
    return new SuccessResponseDto('User logged out successfully', null);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ 
    summary: 'Refresh access token',
    description: 'Refresh access token using refresh token from cookies'
  })
  @ApiCookieAuth()
  @ApiResponse({ 
    status: 200, 
    description: 'Token refreshed successfully',
    type: SuccessResponseDto<AuthResponseDto>
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SuccessResponseDto<{ tokens: any }>> {
    const tokens = await this.cookieAuthService.refreshTokenFromCookies(request, response);
    
    if (!tokens) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return new SuccessResponseDto('Token refreshed successfully', { tokens });
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Get current user profile',
    description: 'Get current authenticated user information'
  })
  @ApiCookieAuth()
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  async getCurrentUser(
    @Req() request: Request,
  ): Promise<SuccessResponseDto<any>> {
    const user = (request as any).user;
    return new SuccessResponseDto('User profile retrieved successfully', user);
  }
}