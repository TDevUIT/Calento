export const TEAM_QUERY_KEYS = {
  all: ['teams'] as const,
  
  lists: () => [...TEAM_QUERY_KEYS.all, 'list'] as const,
  
  myTeams: () => [...TEAM_QUERY_KEYS.lists(), 'my'] as const,
  
  ownedTeams: () => [...TEAM_QUERY_KEYS.lists(), 'owned'] as const,
  
  details: () => [...TEAM_QUERY_KEYS.all, 'detail'] as const,
  
  detail: (teamId: string) => 
    [...TEAM_QUERY_KEYS.details(), teamId] as const,
  
  members: (teamId: string, status?: string) =>
    [...TEAM_QUERY_KEYS.all, 'members', teamId, status] as const,
  
  rituals: (teamId: string, activeOnly?: boolean) =>
    [...TEAM_QUERY_KEYS.all, 'rituals', teamId, activeOnly] as const,
  
  rotationHistory: (teamId: string, ritualId: string) =>
    [...TEAM_QUERY_KEYS.all, 'rotation', teamId, ritualId] as const,
  
  availability: (teamId: string) =>
    [...TEAM_QUERY_KEYS.all, 'availability', teamId] as const,
  
  heatmap: (teamId: string, startDate: string, endDate: string) =>
    [...TEAM_QUERY_KEYS.availability(teamId), 'heatmap', { startDate, endDate }] as const,
  
  optimalTimes: (teamId: string, params: any) =>
    [...TEAM_QUERY_KEYS.availability(teamId), 'optimal', params] as const,
} as const;
