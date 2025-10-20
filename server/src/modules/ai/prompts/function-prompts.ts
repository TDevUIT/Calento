export const FUNCTION_DESCRIPTIONS = {
  CREATE_EVENT: {
    name: 'createEvent',
    description: 'Create a new event in the user\'s calendar',
    category: 'calendar' as const,
    parameters: {
      type: 'object' as const,
      properties: {
        title: {
          type: 'string',
          description: 'Event title',
        },
        start_time: {
          type: 'string',
          description: 'Start time (ISO 8601 format: YYYY-MM-DDTHH:mm:ss)',
        },
        end_time: {
          type: 'string',
          description: 'End time (ISO 8601 format)',
        },
        description: {
          type: 'string',
          description: 'Detailed event description (optional)',
        },
        location: {
          type: 'string',
          description: 'Location (optional)',
        },
        attendees: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of attendee emails (optional)',
        },
      },
      required: ['title', 'start_time', 'end_time'],
    },
  },

  CHECK_AVAILABILITY: {
    name: 'checkAvailability',
    description: 'Check user\'s calendar availability within a time range',
    category: 'calendar' as const,
    parameters: {
      type: 'object' as const,
      properties: {
        start_date: {
          type: 'string',
          description: 'Start date to check (ISO 8601)',
        },
        end_date: {
          type: 'string',
          description: 'End date to check (ISO 8601)',
        },
        duration_minutes: {
          type: 'number',
          description: 'Meeting duration to find (minutes, optional)',
        },
      },
      required: ['start_date', 'end_date'],
    },
  },

  SEARCH_EVENTS: {
    name: 'searchEvents',
    description: 'Search for events by criteria',
    category: 'calendar' as const,
    parameters: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'Search keyword',
        },
        start_date: {
          type: 'string',
          description: 'Search start date (optional)',
        },
        end_date: {
          type: 'string',
          description: 'Search end date (optional)',
        },
      },
      required: ['query'],
    },
  },

  UPDATE_EVENT: {
    name: 'updateEvent',
    description: 'Update event information',
    category: 'calendar' as const,
    parameters: {
      type: 'object' as const,
      properties: {
        event_id: {
          type: 'string',
          description: 'ID of the event to update',
        },
        updates: {
          type: 'object',
          description: 'Fields to update (title, start_time, end_time, description, location)',
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
      type: 'object' as const,
      properties: {
        event_id: {
          type: 'string',
          description: 'ID of the event to delete',
        },
      },
      required: ['event_id'],
    },
  },

  CREATE_TASK: {
    name: 'createTask',
    description: 'Create a new task/work item',
    category: 'task' as const,
    parameters: {
      type: 'object' as const,
      properties: {
        title: {
          type: 'string',
          description: 'Task title',
        },
        description: {
          type: 'string',
          description: 'Detailed description (optional)',
        },
        due_date: {
          type: 'string',
          description: 'Due date (ISO 8601, optional)',
        },
        priority: {
          type: 'string',
          enum: ['low', 'medium', 'high', 'critical'],
          description: 'Priority level (optional)',
        },
      },
      required: ['title'],
    },
  },

  CREATE_LEARNING_PLAN: {
    name: 'createLearningPlan',
    description: 'Create a long-term learning plan with multiple tasks',
    category: 'task' as const,
    parameters: {
      type: 'object' as const,
      properties: {
        topic: {
          type: 'string',
          description: 'Learning topic',
        },
        duration_weeks: {
          type: 'number',
          description: 'Learning duration (weeks)',
        },
        hours_per_day: {
          type: 'number',
          description: 'Study hours per day (optional)',
        },
        start_date: {
          type: 'string',
          description: 'Start date (optional, defaults to today)',
        },
      },
      required: ['topic', 'duration_weeks'],
    },
  },

  ANALYZE_TEAM_AVAILABILITY: {
    name: 'analyzeTeamAvailability',
    description: 'Analyze availability of multiple team members and suggest optimal meeting times with AI-powered conflict detection and match scoring',
    category: 'analysis' as const,
    parameters: {
      type: 'object' as const,
      properties: {
        member_ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of user IDs to check availability for',
        },
        start_date: {
          type: 'string',
          description: 'Start date for availability check (ISO 8601)',
        },
        end_date: {
          type: 'string',
          description: 'End date for availability check (ISO 8601)',
        },
        meeting_duration: {
          type: 'number',
          description: 'Meeting duration in minutes (default: 60)',
        },
        preferred_time_range: {
          type: 'object',
          properties: {
            start_hour: {
              type: 'number',
              description: 'Preferred start hour (0-23, default: 9)',
            },
            end_hour: {
              type: 'number',
              description: 'Preferred end hour (0-23, default: 18)',
            },
          },
          description: 'Preferred time range for meetings (optional)',
        },
      },
      required: ['member_ids', 'start_date', 'end_date'],
    },
  },
};

export function getFunctionsByCategory(category: 'calendar' | 'task' | 'analysis' | 'all') {
  if (category === 'all') {
    return Object.values(FUNCTION_DESCRIPTIONS);
  }

  return Object.values(FUNCTION_DESCRIPTIONS).filter((func) => func.category === category);
}

export function getFunctionByName(name: string) {
  return Object.values(FUNCTION_DESCRIPTIONS).find((func) => func.name === name);
}

export function getAllFunctionNames() {
  return Object.values(FUNCTION_DESCRIPTIONS).map((func) => func.name);
}
