import { Injectable } from '@nestjs/common';
import env, { Env } from './env';

@Injectable()
export class ConfigService {
  private readonly config: Env = env;

  get dbHost(): string {
    return this.config.DB_HOST;
  }

  get dbPort(): number {
    return this.config.DB_PORT;
  }

  get dbUser(): string {
    return this.config.DB_USER;
  }

  get dbPassword(): string {
    return this.config.DB_PASSWORD;
  }

  get dbName(): string {
    return this.config.DB_NAME;
  }

  get dbPoolMin(): number {
    return this.config.DB_POOL_MIN;
  }

  get dbPoolMax(): number {
    return this.config.DB_POOL_MAX;
  }

  get dbPoolIdleTimeout(): number {
    return this.config.DB_POOL_IDLE_TIMEOUT;
  }

  get dbPoolConnectionTimeout(): number {
    return this.config.DB_POOL_CONNECTION_TIMEOUT;
  }

  get dbPoolMaxUses(): number {
    return this.config.DB_POOL_MAX_USES;
  }

  get redisHost(): string {
    return this.config.REDIS_HOST;
  }

  get redisPort(): number {
    return this.config.REDIS_PORT;
  }

  get redisPassword(): string | undefined {
    return this.config.REDIS_PASSWORD;
  }

  get redisDb(): number {
    return this.config.REDIS_DB;
  }

  get nodeEnv(): string {
    return this.config.NODE_ENV;
  }

  get port(): number {
    return this.config.PORT;
  }

  get apiPort(): number {
    return this.config.API_PORT;
  }

  get apiHost(): string {
    return this.config.API_HOST;
  }

  get apiUrl(): string {
    return this.config.API_URL;
  }

  get apiPrefix(): string {
    return this.config.API_PREFIX;
  }

  get jwtSecret(): string {
    return this.config.JWT_SECRET;
  }

  get jwtAlgorithm(): string {
    return this.config.JWT_ALGORITHM;
  }

  get jwtExpiresIn(): string {
    return this.config.JWT_EXPIRES_IN;
  }

  get jwtRefreshSecret(): string {
    return this.config.JWT_REFRESH_SECRET;
  }

  get jwtRefreshAlgorithm(): string {
    return this.config.JWT_REFRESH_ALGORITHM;
  }

  get jwtRefreshExpiresIn(): string {
    return this.config.JWT_REFRESH_EXPIRES_IN;
  }

  get sessionSecret(): string {
    return this.config.SESSION_SECRET;
  }
  get corsOrigin(): string {
    return this.config.CORS_ORIGIN;
  }

  get corsMethods(): string {
    return this.config.CORS_METHODS;
  }

  get corsCredentials(): boolean {
    return this.config.CORS_CREDENTIALS;
  }

  get corsExposedHeaders(): string {
    return this.config.CORS_EXPOSED_HEADERS;
  }

  get corsMaxAge(): number {
    return this.config.CORS_MAX_AGE;
  }

  get maxFileSize(): number {
    return this.config.MAX_FILE_SIZE;
  }

  get uploadPath(): string {
    return this.config.UPLOAD_PATH;
  }

  get logLevel(): string {
    return this.config.LOG_LEVEL;
  }
  get isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  get isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  get isTest(): boolean {
    return this.config.NODE_ENV === 'test';
  }

  getAllConfig(): Env {
    return { ...this.config };
  }
  getSafeConfig(): Partial<Env> {
    const {
      DB_PASSWORD,
      JWT_SECRET,
      JWT_REFRESH_SECRET,
      SESSION_SECRET,
      REDIS_PASSWORD,
      ...safeConfig
    } = this.config;

    return safeConfig;
  }
}
