import { format, parseISO, addDays, startOfDay } from 'date-fns';
import {
  BOOKING_STATUS,
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_COLORS,
  BOOKING_LINK_COLORS,
  DURATION_OPTIONS,
} from '../constants/booking.constants';
import type { BookingLink, Booking } from '../interface/booking.interface';
import { formatDuration } from './formatters';


export function formatTimeSlot(dateTimeString: string): string {
  const date = parseISO(dateTimeString);
  return format(date, 'h:mm a');
}


export function formatDateDisplay(dateString: string): string {
  const date = parseISO(dateString + 'T00:00:00');
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const selectedDateObj = parseISO(dateString + 'T00:00:00');
  
  if (selectedDateObj.getTime() === today.getTime()) {
    return "Today";
  } else if (selectedDateObj.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  } else {
    return format(selectedDateObj, 'MMM d, yyyy');
  }
}


export function getBookingStatusLabel(status: string): string {
  return BOOKING_STATUS_LABELS[status as keyof typeof BOOKING_STATUS_LABELS] || status;
}


export function getBookingStatusColor(status: string): string {
  return BOOKING_STATUS_COLORS[status as keyof typeof BOOKING_STATUS_COLORS] || 'bg-gray-100 text-gray-700';
}


export function getBookingLinkColorClasses(color?: string): {
  background: string;
  text: string;
} {
  switch (color) {
    case BOOKING_LINK_COLORS.BLUE:
      return {
        background: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-600 dark:text-blue-400'
      };
    case BOOKING_LINK_COLORS.GREEN:
      return {
        background: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-600 dark:text-green-400'
      };
    case BOOKING_LINK_COLORS.PURPLE:
      return {
        background: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-600 dark:text-purple-400'
      };
    case BOOKING_LINK_COLORS.RED:
      return {
        background: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-600 dark:text-red-400'
      };
    case BOOKING_LINK_COLORS.ORANGE:
      return {
        background: 'bg-orange-100 dark:bg-orange-900/30',
        text: 'text-orange-600 dark:text-orange-400'
      };
    case BOOKING_LINK_COLORS.PINK:
      return {
        background: 'bg-pink-100 dark:bg-pink-900/30',
        text: 'text-pink-600 dark:text-pink-400'
      };
    default:
      return {
        background: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-600 dark:text-blue-400'
      };
  }
}


export function generateBookingLinkUrl(slug: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/book/${slug}`;
}

export function validateBookingLinkSlug(slug: string): {
  isValid: boolean;
  error?: string;
} {
  if (!slug) {
    return { isValid: false, error: 'Slug is required' };
  }
  
  if (slug.length < 3) {
    return { isValid: false, error: 'Slug must be at least 3 characters' };
  }
  
  if (slug.length > 100) {
    return { isValid: false, error: 'Slug must be less than 100 characters' };
  }
  
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { isValid: false, error: 'Slug can only contain lowercase letters, numbers, and hyphens' };
  }
  
  return { isValid: true };
}

export function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}


export function getDurationLabel(minutes: number): string {
  const option = DURATION_OPTIONS.find(opt => opt.value === minutes);
  return option?.label || formatDuration(minutes);
}


export function isUpcomingBooking(booking: Booking): boolean {
  const startTime = parseISO(booking.start_time);
  const now = new Date();
  return startTime > now && booking.status === BOOKING_STATUS.CONFIRMED;
}


export function isPastBooking(booking: Booking): boolean {
  const endTime = parseISO(booking.end_time);
  const now = new Date();
  return endTime < now;
}


export function getBookingTimeRange(booking: Booking): string {
  const startTime = parseISO(booking.start_time);
  const endTime = parseISO(booking.end_time);
  
  const startFormatted = format(startTime, 'h:mm a');
  const endFormatted = format(endTime, 'h:mm a');
  const dateFormatted = format(startTime, 'MMM d, yyyy');
  
  return `${dateFormatted} â€¢ ${startFormatted} - ${endFormatted}`;
}


export function calculateBookingLinkStats(bookings: Booking[]) {
  const total = bookings.length;
  const confirmed = bookings.filter(b => b.status === BOOKING_STATUS.CONFIRMED).length;
  const cancelled = bookings.filter(b => b.status === BOOKING_STATUS.CANCELLED).length;
  const completed = bookings.filter(b => b.status === BOOKING_STATUS.COMPLETED).length;
  const pending = bookings.filter(b => b.status === BOOKING_STATUS.PENDING).length;
  
  const now = new Date();
  const thisWeekStart = startOfDay(addDays(now, -now.getDay()));
  const thisWeekEnd = addDays(thisWeekStart, 7);
  
  const thisWeek = bookings.filter(b => {
    const bookingDate = parseISO(b.created_at);
    return bookingDate >= thisWeekStart && bookingDate < thisWeekEnd;
  }).length;
  
  return {
    total,
    confirmed,
    cancelled,
    completed,
    pending,
    thisWeek,
    confirmationRate: total > 0 ? Math.round((confirmed / total) * 100) : 0,
    cancellationRate: total > 0 ? Math.round((cancelled / total) * 100) : 0,
  };
}
