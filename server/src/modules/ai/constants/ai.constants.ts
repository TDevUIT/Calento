export const AI_CONSTANTS = {
  TIMEZONE: {
    DEFAULT: 'Asia/Ho_Chi_Minh',
  },
  WORK_HOURS: {
    START: 9,
    END: 18,
  },
  TIME_SLOTS: {
    INTERVAL_MINUTES: 30,
  },
  TASK: {
    DEFAULT_DURATION: 45,
    DEFAULT_PRIORITY: 'medium' as const,
  },
  EVENT: {
    DEFAULT_DURATION: 60,
  },
  ANALYSIS: {
    UPCOMING_EVENTS_LIMIT: 5,
    UPCOMING_EVENTS_DAYS: 7,
    MAX_EVENTS_FETCH: 1000,
    MIN_AVAILABILITY_THRESHOLD: 0.5,
    MAX_FREE_SLOTS: 10,
    PRODUCTIVITY_HOURS: {
      MORNING: { START: 9, END: 11 },
      AFTERNOON: { START: 14, END: 16 },
    },
  },
  AGENT: {
    MIN_CONFIDENCE_THRESHOLD: 20,
    CONFIDENCE_SIMILARITY_THRESHOLD: 10,
  },
  GEMINI: {
    MODEL: 'models/gemini-2.5-flash',
    TEMPERATURE: 0.7,
    TOP_P: 0.95,
    TOP_K: 40,
    MAX_OUTPUT_TOKENS: 2048,
  },
};

export const WEEKEND_DAYS = [0, 6];

export const ERROR_MESSAGES = {
  NO_PRIMARY_CALENDAR: 'You do not have a calendar yet. Please connect Google Calendar first.',
  EMPTY_AI_RESPONSE: 'Empty AI response',
  API_KEY_NOT_CONFIGURED: 'Gemini API key not configured',
  INVALID_FUNCTION: 'Function is not available',
};
