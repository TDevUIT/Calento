interface LogConfig {
  enabled: boolean;
  level: 'debug' | 'info' | 'warn' | 'error';
}

const LOG_CONFIG: LogConfig = {
  enabled: process.env.NODE_ENV === 'development',
  level: 'debug',
};

export const logger = {
  request: (method?: string, url?: string) => {
    if (!LOG_CONFIG.enabled) return;
    console.log(`🚀 ${method?.toUpperCase()} ${url}`);
  },

  response: (status: number, method?: string, url?: string) => {
    if (!LOG_CONFIG.enabled) return;
    console.log(`✅ ${status} ${method?.toUpperCase()} ${url}`);
  },

  error: (status: number | string, method?: string, url?: string) => {
    if (!LOG_CONFIG.enabled) return;
    console.error(`❌ ${status} ${method?.toUpperCase()} ${url}`);
  },

  retry: (delay: number, attempt: number, maxRetries: number, type: string) => {
    if (!LOG_CONFIG.enabled) return;
    console.log(`🔄 ${type}, retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`);
  },

  warn: (message: string, ...args: unknown[]) => {
    if (!LOG_CONFIG.enabled) return;
    console.warn(message, ...args);
  },

  info: (message: string, ...args: unknown[]) => {
    if (!LOG_CONFIG.enabled) return;
    console.log(`ℹ️  ${message}`, ...args);
  },
};
