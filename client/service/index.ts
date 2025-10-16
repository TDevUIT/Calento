// Auth service functions
export {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser,
  checkAuthStatus,
  authService,
} from './auth.service';

// Google service functions
export {
  getAuthUrl,
  getConnectionStatus,
  disconnect,
  syncCalendars,
  getCalendars,
  refreshToken as refreshGoogleToken,
  openAuthPopup,
  handleOAuthCallback,
  isConnected,
  isTokenExpired,
  ensureValidToken,
  googleService,
} from './google.service';

// Booking service functions
export {
  // Booking Links
  getBookingLinks,
  getBookingLink,
  createBookingLink,
  updateBookingLink,
  deleteBookingLink,
  toggleBookingLink,
  getBookingLinkStats,
  
  // Public Booking
  getPublicBookingLink,
  getAvailableSlots,
  createPublicBooking,
  cancelPublicBooking,
  reschedulePublicBooking,
  
  // Booking Management
  getBookings,
  getBooking,
  cancelBooking,
  rescheduleBooking,
  completeBooking,
  getBookingStats,
  
  // Types
  type BookingLink,
  type CreateBookingLinkDto,
  type UpdateBookingLinkDto,
  type Booking,
  type CreateBookingDto,
  type BookingTimeSlot,
  type BookingAvailabilityQuery,
} from './booking.service';

// HTTP utilities
export { default as api, getErrorMessage, isNetworkError, isTimeoutError, isServerError, isClientError } from '../config/axios';
