import { api, getErrorMessage } from '../config/axios';
import {
  CreateCalendarRequest,
  UpdateCalendarRequest,
  CalendarQueryParams,
  PaginatedCalendarsResponse,
  CalendarResponse,
} from '../interface/calendar.interface';
import { API_ROUTES } from '../constants/routes';

export const getCalendars = async (params?: CalendarQueryParams): Promise<PaginatedCalendarsResponse> => {
  try {
    const response = await api.get<PaginatedCalendarsResponse>(
      API_ROUTES.CALENDARS,
      {
        params,
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getPrimaryCalendar = async (): Promise<CalendarResponse> => {
  try {
    const response = await api.get<CalendarResponse>(
      API_ROUTES.CALENDAR_PRIMARY,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};


export const searchCalendars = async (
  searchTerm: string,
  params?: Omit<CalendarQueryParams, 'search'>
): Promise<PaginatedCalendarsResponse> => {
  try {
    const response = await api.get<PaginatedCalendarsResponse>(
      API_ROUTES.CALENDAR_SEARCH,
      {
        params: {
          q: searchTerm,
          ...params,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};


export const getCalendarById = async (id: string): Promise<CalendarResponse> => {
  try {
    const response = await api.get<CalendarResponse>(
      API_ROUTES.CALENDAR_DETAIL(id),
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};


export const createCalendar = async (data: CreateCalendarRequest): Promise<CalendarResponse> => {
  try {
    const response = await api.post<CalendarResponse>(
      API_ROUTES.CALENDAR_CREATE,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};


export const updateCalendar = async (
  id: string,
  data: UpdateCalendarRequest
): Promise<CalendarResponse> => {
  try {
    const response = await api.put<CalendarResponse>(
      API_ROUTES.CALENDAR_UPDATE(id),
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};


export const deleteCalendar = async (id: string): Promise<void> => {
  try {
    await api.delete(
      API_ROUTES.CALENDAR_DELETE(id),
      { withCredentials: true }
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const calendarService = {
  getCalendars,
  getPrimaryCalendar,
  searchCalendars,
  getCalendarById,
  createCalendar,
  updateCalendar,
  deleteCalendar,
};

export default calendarService;
