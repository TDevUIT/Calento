export const PROMPT_CONFIG = {
  DEFAULT_TIMEZONE: 'Asia/Ho_Chi_Minh',
  DEFAULT_MEETING_DURATION: 60,
  WORKING_HOURS: {
    START: 9,
    END: 18,
  },
  DATE_FORMAT: 'DD/MM/YYYY',
  DEFAULT_TASK_DURATION: 45,
};

export const EMOJIS = {
  SUCCESS: '✅',
  CALENDAR: '📅',
  TIME: '⏰',
  TARGET: '🎯',
  BRAIN: '🧠',
  CHART: '📊',
  WARNING: '⚠️',
  ERROR: '❌',
  IDEA: '💡',
  QUESTION: '❓',
  NOTE: '📝',
};

export const AVAILABLE_FUNCTIONS = [
  'createEvent',
  'checkAvailability',
  'createTask',
  'searchEvents',
  'updateEvent',
  'deleteEvent',
  'createLearningPlan',
  'analyzeTeamAvailability',
] as const;

export const PRODUCTIVITY_HOURS = {
  MORNING: { START: 9, END: 11 },
  AFTERNOON: { START: 14, END: 16 },
};

export const MATCH_SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 70,
  POOR: 70,
};
