import { z } from "zod";
import { config } from "dotenv";

// Load .env file
config();

const envSchema = z.object({
    // Database Configuration
    DB_HOST: z.string().default('localhost'),
    DB_PORT: z.string().transform(Number).default(5432),
    DB_USER: z.string().default('postgres'),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string().default('postgres'),
    
    // Database Pool Configuration
    DB_POOL_MIN: z.string().transform(Number).default(2),
    DB_POOL_MAX: z.string().transform(Number).default(10),
    DB_POOL_IDLE_TIMEOUT: z.string().transform(Number).default(30000),
    DB_POOL_CONNECTION_TIMEOUT: z.string().transform(Number).default(2000),
    DB_POOL_MAX_USES: z.string().transform(Number).default(7500),

    // Redis Configuration
    REDIS_HOST: z.string().default('localhost'),
    REDIS_PORT: z.string().transform(Number).default(6379),
    REDIS_PASSWORD: z.string().optional(),
    REDIS_DB: z.string().transform(Number).default(0),

    // Application Configuration
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform(Number).default(3000),
    API_PORT: z.string().transform(Number).default(8000),
    API_HOST: z.string().default('localhost'),
    API_URL: z.string().url().default('http://localhost:8000'),
    API_PREFIX: z.string().default('v1/api'),
    
    // JWT Configuration
    JWT_SECRET: z.string().min(32),
    JWT_ALGORITHM: z.string().default('HS256'),
    JWT_EXPIRES_IN: z.string().default('1h'),

    JWT_REFRESH_SECRET: z.string().min(32),
    JWT_REFRESH_ALGORITHM: z.string().default('HS256'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
    
    // Session Configuration
    SESSION_SECRET: z.string().min(32),

    // CORS Configuration
    CORS_ORIGIN: z.string().url().default('http://localhost:3000'),
    CORS_METHODS: z.string().default('GET,HEAD,PUT,PATCH,POST,DELETE'),
    CORS_CREDENTIALS: z.coerce.boolean().default(true),
    CORS_EXPOSED_HEADERS: z.string().default('Content-Length,Content-Type'),
    CORS_MAX_AGE: z.string().transform(Number).default(86400),
    // File Upload Configuration
    MAX_FILE_SIZE: z.string().transform(Number).default(10485760),
    UPLOAD_PATH: z.string().default('./uploads'),

    // Logging Configuration
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
    console.error('❌ Invalid environment variables:', env.error.format());
    throw new Error('Invalid environment variables');
}

export default env.data;
export type Env = z.infer<typeof envSchema>;
