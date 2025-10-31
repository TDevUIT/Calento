export const TEAM_CONSTANTS = {
  ROLES: {
    OWNER: 'owner',
    ADMIN: 'admin',
    MEMBER: 'member',
  },
  STATUS: {
    PENDING: 'pending',
    ACTIVE: 'active',
    DECLINED: 'declined',
    REMOVED: 'removed',
  },
  ROTATION_TYPES: {
    NONE: 'none',
    ROUND_ROBIN: 'round_robin',
    RANDOM: 'random',
    LOAD_BALANCED: 'load_balanced',
  },
  BUFFER: {
    DEFAULT_BEFORE: 5,
    DEFAULT_AFTER: 5,
    MAX_BUFFER: 60,
  },
  LIMITS: {
    MAX_MEMBERS: 50,
    MAX_RITUALS: 20,
    MAX_NAME_LENGTH: 255,
    MAX_DESCRIPTION_LENGTH: 1000,
  },
  HEATMAP: {
    SLOT_DURATION_MINUTES: 30,
    WORK_HOURS_START: 9,
    WORK_HOURS_END: 18,
    DAYS_AHEAD: 7,
  },
};

export const TEAM_ERRORS = {
  NOT_FOUND: 'Team not found',
  MEMBER_NOT_FOUND: 'Team member not found',
  RITUAL_NOT_FOUND: 'Team ritual not found',
  ALREADY_MEMBER: 'User is already a team member',
  MAX_MEMBERS_REACHED: 'Maximum number of team members reached',
  MAX_RITUALS_REACHED: 'Maximum number of team rituals reached',
  NOT_OWNER: 'Only team owner can perform this action',
  NOT_ADMIN: 'Only team admins can perform this action',
  CANNOT_REMOVE_OWNER: 'Cannot remove team owner',
  INVALID_ROTATION_TYPE: 'Invalid rotation type',
  INVALID_TIMEZONE: 'Invalid timezone',
};
