import { useQuery } from '@tanstack/react-query';
import {
  getAnalyticsOverview,
  getDetailedAnalytics,
  getEventAnalytics,
  getTimeUtilization,
  getCategoryAnalytics,
  getTimeDistribution,
  getAttendeeAnalytics,
  getBookingAnalytics,
} from '@/service';
import {
  AnalyticsQueryParams,
  TimeDistributionQueryParams,
  CategoryAnalyticsQueryParams,
} from '@/interface';
import { ANALYTICS_QUERY_KEYS } from './query-keys';

export const useAnalyticsOverview = (params: AnalyticsQueryParams) => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.overview(params),
    queryFn: async () => {
      return await getAnalyticsOverview(params);
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!params.start_date && !!params.end_date,
  });
};

export const useDetailedAnalytics = (params: AnalyticsQueryParams) => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.detailed(params),
    queryFn: async () => {
      return await getDetailedAnalytics(params);
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!params.start_date && !!params.end_date,
  });
};

export const useEventAnalytics = (params: AnalyticsQueryParams) => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.events(params),
    queryFn: async () => {
      return await getEventAnalytics(params);
    },
    staleTime: 1000 * 60 * 3,
    enabled: !!params.start_date && !!params.end_date,
  });
};

export const useTimeUtilization = (params: AnalyticsQueryParams) => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.timeUtilization(params),
    queryFn: async () => {
      return await getTimeUtilization(params);
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!params.start_date && !!params.end_date,
  });
};

export const useCategoryAnalytics = (params: CategoryAnalyticsQueryParams) => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.categories(params),
    queryFn: async () => {
      return await getCategoryAnalytics(params);
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!params.start_date && !!params.end_date,
  });
};

export const useTimeDistribution = (params: TimeDistributionQueryParams) => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.timeDistribution(params),
    queryFn: async () => {
      return await getTimeDistribution(params);
    },
    staleTime: 1000 * 60 * 3,
    enabled: !!params.start_date && !!params.end_date && !!params.period,
  });
};

export const useAttendeeAnalytics = (params: AnalyticsQueryParams) => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.attendees(params),
    queryFn: async () => {
      return await getAttendeeAnalytics(params);
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!params.start_date && !!params.end_date,
  });
};

export const useBookingAnalytics = (params: AnalyticsQueryParams) => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.bookings(params),
    queryFn: async () => {
      return await getBookingAnalytics(params);
    },
    staleTime: 1000 * 60 * 3,
    enabled: !!params.start_date && !!params.end_date,
  });
};
