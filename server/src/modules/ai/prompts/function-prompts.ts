const OBJECT_TYPE = 'object' as const;
const STRING_TYPE = 'string';
const NUMBER_TYPE = 'number';
const ARRAY_TYPE = 'array';

export const FUNCTION_DESCRIPTIONS = {
  CREATE_EVENT: {
    name: 'createEvent',
    description: 'Create a new event in the user\'s calendar',
    category: 'calendar' as const,
    parameters: {
      type: OBJECT_TYPE,
      properties: {
        title: { type: STRING_TYPE, description: 'Event title' },
        start_time: { type: STRING_TYPE, description: 'Start time (ISO 8601 format with timezone offset, e.g., YYYY-MM-DDTHH:mm:ss+07:00)' },
        end_time: { type: STRING_TYPE, description: 'End time (ISO 8601 format with timezone offset, e.g., YYYY-MM-DDTHH:mm:ss+07:00)' },
        description: { type: STRING_TYPE, description: 'Detailed event description (optional)' },
        location: { type: STRING_TYPE, description: 'Location (optional)' },
        timezone: { type: STRING_TYPE, description: 'Timezone (e.g., "Asia/Ho_Chi_Minh")' },
        attendees: { type: ARRAY_TYPE, items: { type: STRING_TYPE }, description: 'List of attendee emails (optional)' },
      },
      required: ['title', 'start_time', 'end_time'],
    },
  },

  CHECK_AVAILABILITY: {
    name: 'checkAvailability',
    description: 'Check user\'s calendar availability within a time range',
    category: 'calendar' as const,
    parameters: {
      type: OBJECT_TYPE,
      properties: {
        start_date: { type: STRING_TYPE, description: 'Start date to check (ISO 8601)' },
        end_date: { type: STRING_TYPE, description: 'End date to check (ISO 8601)' },
        duration_minutes: { type: NUMBER_TYPE, description: 'Meeting duration to find (minutes, optional)' },
      },
      required: ['start_date', 'end_date'],
    },
  },

  SEARCH_EVENTS: {
    name: 'searchEvents',
    description: 'Search for events by criteria',
    category: 'calendar' as const,
    parameters: {
      type: OBJECT_TYPE,
      properties: {
        query: { type: STRING_TYPE, description: 'Search keyword' },
        start_date: { type: STRING_TYPE, description: 'Search start date (optional)' },
        end_date: { type: STRING_TYPE, description: 'Search end date (optional)' },
      },
      required: [],
    },
  },

  UPDATE_EVENT: {
    name: 'updateEvent',
    description: 'Update event information',
    category: 'calendar' as const,
    parameters: {
      type: OBJECT_TYPE,
      properties: {
        event_id: { type: STRING_TYPE, description: 'ID of the event to update' },
        updates: {
          type: OBJECT_TYPE,
          description:
            'Fields to update (title, start_time, end_time, description, location, timezone, attendees)',
        },
      },
      required: ['event_id', 'updates'],
    },
  },

  DELETE_EVENT: {
    name: 'deleteEvent',
    description: 'Delete an event from the calendar',
    category: 'calendar' as const,
    parameters: {
      type: OBJECT_TYPE,
      properties: {
        event_id: { type: STRING_TYPE, description: 'ID of the event to delete' },
      },
      required: ['event_id'],
    },
  },

  CREATE_TASK: {
    name: 'createTask',
    description: 'Create a new task/work item',
    category: 'task' as const,
    parameters: {
      type: OBJECT_TYPE,
      properties: {
        title: { type: STRING_TYPE, description: 'Task title' },
        description: { type: STRING_TYPE, description: 'Detailed description (optional)' },
        due_date: { type: STRING_TYPE, description: 'Due date (ISO 8601, optional)' },
        priority: { type: STRING_TYPE, enum: ['low', 'medium', 'high', 'critical'], description: 'Priority level (optional)' },
      },
      required: ['title'],
    },
  },

  CREATE_LEARNING_PLAN: {
    name: 'createLearningPlan',
    description: 'Create a long-term learning plan with multiple tasks',
    category: 'task' as const,
    parameters: {
      type: OBJECT_TYPE,
      properties: {
        topic: { type: STRING_TYPE, description: 'Learning topic' },
        duration_weeks: { type: NUMBER_TYPE, description: 'Learning duration (weeks)' },
        hours_per_day: { type: NUMBER_TYPE, description: 'Study hours per day (optional)' },
        start_date: { type: STRING_TYPE, description: 'Start date (optional, defaults to today)' },
      },
      required: ['topic', 'duration_weeks'],
    },
  },

  ANALYZE_TEAM_AVAILABILITY: {
    name: 'analyzeTeamAvailability',
    description: 'Analyze availability of multiple team members and suggest optimal meeting times with AI-powered conflict detection and match scoring',
    category: 'analysis' as const,
    parameters: {
      type: OBJECT_TYPE,
      properties: {
        member_ids: { type: ARRAY_TYPE, items: { type: STRING_TYPE }, description: 'Array of user IDs to check availability for' },
        start_date: { type: STRING_TYPE, description: 'Start date for availability check (ISO 8601)' },
        end_date: { type: STRING_TYPE, description: 'End date for availability check (ISO 8601)' },
        meeting_duration: { type: NUMBER_TYPE, description: 'Meeting duration in minutes (default: 60)' },
        preferred_time_range: {
          type: OBJECT_TYPE,
          properties: {
            start_hour: { type: NUMBER_TYPE, description: 'Preferred start hour (0-23, default: 9)' },
            end_hour: { type: NUMBER_TYPE, description: 'Preferred end hour (0-23, default: 18)' },
          },
          description: 'Preferred time range for meetings (optional)',
        },
      },
      required: ['member_ids', 'start_date', 'end_date'],
    },
  },
};

export const getFunctionsByCategory = (category: 'calendar' | 'task' | 'analysis' | 'all') =>
  category === 'all'
    ? Object.values(FUNCTION_DESCRIPTIONS)
    : Object.values(FUNCTION_DESCRIPTIONS).filter((func) => func.category === category);

export const getFunctionByName = (name: string) =>
  Object.values(FUNCTION_DESCRIPTIONS).find((func) => func.name === name);

export const getAllFunctionNames = () =>
  Object.values(FUNCTION_DESCRIPTIONS).map((func) => func.name);
