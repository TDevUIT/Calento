import { Injectable, Logger } from '@nestjs/common';
import { BookingLinkRepository } from './repositories/booking-link.repository';
import { BookingRepository } from './repositories/booking.repository';
import { DatabaseService } from '../../database/database.service';
import { MessageService } from '../../common/message/message.service';
import { TIME_CONSTANTS } from '../../common/constants';
import {
  Booking,
  BookingLink,
  BookingStatus,
  BookingTimeSlot,
} from './interfaces/booking.interface';
import {
  CreateBookingLinkDto,
  UpdateBookingLinkDto,
  CreateBookingDto,
  CancelBookingDto,
  RescheduleBookingDto,
  GetBookingAvailableSlotsDto,
} from './dto/booking.dto';
import {
  BookingLinkNotFoundException,
  BookingNotFoundException,
  BookingLinkInactiveException,
  BookingTimeUnavailableException,
  BookingPastDateException,
  BookingAdvanceNoticeException,
  BookingOutsideWindowException,
  BookingDailyLimitException,
  BookingAlreadyCancelledException,
} from './exceptions/booking.exceptions';
import { AvailabilityService } from '../availability/services/availability.service';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    private readonly bookingLinkRepository: BookingLinkRepository,
    private readonly bookingRepository: BookingRepository,
    private readonly availabilityService: AvailabilityService,
    private readonly messageService: MessageService,
  ) {}

  async createBookingLink(
    userId: string,
    dto: CreateBookingLinkDto,
  ): Promise<BookingLink> {
    return this.bookingLinkRepository.create({
      user_id: userId,
      ...dto,
      is_active: dto.is_active !== undefined ? dto.is_active : true,
      buffer_time_minutes: dto.buffer_time_minutes ?? 0,
      advance_notice_hours: dto.advance_notice_hours ?? 24,
      booking_window_days: dto.booking_window_days ?? 60,
      timezone: dto.timezone ?? 'UTC',
    });
  }

  async getBookingLinks(userId: string): Promise<BookingLink[]> {
    return this.bookingLinkRepository.findByUserId(userId);
  }

  async getActiveBookingLinks(userId: string): Promise<BookingLink[]> {
    return this.bookingLinkRepository.findActiveByUserId(userId);
  }

  async getBookingLinkById(id: string, userId: string): Promise<BookingLink> {
    const link = await this.bookingLinkRepository.findById(id);

    if (!link || link.user_id !== userId) {
      const message = this.messageService.get(
        'booking.link_not_found',
        undefined,
        { id },
      );
      throw new BookingLinkNotFoundException(message);
    }

    return link;
  }

  async getBookingLinkBySlug(slug: string): Promise<BookingLink> {
    const link = await this.bookingLinkRepository.findBySlug(slug);

    if (!link) {
      const message = this.messageService.get(
        'booking.link_slug_not_found',
        undefined,
        { slug },
      );
      throw new BookingLinkNotFoundException(message);
    }

    return link;
  }

  async getPublicBookingLink(slug: string): Promise<BookingLink> {
    const link = await this.bookingLinkRepository.findBySlug(slug);

    if (!link) {
      const message = this.messageService.get(
        'booking.link_slug_not_found',
        undefined,
        { slug },
      );
      throw new BookingLinkNotFoundException(message);
    }

    // Only return active booking links for public access
    if (!link.is_active) {
      const message = this.messageService.get(
        'booking.link_inactive',
        undefined,
        { slug },
      );
      throw new BookingLinkInactiveException(message);
    }

    return link;
  }

  async updateBookingLink(
    id: string,
    userId: string,
    dto: UpdateBookingLinkDto,
  ): Promise<BookingLink> {
    await this.getBookingLinkById(id, userId);
    return this.bookingLinkRepository.update(id, dto);
  }

  async deleteBookingLink(id: string, userId: string): Promise<void> {
    await this.getBookingLinkById(id, userId);
    await this.bookingLinkRepository.delete(id);
  }

  async createBooking(slug: string, dto: CreateBookingDto): Promise<Booking> {
    const bookingLink = await this.getBookingLinkBySlug(slug);

    if (!bookingLink.is_active) {
      const message = this.messageService.get('booking.link_inactive');
      throw new BookingLinkInactiveException(message);
    }

    const startTime = new Date(dto.start_time);
    const endTime = new Date(
      startTime.getTime() + bookingLink.duration_minutes * 60 * 1000,
    );

    await this.validateBookingTime(bookingLink, startTime, endTime);

    const booking = await this.bookingRepository.create({
      booking_link_id: bookingLink.id,
      user_id: bookingLink.user_id,
      booker_name: dto.booker_name,
      booker_email: dto.booker_email,
      booker_phone: dto.booker_phone,
      booker_notes: dto.booker_notes,
      start_time: startTime,
      end_time: endTime,
      timezone: dto.timezone,
      status: BookingStatus.CONFIRMED,
      confirmation_token: this.generateConfirmationToken(),
    });

    return booking;
  }

  async getBookings(userId: string): Promise<Booking[]> {
    return this.bookingRepository.findByUserId(userId);
  }

  async getUpcomingBookings(userId: string): Promise<Booking[]> {
    return this.bookingRepository.findUpcomingByUserId(userId);
  }

  async getBookingById(id: string, userId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findById(id);

    if (!booking || booking.user_id !== userId) {
      const message = this.messageService.get('booking.not_found', undefined, {
        id,
      });
      throw new BookingNotFoundException(message);
    }

    return booking;
  }

  async cancelBooking(
    id: string,
    userId: string,
    dto: CancelBookingDto,
  ): Promise<Booking> {
    const booking = await this.getBookingById(id, userId);

    if (booking.status === BookingStatus.CANCELLED) {
      const message = this.messageService.get('booking.already_cancelled');
      throw new BookingAlreadyCancelledException(message);
    }

    return this.bookingRepository.updateStatus(
      id,
      BookingStatus.CANCELLED,
      dto.cancellation_reason,
    );
  }

  async rescheduleBooking(
    id: string,
    userId: string,
    dto: RescheduleBookingDto,
  ): Promise<Booking> {
    const booking = await this.getBookingById(id, userId);
    const bookingLink = await this.bookingLinkRepository.findById(
      booking.booking_link_id,
    );

    if (!bookingLink) {
      const message = this.messageService.get(
        'booking.link_not_found',
        undefined,
        {
          id: booking.booking_link_id,
        },
      );
      throw new BookingLinkNotFoundException(message);
    }

    const newStartTime = new Date(dto.start_time);
    const newEndTime = new Date(
      newStartTime.getTime() + bookingLink.duration_minutes * 60 * 1000,
    );

    await this.validateBookingTime(bookingLink, newStartTime, newEndTime, id);

    return this.bookingRepository.reschedule(id, newStartTime, newEndTime);
  }

  async getAvailableSlots(
    slug: string,
    dto: GetBookingAvailableSlotsDto,
  ): Promise<BookingTimeSlot[]> {
    const bookingLink = await this.getBookingLinkBySlug(slug);

    if (!bookingLink.is_active) {
      const message = this.messageService.get('booking.link_inactive');
      throw new BookingLinkInactiveException(message);
    }

    const startDate = new Date(dto.start_date);
    const endDate = new Date(dto.end_date);

    const availabilitySlots = await this.availabilityService.getAvailableSlots(
      bookingLink.user_id,
      {
        start_date: dto.start_date,
        end_date: dto.end_date,
        duration_minutes:
          bookingLink.duration_minutes + bookingLink.buffer_time_minutes,
      },
    );

    const bookings = await this.bookingRepository.findByDateRange(
      bookingLink.id,
      startDate,
      endDate,
    );

    const bookingSlots: BookingTimeSlot[] = [];

    for (const slot of availabilitySlots) {
      if (!slot.available) {
        bookingSlots.push({
          start: new Date(slot.start_time),
          end: new Date(slot.end_time),
          available: false,
          reason: 'User not available',
        });
        continue;
      }

      const slotStart = new Date(slot.start_time);
      const slotEnd = new Date(slot.end_time);

      const now = new Date();
      const advanceNoticeMs =
        bookingLink.advance_notice_hours *
        TIME_CONSTANTS.BOOKING.ADVANCE_NOTICE_MULTIPLIER;
      if (slotStart.getTime() - now.getTime() < advanceNoticeMs) {
        bookingSlots.push({
          start: slotStart,
          end: slotEnd,
          available: false,
          reason: 'Does not meet advance notice requirement',
        });
        continue;
      }

      const bookingWindowMs =
        bookingLink.booking_window_days *
        TIME_CONSTANTS.BOOKING.BOOKING_WINDOW_MULTIPLIER;
      if (slotStart.getTime() - now.getTime() > bookingWindowMs) {
        bookingSlots.push({
          start: slotStart,
          end: slotEnd,
          available: false,
          reason: 'Outside booking window',
        });
        continue;
      }

      const hasConflict = bookings.some((booking) => {
        const bookingStart = new Date(booking.start_time);
        const bookingEnd = new Date(booking.end_time);
        return slotStart < bookingEnd && slotEnd > bookingStart;
      });

      if (hasConflict) {
        bookingSlots.push({
          start: slotStart,
          end: slotEnd,
          available: false,
          reason: 'Time slot already booked',
        });
        continue;
      }

      if (bookingLink.max_bookings_per_day) {
        const dayCount = await this.bookingRepository.countByDate(
          bookingLink.id,
          slotStart,
        );
        if (dayCount >= bookingLink.max_bookings_per_day) {
          bookingSlots.push({
            start: slotStart,
            end: slotEnd,
            available: false,
            reason: 'Daily booking limit reached',
          });
          continue;
        }
      }

      bookingSlots.push({
        start: slotStart,
        end: slotEnd,
        available: true,
      });
    }

    return bookingSlots;
  }

  private async validateBookingTime(
    bookingLink: BookingLink,
    startTime: Date,
    endTime: Date,
    excludeBookingId?: string,
  ): Promise<void> {
    const now = new Date();

    if (startTime < now) {
      const message = this.messageService.get('booking.past_date');
      throw new BookingPastDateException(message);
    }

    const advanceNoticeMs =
      bookingLink.advance_notice_hours *
      TIME_CONSTANTS.BOOKING.ADVANCE_NOTICE_MULTIPLIER;
    if (startTime.getTime() - now.getTime() < advanceNoticeMs) {
      const message = this.messageService.get(
        'booking.advance_notice',
        undefined,
        {
          hours: bookingLink.advance_notice_hours.toString(),
        },
      );
      throw new BookingAdvanceNoticeException(message);
    }

    const bookingWindowMs =
      bookingLink.booking_window_days *
      TIME_CONSTANTS.BOOKING.BOOKING_WINDOW_MULTIPLIER;
    if (startTime.getTime() - now.getTime() > bookingWindowMs) {
      const message = this.messageService.get(
        'booking.outside_window',
        undefined,
        {
          days: bookingLink.booking_window_days.toString(),
        },
      );
      throw new BookingOutsideWindowException(message);
    }

    const availabilityCheck = await this.availabilityService.checkAvailability(
      bookingLink.user_id,
      {
        start_datetime: startTime.toISOString(),
        end_datetime: endTime.toISOString(),
      },
    );

    if (!availabilityCheck.available) {
      const message = this.messageService.get('booking.time_unavailable');
      throw new BookingTimeUnavailableException(message);
    }

    const bookings = await this.bookingRepository.findByDateRange(
      bookingLink.id,
      startTime,
      endTime,
    );

    const hasConflict = bookings.some((booking) => {
      if (excludeBookingId && booking.id === excludeBookingId) {
        return false;
      }
      const bookingStart = new Date(booking.start_time);
      const bookingEnd = new Date(booking.end_time);
      return startTime < bookingEnd && endTime > bookingStart;
    });

    if (hasConflict) {
      const message = this.messageService.get('booking.time_unavailable');
      throw new BookingTimeUnavailableException(message);
    }

    if (bookingLink.max_bookings_per_day) {
      const dayCount = await this.bookingRepository.countByDate(
        bookingLink.id,
        startTime,
      );
      if (dayCount >= bookingLink.max_bookings_per_day) {
        const message = this.messageService.get(
          'booking.daily_limit',
          undefined,
          {
            limit: bookingLink.max_bookings_per_day.toString(),
          },
        );
        throw new BookingDailyLimitException(message);
      }
    }
  }

  private generateConfirmationToken(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  async getBookingsByLink(linkId: string, userId: string): Promise<Booking[]> {
    await this.getBookingLinkById(linkId, userId);
    return this.bookingRepository.findByBookingLinkId(linkId);
  }

  async getBookingStats(userId: string): Promise<{
    total_bookings: number;
    confirmed_bookings: number;
    cancelled_bookings: number;
    completed_bookings: number;
    this_week_bookings: number;
    this_month_bookings: number;
    upcoming_bookings: number;
  }> {
    return this.bookingRepository.getBookingStats(userId);
  }
}
