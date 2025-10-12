import { api, getErrorMessage } from '../config/axios';
import {
  Event,
  CreateEventRequest,
  UpdateEventRequest,
  EventQueryParams,
  RecurringEventsQueryParams,
  PaginatedEventsResponse,
  EventResponse,
  ExpandedEvent,
} from '../interface/event.interface';
import { API_ROUTES } from '../constants/routes';

/**
 * Get paginated list of events
 */
export const getEvents = async (params?: EventQueryParams): Promise<PaginatedEventsResponse> => {
  try {
    const response = await api.get<PaginatedEventsResponse>(
      API_ROUTES.EVENTS,
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

/**
 * Get event by ID
 */
export const getEventById = async (id: string): Promise<EventResponse> => {
  try {
    const response = await api.get<EventResponse>(
      API_ROUTES.EVENT_DETAIL(id),
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Create new event
 */
export const createEvent = async (data: CreateEventRequest): Promise<EventResponse> => {
  try {
    const response = await api.post<EventResponse>(
      API_ROUTES.EVENT_CREATE,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Update existing event
 */
export const updateEvent = async (
  id: string,
  data: UpdateEventRequest
): Promise<EventResponse> => {
  try {
    const response = await api.patch<EventResponse>(
      API_ROUTES.EVENT_UPDATE(id),
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Delete event
 */
export const deleteEvent = async (id: string): Promise<void> => {
  try {
    await api.delete(
      API_ROUTES.EVENT_DELETE(id),
      { withCredentials: true }
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Expand recurring events into individual occurrences
 */
export const expandRecurringEvents = async (
  params: RecurringEventsQueryParams
): Promise<PaginatedEventsResponse> => {
  try {
    const response = await api.get<PaginatedEventsResponse>(
      API_ROUTES.EVENT_RECURRING_EXPAND,
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

/**
 * Get events by date range
 */
export const getEventsByDateRange = async (
  startDate: string,
  endDate: string,
  params?: Omit<EventQueryParams, 'start_date' | 'end_date'>
): Promise<PaginatedEventsResponse> => {
  try {
    const response = await api.get<PaginatedEventsResponse>(
      API_ROUTES.EVENTS,
      {
        params: {
          ...params,
          start_date: startDate,
          end_date: endDate,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Search events
 */
export const searchEvents = async (
  searchTerm: string,
  params?: Omit<EventQueryParams, 'search'>
): Promise<PaginatedEventsResponse> => {
  try {
    const response = await api.get<PaginatedEventsResponse>(
      API_ROUTES.EVENTS,
      {
        params: {
          ...params,
          search: searchTerm,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const eventService = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  expandRecurringEvents,
  getEventsByDateRange,
  searchEvents,
};

export default eventService;
