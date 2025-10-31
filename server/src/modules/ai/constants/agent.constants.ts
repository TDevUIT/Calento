export const AGENT_CONSTANTS = {
  CONFIDENCE: {
    MIN_THRESHOLD: 20,
    SIMILARITY_THRESHOLD: 10,
    MAX_SCORE: 100,
    KEYWORD_MATCH_WEIGHT: 80,
  },
  TEAM_KEYWORDS_BONUS: 20,
};

export const AGENT_KEYWORDS = {
  CALENDAR: ['calendar', 'schedule', 'event', 'meeting', 'appointment', 'book'],
  TASK: ['task', 'work', 'todo', 'plan', 'planning', 'learn', 'study'],
  ANALYSIS: [
    'analyze',
    'analysis',
    'team',
    'group',
    'member',
    'people',
    'availability',
    'free',
    'optimal',
  ],
};
