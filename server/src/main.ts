import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import env from './config/env';
import cookieParser from 'cookie-parser';
import { ConsoleLogger, LogLevel, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './common/swagger/swagger.config';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const getLogLevels = (level: string): LogLevel[] => {
    const levels: Record<string, LogLevel[]> = {
      error: ['error'],
      warn: ['error', 'warn'],
      info: ['error', 'warn', 'log'],
      debug: ['error', 'warn', 'log', 'debug', 'verbose'],
    };
    return levels[level] || levels['info'];
  };

  const LoggerConfig = new ConsoleLogger({
    timestamp: true,
    prefix: 'API',
    logLevels: getLogLevels(env.LOG_LEVEL),
  });

  const app = await NestFactory.create(AppModule, {
    logger: LoggerConfig,
  });

  app.use(
    helmet({
      contentSecurityPolicy: env.NODE_ENV === 'production' ? undefined : false,
    }),
  );

  app.use(compression());

  app.use(cookieParser(env.SESSION_SECRET));

  app.setGlobalPrefix(env.API_PREFIX);

  LoggerConfig.log(`🌐 CORS Origins: ${env.CORS_ORIGIN.join(', ')}`);
  LoggerConfig.log(`🍪 CORS Credentials: ${env.CORS_CREDENTIALS}`);

  app.enableCors({
    origin: (origin, callback) => {
      // Always log CORS checks (not just debug level)
      LoggerConfig.log(`🔍 CORS Check - Origin: "${origin || 'none'}"`);
      
      if (!origin) {
        LoggerConfig.log('✅ CORS: Allowing request with no origin');
        return callback(null, true);
      }

      if (env.CORS_ORIGIN.includes('*')) {
        if (env.CORS_CREDENTIALS) {
          LoggerConfig.error(
            '❌ CORS: Wildcard (*) with credentials=true is not allowed by browsers. Use specific origins.',
          );
          return callback(new Error('Invalid CORS configuration'));
        }
        LoggerConfig.log('✅ CORS: Allowing wildcard origin');
        return callback(null, true);
      }

      const isAllowed = env.CORS_ORIGIN.some(allowedOrigin => {
        LoggerConfig.log(`🔍 Checking origin "${origin}" against allowed "${allowedOrigin}"`);
        
        // Exact match
        if (allowedOrigin === origin) {
          LoggerConfig.log(`✅ Exact match found: ${allowedOrigin}`);
          return true;
        }
        
        // For development: allow localhost with any port if localhost is configured
        if (origin.startsWith('http://localhost:') && 
            env.CORS_ORIGIN.some(o => o.startsWith('http://localhost:'))) {
          LoggerConfig.log(`✅ Localhost match found for: ${origin}`);
          return true;
        }
        
        return false;
      });

      if (isAllowed) {
        LoggerConfig.log(`✅ CORS: Allowing origin: "${origin}"`);
        return callback(null, origin);
      }

      // Always log blocked origins with full details
      LoggerConfig.error(`❌ CORS BLOCKED - Origin: "${origin}"`);
      LoggerConfig.error(`📋 Configured origins: [${env.CORS_ORIGIN.join(', ')}]`);
      LoggerConfig.error(`🔍 Origin type: ${typeof origin}, Length: ${origin?.length}`);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: env.CORS_CREDENTIALS,
    methods: env.CORS_METHODS.split(','),
    exposedHeaders: env.CORS_EXPOSED_HEADERS.split(','),
    maxAge: env.CORS_MAX_AGE,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      validateCustomDecorators: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  if (env.ENABLE_SWAGGER) {
    setupSwagger(app);
    LoggerConfig.log(
      `📚 API Documentation: http://${env.API_HOST}:${env.API_PORT}/docs`,
    );
  }

  await app.listen(env.API_PORT);
  LoggerConfig.log(
    `🚀 Server running on http://${env.API_HOST}:${env.API_PORT}/${env.API_PREFIX}`,
  );
  LoggerConfig.log(`🌍 Environment: ${env.NODE_ENV}`);
  LoggerConfig.log(`📊 Database: ${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
