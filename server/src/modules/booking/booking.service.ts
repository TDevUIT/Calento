import { Injectable, Logger } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { BookingLinkRepository } from './repositories/booking-link.repository';
import { BookingRepository } from './repositories/booking.repository';
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
import { UserService } from '../users/user.service';
import { EventService } from '../event/event.service';
import { CalendarService } from '../calendar/calendar.service';
import { EventAttendeeDto } from '../event/dto/events.dto';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    private readonly bookingLinkRepository: BookingLinkRepository,
    private readonly bookingRepository: BookingRepository,
    private readonly availabilityService: AvailabilityService,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly eventService: EventService,
    private readonly calendarService: CalendarService,
  ) { }

  async createBookingLink(
    userId: string,
    dto: CreateBookingLinkDto,
  ): Promise<BookingLink> {
    const timezone =
      dto.timezone || (await this.userService.getUserTimezone(userId)) || 'UTC';
    return this.bookingLinkRepository.create({
      user_id: userId,
      ...dto,
      is_active: dto.is_active !== undefined ? dto.is_active : true,
      buffer_time_minutes: dto.buffer_time_minutes ?? 0,
      advance_notice_hours: dto.advance_notice_hours ?? 24,
      booking_window_days: dto.booking_window_days ?? 60,
      timezone,
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
    // Calculate end time for the actual meeting duration (without buffer)
    const actualEndTime = new Date(
      startTime.getTime() + bookingLink.duration_minutes * 60 * 1000,
    );
    // Calculate end time including buffer time for storage (to prevent back-to-back bookings)
    const endTimeWithBuffer = new Date(
      startTime.getTime() + (bookingLink.duration_minutes + (bookingLink.buffer_time_minutes || 0)) * 60 * 1000,
    );

    // Validate using actual meeting time (without buffer), as buffer is just spacing between meetings
    await this.validateBookingTime(bookingLink, startTime, actualEndTime);

    const booking = await this.bookingRepository.create({
      booking_link_id: bookingLink.id,
      user_id: bookingLink.user_id,
      booker_name: dto.booker_name,
      booker_email: dto.booker_email,
      booker_phone: dto.booker_phone,
      booker_notes: dto.booker_notes,
      start_time: startTime,
      end_time: endTimeWithBuffer,
      timezone: dto.timezone || bookingLink.timezone || 'UTC',
      status: BookingStatus.CONFIRMED,
      confirmation_token: this.generateConfirmationToken(),
    });

    // Create event in the user's primary calendar
    try {
      const primaryCalendar = await this.calendarService.getPrimaryCalendar(
        bookingLink.user_id,
      );

      if (primaryCalendar) {
        const attendees: EventAttendeeDto[] = [
          {
            email: dto.booker_email,
            name: dto.booker_name,
            response_status: 'accepted',
          },
        ];

        // Add user (host) as attendee
        const user = await this.userService.getUserById(bookingLink.user_id);
        if (user && user.email) {
          attendees.push({
            email: user.email,
            name: `${user.first_name} ${user.last_name}`.trim(),
            response_status: 'accepted',
            is_organizer: true,
          });
        }

        const event = await this.eventService.createEvent(
          {
            calendar_id: primaryCalendar.id,
            title: bookingLink.title, // Use booking link title
            description: dto.booker_notes || bookingLink.description,
            start_time: startTime.toISOString(),
            end_time: actualEndTime.toISOString(),
            location: bookingLink.location,
            timezone: booking.timezone,
            attendees: attendees,
            conference_data: bookingLink.location_link
              ? {
                type: 'custom',
                url: bookingLink.location_link,
              }
              : undefined,
          },
          bookingLink.user_id,
        );

        // Update booking with event_id if needed (assuming booking entity has event_id)
        if (event && event.id) {
          await this.bookingRepository.update(booking.id, { event_id: event.id });
          booking.event_id = event.id;
        }
      }
    } catch (error) {
      this.logger.error(
        `Failed to create event for booking ${booking.id}: ${error.message}`,
      );
      // We don't throw here to avoid failing the booking creation if event creation fails
      // Ideally, there should be a retry mechanism or background job
    }

    // Try to sync to booker's calendar if they are a registered user
    try {
      const bookerUser = await this.userService.getUserByEmail(dto.booker_email);
      if (bookerUser) {
        const bookerPrimaryCalendar =
          await this.calendarService.getPrimaryCalendar(bookerUser.id);

        if (bookerPrimaryCalendar) {
          const hostUser = await this.userService.getUserById(
            bookingLink.user_id,
          );
          const attendees: EventAttendeeDto[] = [
            {
              email: bookerUser.email,
              name: `${bookerUser.first_name} ${bookerUser.last_name}`.trim(),
              response_status: 'accepted',
              is_organizer: true,
            },
          ];

          if (hostUser && hostUser.email) {
            attendees.push({
              email: hostUser.email,
              name: `${hostUser.first_name} ${hostUser.last_name}`.trim(),
              response_status: 'accepted',
            });
          }

          await this.eventService.createEvent(
            {
              calendar_id: bookerPrimaryCalendar.id,
              title: bookingLink.title,
              description: dto.booker_notes || bookingLink.description,
              start_time: startTime.toISOString(),
              end_time: actualEndTime.toISOString(),
              location: bookingLink.location,
              timezone: booking.timezone,
              attendees: attendees,
              conference_data: bookingLink.location_link
                ? {
                  type: 'custom',
                  url: bookingLink.location_link,
                }
                : undefined,
            },
            bookerUser.id,
          );
          this.logger.log(
            `Synced booking ${booking.id} to booker ${bookerUser.id} calendar`,
          );
        }
      }
    } catch (error) {
      this.logger.warn(
        `Failed to sync booking ${booking.id} to booker calendar: ${error.message}`,
      );
      // Don't fail the booking if syncing to booker fails
    }

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
    // Calculate end time for the actual meeting duration (without buffer)
    const actualNewEndTime = new Date(
      newStartTime.getTime() + bookingLink.duration_minutes * 60 * 1000,
    );
    // Calculate end time including buffer time for storage (to prevent back-to-back bookings)
    const newEndTimeWithBuffer = new Date(
      newStartTime.getTime() + (bookingLink.duration_minutes + (bookingLink.buffer_time_minutes || 0)) * 60 * 1000,
    );

    // Validate using actual meeting time (without buffer), as buffer is just spacing between meetings
    await this.validateBookingTime(bookingLink, newStartTime, actualNewEndTime, id);

    return this.bookingRepository.reschedule(id, newStartTime, newEndTimeWithBuffer);
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
        timezone: dto.timezone,
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
    this.logger.debug(`[validateBookingTime] Starting validation for booking link ${bookingLink.slug}`);
    this.logger.debug(`[validateBookingTime] Start: ${startTime.toISOString()}, End: ${endTime.toISOString()}`);
    this.logger.debug(`[validateBookingTime] Timezone: ${bookingLink.timezone}`);

    // Ensure both times are in UTC for accurate comparison
    const now = new Date();
    const nowUtc = new Date(now.toISOString());
    const startTimeUtc = new Date(startTime.toISOString());

    this.logger.debug(`[validateBookingTime] Now UTC: ${nowUtc.toISOString()}`);

    if (startTimeUtc < nowUtc) {
      this.logger.warn(`[validateBookingTime] FAILED: Past date check - Start ${startTimeUtc.toISOString()} < Now ${nowUtc.toISOString()}`);
      const message = this.messageService.get('booking.past_date');
      throw new BookingPastDateException(message);
    }

    const advanceNoticeMs =
      bookingLink.advance_notice_hours *
      TIME_CONSTANTS.BOOKING.ADVANCE_NOTICE_MULTIPLIER;
    const advanceNoticeDiff = startTimeUtc.getTime() - nowUtc.getTime();
    this.logger.debug(`[validateBookingTime] Advance notice - Required: ${advanceNoticeMs}ms (${bookingLink.advance_notice_hours}h), Actual: ${advanceNoticeDiff}ms`);

    if (advanceNoticeDiff < advanceNoticeMs) {
      this.logger.warn(`[validateBookingTime] FAILED: Advance notice check - ${advanceNoticeDiff}ms < ${advanceNoticeMs}ms`);
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
    const bookingWindowDiff = startTimeUtc.getTime() - nowUtc.getTime();
    this.logger.debug(`[validateBookingTime] Booking window - Max: ${bookingWindowMs}ms (${bookingLink.booking_window_days} days), Actual: ${bookingWindowDiff}ms`);

    if (bookingWindowDiff > bookingWindowMs) {
      this.logger.warn(`[validateBookingTime] FAILED: Booking window check - ${bookingWindowDiff}ms > ${bookingWindowMs}ms`);
      const message = this.messageService.get(
        'booking.outside_window',
        undefined,
        {
          days: bookingLink.booking_window_days.toString(),
        },
      );
      throw new BookingOutsideWindowException(message);
    }

    this.logger.debug(`[validateBookingTime] Checking availability for user ${bookingLink.user_id}`);
    const availabilityCheck = await this.availabilityService.checkAvailability(
      bookingLink.user_id,
      {
        start_datetime: startTime.toISOString(),
        end_datetime: endTime.toISOString(),
      },
    );

    this.logger.debug(`[validateBookingTime] Availability check result: ${JSON.stringify(availabilityCheck)}`);

    if (!availabilityCheck.available) {
      this.logger.warn(`[validateBookingTime] FAILED: Availability check - User not available. Conflicts: ${availabilityCheck.conflicts?.length || 0}`);
      const message = this.messageService.get('booking.time_unavailable');
      throw new BookingTimeUnavailableException(message);
    }

    const bookings = await this.bookingRepository.findByDateRange(
      bookingLink.id,
      startTime,
      endTime,
    );

    this.logger.debug(`[validateBookingTime] Found ${bookings.length} existing bookings in range`);

    const hasConflict = bookings.some((booking) => {
      if (excludeBookingId && booking.id === excludeBookingId) {
        return false;
      }
      const bookingStart = new Date(booking.start_time);
      const bookingEnd = new Date(booking.end_time);
      const conflict = startTime < bookingEnd && endTime > bookingStart;
      if (conflict) {
        this.logger.debug(`[validateBookingTime] Conflict with booking ${booking.id}: ${bookingStart.toISOString()} - ${bookingEnd.toISOString()}`);
      }
      return conflict;
    });

    if (hasConflict) {
      this.logger.warn(`[validateBookingTime] FAILED: Booking conflict detected`);
      const message = this.messageService.get('booking.time_unavailable');
      throw new BookingTimeUnavailableException(message);
    }

    if (bookingLink.max_bookings_per_day) {
      const dayCount = await this.bookingRepository.countByDate(
        bookingLink.id,
        startTime,
      );
      this.logger.debug(`[validateBookingTime] Daily booking count: ${dayCount}/${bookingLink.max_bookings_per_day}`);

      if (dayCount >= bookingLink.max_bookings_per_day) {
        this.logger.warn(`[validateBookingTime] FAILED: Daily limit reached - ${dayCount} >= ${bookingLink.max_bookings_per_day}`);
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

    this.logger.debug(`[validateBookingTime] ✓ All validation checks passed`);
  }

  private generateConfirmationToken(): string {
    // Use cryptographically secure random bytes for token generation
    return randomBytes(32).toString('hex');
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
