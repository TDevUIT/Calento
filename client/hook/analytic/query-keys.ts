import { 
  AnalyticsQueryParams, 
  TimeDistributionQueryParams,
  CategoryAnalyticsQueryParams 
} from '@/interface/analytics.interface';

export const ANALYTICS_QUERY_KEYS = {
  all: ['analytics'] as const,
  
  overview: (params: AnalyticsQueryParams) => 
    [...ANALYTICS_QUERY_KEYS.all, 'overview', params] as const,
  
  detailed: (params: AnalyticsQueryParams) => 
    [...ANALYTICS_QUERY_KEYS.all, 'detailed', params] as const,
  
  events: (params: AnalyticsQueryParams) => 
    [...ANALYTICS_QUERY_KEYS.all, 'events', params] as const,
  
  timeUtilization: (params: AnalyticsQueryParams) => 
    [...ANALYTICS_QUERY_KEYS.all, 'time-utilization', params] as const,
  
  categories: (params: CategoryAnalyticsQueryParams) => 
    [...ANALYTICS_QUERY_KEYS.all, 'categories', params] as const,
  
  timeDistribution: (params: TimeDistributionQueryParams) => 
    [...ANALYTICS_QUERY_KEYS.all, 'time-distribution', params] as const,
  
  attendees: (params: AnalyticsQueryParams) => 
    [...ANALYTICS_QUERY_KEYS.all, 'attendees', params] as const,
  
  bookings: (params: AnalyticsQueryParams) => 
    [...ANALYTICS_QUERY_KEYS.all, 'bookings', params] as const,
} as const;
