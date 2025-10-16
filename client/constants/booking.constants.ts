// Booking Routes
export const BOOKING_ROUTES = {
  // Public booking pages
  PUBLIC_BOOKING: (slug: string) => `/book/${slug}`,
  
  // Dashboard booking management
  DASHBOARD_SCHEDULE: '/dashboard/schedule',
  DASHBOARD_BOOKINGS: '/dashboard/bookings',
  BOOKING_DETAIL: (id: string) => `/dashboard/bookings/${id}`,
} as const;

// API Routes for Booking
export const BOOKING_API_ROUTES = {
  // Booking Links
  BOOKING_LINKS: '/api/booking-links',
  BOOKING_LINK_DETAIL: (id: string) => `/api/booking-links/${id}`,
  BOOKING_LINK_TOGGLE: (id: string) => `/api/booking-links/${id}/toggle`,
  BOOKING_LINK_STATS: (id: string) => `/api/booking-links/${id}/stats`,
  
  // Bookings Management
  BOOKINGS: '/api/bookings',
  BOOKING_DETAIL: (id: string) => `/api/bookings/${id}`,
  BOOKING_CANCEL: (id: string) => `/api/bookings/${id}/cancel`,
  BOOKING_RESCHEDULE: (id: string) => `/api/bookings/${id}/reschedule`,
  BOOKING_COMPLETE: (id: string) => `/api/bookings/${id}/complete`,
  BOOKING_STATS: '/api/bookings/stats',
  
  // Public Booking APIs
  PUBLIC_BOOKING_LINK: (slug: string) => `/api/bookings/public/${slug}`,
  PUBLIC_BOOKING_SLOTS: (slug: string) => `/api/bookings/public/${slug}/slots`,
  PUBLIC_BOOKING_CREATE: (slug: string) => `/api/bookings/public/${slug}/book`,
  PUBLIC_BOOKING_CANCEL: (token: string) => `/api/bookings/public/cancel/${token}`,
  PUBLIC_BOOKING_RESCHEDULE: (token: string) => `/api/bookings/public/reschedule/${token}`,
} as const;

// Booking Status Options
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;

export const BOOKING_STATUS_LABELS = {
  [BOOKING_STATUS.PENDING]: 'Pending',
  [BOOKING_STATUS.CONFIRMED]: 'Confirmed',
  [BOOKING_STATUS.CANCELLED]: 'Cancelled',
  [BOOKING_STATUS.COMPLETED]: 'Completed',
} as const;

export const BOOKING_STATUS_COLORS = {
  [BOOKING_STATUS.PENDING]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  [BOOKING_STATUS.CONFIRMED]: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  [BOOKING_STATUS.CANCELLED]: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  [BOOKING_STATUS.COMPLETED]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
} as const;

// Booking Link Colors
export const BOOKING_LINK_COLORS = {
  BLUE: 'blue',
  GREEN: 'green',
  PURPLE: 'purple',
  RED: 'red',
  ORANGE: 'orange',
  PINK: 'pink',
} as const;

export const BOOKING_LINK_COLOR_OPTIONS = [
  { value: BOOKING_LINK_COLORS.BLUE, label: 'Blue', color: 'bg-blue-500' },
  { value: BOOKING_LINK_COLORS.GREEN, label: 'Green', color: 'bg-green-500' },
  { value: BOOKING_LINK_COLORS.PURPLE, label: 'Purple', color: 'bg-purple-500' },
  { value: BOOKING_LINK_COLORS.RED, label: 'Red', color: 'bg-red-500' },
  { value: BOOKING_LINK_COLORS.ORANGE, label: 'Orange', color: 'bg-orange-500' },
  { value: BOOKING_LINK_COLORS.PINK, label: 'Pink', color: 'bg-pink-500' },
] as const;

// Duration Options (in minutes)
export const DURATION_OPTIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
  { value: 240, label: '4 hours' },
] as const;

// Default Values
export const BOOKING_DEFAULTS = {
  DURATION_MINUTES: 30,
  BUFFER_TIME_MINUTES: 0,
  ADVANCE_NOTICE_HOURS: 24,
  BOOKING_WINDOW_DAYS: 60,
  COLOR: BOOKING_LINK_COLORS.BLUE,
  IS_ACTIVE: true,
  TIMEZONE: 'UTC',
} as const;

// Validation Limits
export const BOOKING_LIMITS = {
  MIN_DURATION_MINUTES: 5,
  MAX_DURATION_MINUTES: 480, // 8 hours
  MIN_BUFFER_TIME_MINUTES: 0,
  MAX_BUFFER_TIME_MINUTES: 60,
  MIN_ADVANCE_NOTICE_HOURS: 0,
  MAX_ADVANCE_NOTICE_HOURS: 168, // 1 week
  MIN_BOOKING_WINDOW_DAYS: 1,
  MAX_BOOKING_WINDOW_DAYS: 365, // 1 year
  MIN_MAX_BOOKINGS_PER_DAY: 1,
  MAX_MAX_BOOKINGS_PER_DAY: 50,
  MIN_SLUG_LENGTH: 3,
  MAX_SLUG_LENGTH: 100,
  MAX_TITLE_LENGTH: 255,
} as const;

// Notification Types
export const BOOKING_NOTIFICATION_TYPES = {
  NEW_BOOKING: 'new_booking',
  BOOKING_CANCELLED: 'booking_cancelled',
  BOOKING_RESCHEDULED: 'booking_rescheduled',
  BOOKING_REMINDER: 'booking_reminder',
} as const;

export const BOOKING_NOTIFICATION_TITLES = {
  [BOOKING_NOTIFICATION_TYPES.NEW_BOOKING]: 'New Booking Received',
  [BOOKING_NOTIFICATION_TYPES.BOOKING_CANCELLED]: 'Booking Cancelled',
  [BOOKING_NOTIFICATION_TYPES.BOOKING_RESCHEDULED]: 'Booking Rescheduled',
  [BOOKING_NOTIFICATION_TYPES.BOOKING_REMINDER]: 'Meeting Reminder',
} as const;

export const BOOKING_NOTIFICATION_MESSAGES = {
  [BOOKING_NOTIFICATION_TYPES.NEW_BOOKING]: 'Someone just booked a meeting with you.',
  [BOOKING_NOTIFICATION_TYPES.BOOKING_CANCELLED]: 'A booking has been cancelled.',
  [BOOKING_NOTIFICATION_TYPES.BOOKING_RESCHEDULED]: 'A booking has been rescheduled.',
  [BOOKING_NOTIFICATION_TYPES.BOOKING_REMINDER]: 'You have an upcoming meeting in 15 minutes.',
} as const;
