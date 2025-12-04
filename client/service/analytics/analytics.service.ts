import { api, getErrorMessage } from '../../config/axios';
import {
  AnalyticsQueryParams,
  TimeDistributionQueryParams,
  CategoryAnalyticsQueryParams,
  EventAnalytics,
  TimeUtilization,
  CategoryAnalytics,
  TimeDistribution,
  AttendeeAnalytics,
  BookingAnalytics,
  AnalyticsOverview,
  DetailedAnalytics,
  AnalyticsResponse,
} from '../../interface/analytics.interface';

export const getAnalyticsOverview = async (
  params: AnalyticsQueryParams
): Promise<AnalyticsOverview> => {
  try {
    const response = await api.get<AnalyticsResponse<AnalyticsOverview>>(
      '/analytics/overview',
      {
        params,
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getDetailedAnalytics = async (
  params: AnalyticsQueryParams
): Promise<DetailedAnalytics> => {
  try {
    const response = await api.get<AnalyticsResponse<DetailedAnalytics>>(
      '/analytics/detailed',
      {
        params,
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getEventAnalytics = async (
  params: AnalyticsQueryParams
): Promise<EventAnalytics> => {
  try {
    const response = await api.get<AnalyticsResponse<EventAnalytics>>(
      '/analytics/events',
      {
        params,
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getTimeUtilization = async (
  params: AnalyticsQueryParams
): Promise<TimeUtilization> => {
  try {
    const response = await api.get<AnalyticsResponse<TimeUtilization>>(
      '/analytics/time-utilization',
      {
        params,
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getCategoryAnalytics = async (
  params: CategoryAnalyticsQueryParams
): Promise<CategoryAnalytics[]> => {
  try {
    const response = await api.get<AnalyticsResponse<CategoryAnalytics[]>>(
      '/analytics/categories',
      {
        params,
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getTimeDistribution = async (
  params: TimeDistributionQueryParams
): Promise<TimeDistribution[]> => {
  try {
    const response = await api.get<AnalyticsResponse<TimeDistribution[]>>(
      '/analytics/time-distribution',
      {
        params,
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getAttendeeAnalytics = async (
  params: AnalyticsQueryParams
): Promise<AttendeeAnalytics> => {
  try {
    const response = await api.get<AnalyticsResponse<AttendeeAnalytics>>(
      '/analytics/attendees',
      {
        params,
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getBookingAnalytics = async (
  params: AnalyticsQueryParams
): Promise<BookingAnalytics> => {
  try {
    const response = await api.get<AnalyticsResponse<BookingAnalytics>>(
      '/analytics/bookings',
      {
        params,
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const analyticsService = {
  getAnalyticsOverview,
  getDetailedAnalytics,
  getEventAnalytics,
  getTimeUtilization,
  getCategoryAnalytics,
  getTimeDistribution,
  getAttendeeAnalytics,
  getBookingAnalytics,
};

export default analyticsService;

