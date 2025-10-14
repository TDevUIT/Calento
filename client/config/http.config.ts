const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || '';

export const HTTP_CONFIG = {
  TIMEOUT: 10000,
  MAX_RETRIES: {
    RATE_LIMIT: 3,
    NETWORK: 2,
  },
  RETRY_DELAY: (attemptIndex: number) => Math.pow(2, attemptIndex) * 1000,
  BASE_URL: API_PREFIX ? `${API_URL}/${API_PREFIX}` : API_URL,
} as const;

export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  TOO_MANY_REQUESTS: 429,
} as const;

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
} as const;
