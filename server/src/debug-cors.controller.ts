import { Controller, Get } from '@nestjs/common';
import env from './config/env';
import { Public } from './common/decorators/public.decorator';

@Controller('debug')
export class DebugController {
  @Public()
  @Get('cors')
  getCorsConfig() {
    return {
      corsOrigins: env.CORS_ORIGIN,
      corsCredentials: env.CORS_CREDENTIALS,
      corsMethods: env.CORS_METHODS,
      corsExposedHeaders: env.CORS_EXPOSED_HEADERS,
      corsMaxAge: env.CORS_MAX_AGE,
      nodeEnv: env.NODE_ENV,
      apiUrl: env.API_URL,
    };
  }
}
