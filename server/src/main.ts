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

  app.use(
    compression({
      filter: (req, res) => {
        const acceptHeader = String(req.headers?.accept || '');
        if (acceptHeader.includes('text/event-stream')) {
          return false;
        }

        const url = String(req.originalUrl || req.url || '');
        if (url.includes('/ai/chat/stream')) {
          return false;
        }

        return compression.filter(req, res);
      },
    }),
  );

  app.use(cookieParser(env.SESSION_SECRET));

  app.setGlobalPrefix(env.API_PREFIX);

  LoggerConfig.log(`🌐 CORS Origins: ${env.CORS_ORIGIN.join(', ')}`);
  LoggerConfig.log(`🍪 CORS Credentials: ${env.CORS_CREDENTIALS}`);

  app.enableCors({
    origin: env.CORS_ORIGIN,
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
  const logger = new ConsoleLogger('Bootstrap');
  logger.error('❌ Failed to start server:', error.stack);
  process.exit(1);
});
