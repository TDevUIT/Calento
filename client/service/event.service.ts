import { api, getErrorMessage } from '../config/axios';
import {
  CreateEventRequest,
  UpdateEventRequest,
  PartialUpdateEventRequest,
  EventQueryParams,
  RecurringEventsQueryParams,
  PaginatedEventsResponse,
  EventResponse,
} from '../interface/event.interface';
import { API_ROUTES } from '../constants/routes';


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


export const replaceEvent = async (
  id: string,
  data: UpdateEventRequest
): Promise<EventResponse> => {
  try {
    const response = await api.put<EventResponse>(
      API_ROUTES.EVENT_UPDATE(id),
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateEvent = async (
  id: string,
  data: PartialUpdateEventRequest
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


export const updateEventPut = async (
  id: string,
  data: UpdateEventRequest
): Promise<EventResponse> => {
  return replaceEvent(id, data);
};


export const updateEventWithMethod = async (
  id: string,
  data: UpdateEventRequest | PartialUpdateEventRequest,
  method: 'PATCH' | 'PUT' = 'PATCH'
): Promise<EventResponse> => {
  try {
    const response = method === 'PUT'
      ? await api.put<EventResponse>(
          API_ROUTES.EVENT_UPDATE(id),
          data,
          { withCredentials: true }
        )
      : await api.patch<EventResponse>(
          API_ROUTES.EVENT_UPDATE(id),
          data,
          { withCredentials: true }
        );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};


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
  replaceEvent,
  updateEvent,
  updateEventPut, // Legacy - deprecated
  updateEventWithMethod,
  deleteEvent,
  expandRecurringEvents,
  getEventsByDateRange,
  searchEvents,
};

export default eventService;
