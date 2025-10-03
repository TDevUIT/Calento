import { plainToClass, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync, IsBoolean, IsOptional } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  PORT: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  API_PORT: number;

  @IsString()
  API_HOST: string;

  @IsString()
  API_URL: string;

  @IsString()
  API_PREFIX: string;

  // Database
  @IsString()
  DB_HOST: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  DB_PORT: number;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

  // Redis
  @IsString()
  REDIS_HOST: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  REDIS_PORT: number;

  @IsString()
  @IsOptional()
  REDIS_PASSWORD?: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  REDIS_DB: number;

  // JWT
  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_ALGORITHM: string;

  @IsString()
  JWT_EXPIRES_IN: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsString()
  JWT_REFRESH_ALGORITHM: string;

  @IsString()
  JWT_REFRESH_EXPIRES_IN: string;

  // Session
  @IsString()
  SESSION_SECRET: string;

  // CORS
  @IsString()
  CORS_ORIGIN: string;

  @IsString()
  CORS_METHODS: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  CORS_CREDENTIALS: boolean;

  @IsString()
  CORS_EXPOSED_HEADERS: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  CORS_MAX_AGE: number;

  // File Upload
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  MAX_FILE_SIZE: number;

  @IsString()
  UPLOAD_PATH: string;

  // Logging
  @IsEnum(['error', 'warn', 'info', 'debug'])
  LOG_LEVEL: string;
}

export function validateEnvironment(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors.map(error => 
      Object.values(error.constraints || {}).join(', ')
    ).join('; ');
    
    throw new Error(`Environment validation failed: ${errorMessages}`);
  }

  return validatedConfig;
}
