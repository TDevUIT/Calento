import { api, getErrorMessage } from '../config/axios';
import { API_ROUTES } from '../constants/routes';
import {
  BookingLink,
  CreateBookingLinkDto,
  UpdateBookingLinkDto,
  Booking,
  CreateBookingDto,
  BookingTimeSlot,
  BookingAvailabilityQuery,
  BookingLinkStats,
  BookingStats,
  BookingLinkResponse,
  BookingLinksResponse,
  BookingResponse,
  PaginatedBookingsResponse,
  BookingTimeSlotsResponse,
  BookingLinkStatsResponse,
  BookingStatsResponse,
} from '../interface/booking.interface';

// Re-export types for convenience
export type {
  BookingLink,
  CreateBookingLinkDto,
  UpdateBookingLinkDto,
  Booking,
  CreateBookingDto,
  BookingTimeSlot,
  BookingAvailabilityQuery,
  BookingLinkStats,
  BookingStats,
} from '../interface/booking.interface';


// Booking Link Functions

/**
 * Get all booking links for current user
 */
export const getBookingLinks = async (): Promise<BookingLink[]> => {
  try {
    const response = await api.get<BookingLinksResponse>(
      API_ROUTES.BOOKING_LINKS,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Get single booking link by ID
 */
export const getBookingLink = async (id: string): Promise<BookingLink> => {
  try {
    const response = await api.get<BookingLinkResponse>(
      API_ROUTES.BOOKING_LINK_DETAIL(id),
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Create new booking link
 */
export const createBookingLink = async (data: CreateBookingLinkDto): Promise<BookingLink> => {
  try {
    const response = await api.post<BookingLinkResponse>(
      API_ROUTES.BOOKING_LINKS,
      data,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Update booking link
 */
export const updateBookingLink = async (id: string, data: UpdateBookingLinkDto): Promise<BookingLink> => {
  try {
    const response = await api.patch<{ success: boolean; data: BookingLink }>(
      `/api/booking-links/${id}`,
      data,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Delete booking link
 */
export const deleteBookingLink = async (id: string): Promise<void> => {
  try {
    await api.delete(
      `/api/booking-links/${id}`,
      { withCredentials: true }
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Toggle booking link active status
 */
export const toggleBookingLink = async (id: string): Promise<BookingLink> => {
  try {
    const response = await api.patch<{ success: boolean; data: BookingLink }>(
      `/api/booking-links/${id}/toggle`,
      {},
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Get booking link stats
 */
export const getBookingLinkStats = async (id: string): Promise<{
  total_bookings: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
  this_week_bookings: number;
  this_month_bookings: number;
}> => {
  try {
    const response = await api.get<{ success: boolean; data: {
      total_bookings: number;
      confirmed_bookings: number;
      cancelled_bookings: number;
      this_week_bookings: number;
      this_month_bookings: number;
    } }>(
      `/api/booking-links/${id}/stats`,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Public Booking Functions (no auth required)

/**
 * Get public booking link by slug
 */
export const getPublicBookingLink = async (slug: string): Promise<BookingLink> => {
  try {
    const response = await api.get<{ success: boolean; data: BookingLink }>(
      `/api/bookings/public/${slug}`
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Get available time slots for booking link
 */
export const getAvailableSlots = async (
  slug: string, 
  params: BookingAvailabilityQuery
): Promise<BookingTimeSlot[]> => {
  try {
    const response = await api.get<{ success: boolean; data: BookingTimeSlot[] }>(
      `/api/bookings/public/${slug}/slots`,
      { params }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Create booking (public endpoint)
 */
export const createPublicBooking = async (slug: string, data: CreateBookingDto): Promise<Booking> => {
  try {
    const response = await api.post<{ success: boolean; data: Booking }>(
      `/api/bookings/public/${slug}/book`,
      data
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Cancel booking with token
 */
export const cancelPublicBooking = async (token: string, reason?: string): Promise<void> => {
  try {
    await api.post(
      `/api/bookings/public/cancel/${token}`,
      { reason }
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Reschedule booking with token
 */
export const reschedulePublicBooking = async (
  token: string, 
  new_start_time: string, 
  timezone: string
): Promise<Booking> => {
  try {
    const response = await api.post<{ success: boolean; data: Booking }>(
      `/api/bookings/public/reschedule/${token}`,
      { new_start_time, timezone }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Booking Management Functions (for dashboard)

/**
 * Get all bookings for current user
 */
export const getBookings = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  booking_link_id?: string;
  start_date?: string;
  end_date?: string;
}): Promise<{
  data: Booking[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  try {
    const response = await api.get<{ success: boolean; data: Booking[]; meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    } }>(
      '/api/bookings',
      { params, withCredentials: true }
    );
    return {
      data: response.data.data,
      meta: response.data.meta
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Get single booking
 */
export const getBooking = async (id: string): Promise<Booking> => {
  try {
    const response = await api.get<{ success: boolean; data: Booking }>(
      `/api/bookings/${id}`,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Cancel booking (by owner)
 */
export const cancelBooking = async (id: string, reason?: string): Promise<void> => {
  try {
    await api.post(
      `/api/bookings/${id}/cancel`,
      { reason },
      { withCredentials: true }
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Reschedule booking (by owner)
 */
export const rescheduleBooking = async (
  id: string, 
  new_start_time: string, 
  timezone: string
): Promise<Booking> => {
  try {
    const response = await api.post<{ success: boolean; data: Booking }>(
      `/api/bookings/${id}/reschedule`,
      { new_start_time, timezone },
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Mark booking as completed
 */
export const completeBooking = async (id: string): Promise<Booking> => {
  try {
    const response = await api.post<{ success: boolean; data: Booking }>(
      `/api/bookings/${id}/complete`,
      {},
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Get booking statistics
 */
export const getBookingStats = async (): Promise<{
  total_bookings: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
  completed_bookings: number;
  this_week_bookings: number;
  this_month_bookings: number;
  upcoming_bookings: number;
}> => {
  try {
    const response = await api.get<{ success: boolean; data: {
      total_bookings: number;
      confirmed_bookings: number;
      cancelled_bookings: number;
      completed_bookings: number;
      this_week_bookings: number;
      this_month_bookings: number;
      upcoming_bookings: number;
    } }>(
      '/api/bookings/stats',
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

