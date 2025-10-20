export const QUERY_KEYS = {
  auth: {
    all: ['auth'] as const,
    session: () => [...QUERY_KEYS.auth.all, 'session'] as const,
    me: () => [...QUERY_KEYS.auth.all, 'me'] as const,
    refresh: () => [...QUERY_KEYS.auth.all, 'refresh'] as const,
  },
  
  google: {
    all: ['google'] as const,
    status: () => [...QUERY_KEYS.google.all, 'status'] as const,
    authUrl: () => [...QUERY_KEYS.google.all, 'auth-url'] as const,
    calendars: {
      all: () => [...QUERY_KEYS.google.all, 'calendars'] as const,
      list: () => [...QUERY_KEYS.google.calendars.all(), 'list'] as const,
      detail: (id: string) => [...QUERY_KEYS.google.calendars.all(), 'detail', id] as const,
    },
    sync: {
      all: () => [...QUERY_KEYS.google.all, 'sync'] as const,
      status: () => [...QUERY_KEYS.google.sync.all(), 'status'] as const,
    },
  },
  
  events: {
    all: ['events'] as const,
    list: (filters?: Record<string, unknown>) => createQueryKey([...QUERY_KEYS.events.all, 'list'], filters),
    detail: (id: string) => [...QUERY_KEYS.events.all, 'detail', id] as const,
    search: (query: string, filters?: Record<string, unknown>) => createQueryKey([...QUERY_KEYS.events.all, 'search', query], filters),
    recurring: {
      all: () => [...QUERY_KEYS.events.all, 'recurring'] as const,
      expand: (filters?: Record<string, unknown>) => createQueryKey([...QUERY_KEYS.events.recurring.all(), 'expand'], filters),
    },
  },
  
  users: {
    all: ['users'] as const,
    list: (filters?: Record<string, unknown>) => createQueryKey([...QUERY_KEYS.users.all, 'list'], filters),
    detail: (id: string) => [...QUERY_KEYS.users.all, 'detail', id] as const,
    search: (query: string, filters?: Record<string, unknown>) => createQueryKey([...QUERY_KEYS.users.all, 'search', query], filters),
    profile: () => [...QUERY_KEYS.users.all, 'profile'] as const,
  },
  
  calendars: {
    all: ['calendars'] as const,
    list: (filters?: Record<string, unknown>) => createQueryKey([...QUERY_KEYS.calendars.all, 'list'], filters),
    detail: (id: string) => [...QUERY_KEYS.calendars.all, 'detail', id] as const,
    availability: {
      all: () => [...QUERY_KEYS.calendars.all, 'availability'] as const,
      check: (filters?: Record<string, unknown>) => createQueryKey([...QUERY_KEYS.calendars.availability.all(), 'check'], filters),
    },
  },
} as const;

export const MUTATION_KEYS = {
  auth: {
    login: 'auth.login',
    register: 'auth.register',
    logout: 'auth.logout',
    refreshToken: 'auth.refreshToken',
  },

  google: {
    connect: 'google.connect',
    disconnect: 'google.disconnect',
    syncCalendars: 'google.syncCalendars',
    refreshToken: 'google.refreshToken',
  },

  events: {
    create: 'events.create',
    update: 'events.update',
    delete: 'events.delete',
    bulkCreate: 'events.bulkCreate',
    bulkUpdate: 'events.bulkUpdate',
    bulkDelete: 'events.bulkDelete',
  },

  users: {
    create: 'users.create',
    update: 'users.update',
    delete: 'users.delete',
    updateProfile: 'users.updateProfile',
    changePassword: 'users.changePassword',
  },

  calendars: {
    create: 'calendars.create',
    update: 'calendars.update',
    delete: 'calendars.delete',
    sync: 'calendars.sync',
  },

  settings: {
    updatePreferences: 'settings.updatePreferences',
    updateIntegrations: 'settings.updateIntegrations',
    updateNotifications: 'settings.updateNotifications',
  },
} as const;

export const QUERY_OPTIONS = {
  defaultStaleTime: 5 * 60 * 1000,
  
  defaultCacheTime: 30 * 60 * 1000,
  
  defaultRetry: 3,
  defaultRetryDelay: (attemptIndex: number) => Math.pow(2, attemptIndex) * 1000,
  
  auth: {
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
    retry: 1,
  },
  
  google: {
    staleTime: 5 * 60 * 1000,
    cacheTime: 15 * 60 * 1000, 
    retry: 2,
  },
  
  events: {
    staleTime: 2 * 60 * 1000, 
    cacheTime: 10 * 60 * 1000, 
    retry: 3,
  },
} as const;


export const createQueryKey = (baseKey: readonly string[], filters?: Record<string, unknown>): readonly (string | Record<string, unknown>)[] => {
  if (!filters || Object.keys(filters).length === 0) {
    return baseKey;
  }
  
  const sortedFilters = Object.keys(filters)
    .sort()
    .reduce((acc, key) => {
      acc[key] = filters[key];
      return acc;
    }, {} as Record<string, unknown>);
    
  return [...baseKey, sortedFilters] as const;
};


export const getInvalidationKeys = (type: 'auth' | 'google' | 'events' | 'users' | 'calendars') => {
  switch (type) {
    case 'auth':
      return [QUERY_KEYS.auth.all];
    case 'google':
      return [QUERY_KEYS.google.all];
    case 'events':
      return [QUERY_KEYS.events.all];
    case 'users':
      return [QUERY_KEYS.users.all];
    case 'calendars':
      return [QUERY_KEYS.calendars.all];
    default:
      return [];
  }
};

export default QUERY_KEYS;
