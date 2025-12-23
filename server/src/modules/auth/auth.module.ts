import { Global, Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { CookieAuthService } from './services/cookie-auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtCookieStrategy } from './strategies/jwt-cookie.strategy';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { CommonModule } from '../../common/common.module';
import { EmailModule } from '../email/email.module';
import { CalendarModule } from '../calendar/calendar.module';
import { GoogleModule } from '../google/google.module';
import { QueueModule } from '../../common/queue/queue.module';

@Global()
@Module({
  imports: [
    CommonModule,
    ConfigModule,
    forwardRef(() => EmailModule),
    CalendarModule, // Import CalendarModule for auto-creating default calendar
    GoogleModule, // Import GoogleModule for Google OAuth
    QueueModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.jwtSecret,
        signOptions: {
          expiresIn: configService.jwtExpiresIn,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    CookieAuthService,
    JwtStrategy,
    JwtCookieStrategy,
  ],
  exports: [AuthService, CookieAuthService],
})
export class AuthModule { }
