import { Injectable, Logger } from '@nestjs/common';
import { AvailabilityRepository } from '../repositories/availability.repository';
import { DatabaseService } from '../../../database/database.service';
import { MessageService } from '../../../common/message/message.service';
import { TIME_CONSTANTS } from '../../../common/constants';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import {
  Availability,
  DayOfWeek,
  TimeSlot,
  AvailabilityCheck,
} from '../interfaces/availability.interface';
import {
  CreateAvailabilityDto,
  UpdateAvailabilityDto,
  CheckAvailabilityDto,
  GetAvailableSlotsDto,
} from '../dto/availability.dto';
import {
  AvailabilityNotFoundException,
  InvalidTimeRangeException,
  OverlappingAvailabilityException,
  InvalidDateRangeException,
  NoAvailabilityFoundException,
} from '../exceptions/availability.exceptions';

@Injectable()
export class AvailabilityService {
  private readonly logger = new Logger(AvailabilityService.name);

  constructor(
    private readonly availabilityRepository: AvailabilityRepository,
    private readonly databaseService: DatabaseService,
    private readonly messageService: MessageService,
  ) {}

  async create(
    userId: string,
    dto: CreateAvailabilityDto,
  ): Promise<Availability> {
    this.validateTimeRange(dto.start_time, dto.end_time);

    const hasOverlap = await this.availabilityRepository.checkOverlap(
      userId,
      dto.day_of_week,
      dto.start_time,
      dto.end_time,
    );

    if (hasOverlap) {
      const message = this.messageService.get(
        'availability.overlapping',
        undefined,
        {
          dayOfWeek: dto.day_of_week.toString(),
        },
      );
      throw new OverlappingAvailabilityException(message);
    }

    return this.availabilityRepository.create({
      user_id: userId,
      ...dto,
      is_active: dto.is_active !== undefined ? dto.is_active : true,
    });
  }

  async bulkCreate(
    userId: string,
    availabilities: CreateAvailabilityDto[],
  ): Promise<Availability[]> {
    for (const dto of availabilities) {
      this.validateTimeRange(dto.start_time, dto.end_time);
    }

    const data = availabilities.map((dto) => ({
      user_id: userId,
      ...dto,
      is_active: dto.is_active !== undefined ? dto.is_active : true,
    }));

    return this.availabilityRepository.bulkCreate(data);
  }

  async findAll(userId: string): Promise<Availability[]> {
    return this.availabilityRepository.findByUserId(userId);
  }

  async findActive(userId: string): Promise<Availability[]> {
    return this.availabilityRepository.findActiveByUserId(userId);
  }

  async findById(id: string, userId: string): Promise<Availability> {
    const availability = await this.availabilityRepository.findById(id);

    if (!availability || availability.user_id !== userId) {
      const message = this.messageService.get(
        'availability.not_found',
        undefined,
        { id },
      );
      throw new AvailabilityNotFoundException(message);
    }

    return availability;
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateAvailabilityDto,
  ): Promise<Availability> {
    const existing = await this.findById(id, userId);

    if (dto.start_time || dto.end_time) {
      const startTime = dto.start_time || existing.start_time;
      const endTime = dto.end_time || existing.end_time;
      this.validateTimeRange(startTime, endTime);

      const dayOfWeek =
        dto.day_of_week !== undefined ? dto.day_of_week : existing.day_of_week;

      const hasOverlap = await this.availabilityRepository.checkOverlap(
        userId,
        dayOfWeek,
        startTime,
        endTime,
        id,
      );

      if (hasOverlap) {
        const message = this.messageService.get(
          'availability.overlapping',
          undefined,
          {
            dayOfWeek: dayOfWeek.toString(),
          },
        );
        throw new OverlappingAvailabilityException(message);
      }
    }

    return this.availabilityRepository.update(id, dto);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.findById(id, userId);
    await this.availabilityRepository.delete(id);
  }

  async deleteAll(userId: string): Promise<number> {
    return this.availabilityRepository.deleteByUserId(userId);
  }

  async checkAvailability(
    userId: string,
    dto: CheckAvailabilityDto,
  ): Promise<AvailabilityCheck> {
    const startDate = new Date(dto.start_datetime);
    const endDate = new Date(dto.end_datetime);

    if (startDate > endDate) {
      const message = this.messageService.get(
        'availability.invalid_date_range',
      );
      throw new InvalidDateRangeException(message);
    }

    const allActiveRules = await this.availabilityRepository.findActiveByUserId(
      userId,
    );

    if (allActiveRules.length === 0) {
      return {
        available: false,
        conflicts: [],
      };
    }

    const timezone = allActiveRules[0].timezone || 'UTC';
    const startInTz = toZonedTime(startDate, timezone);
    const endInTz = toZonedTime(endDate, timezone);

    const dayOfWeek = startInTz.getDay() as DayOfWeek;
    const dayRules = allActiveRules.filter(
      (rule) => rule.day_of_week === dayOfWeek,
    );

    if (dayRules.length === 0) {
      return {
        available: false,
        conflicts: [],
      };
    }

    const startTime = this.formatTime(startInTz);
    const endTime = this.formatTime(endInTz);

    const isWithinAvailability = dayRules.some((rule) => {
      const ruleStart = rule.start_time.length >= 5 ? rule.start_time.slice(0, 5) : rule.start_time;
      const ruleEnd = rule.end_time.length >= 5 ? rule.end_time.slice(0, 5) : rule.end_time;
      return startTime >= ruleStart && endTime <= ruleEnd;
    });

    if (!isWithinAvailability) {
      return {
        available: false,
        conflicts: [],
      };
    }

    const conflicts = await this.getEventConflicts(userId, startDate, endDate);

    return {
      available: conflicts.length === 0,
      conflicts,
      suggestions:
        conflicts.length > 0
          ? await this.suggestAlternativeTimes(userId, startDate, endDate)
          : undefined,
    };
  }

  async getAvailableSlots(
    userId: string,
    dto: GetAvailableSlotsDto,
  ): Promise<TimeSlot[]> {
    const timezone = dto.timezone || 'UTC';
    this.logger.log(`Generating slots for user ${userId} in timezone: ${timezone}`);
    
    const startDateStr = `${dto.start_date}T00:00:00`;
    // Create dates in user's timezone, then convert to UTC for processing
    const startDateInTz = new Date(startDateStr);
    const endDateInTz = new Date(`${dto.end_date}T23:59:59`);
    
    const startDate = fromZonedTime(startDateInTz, timezone);
    const endDate = fromZonedTime(endDateInTz, timezone);
    
    const durationMinutes = dto.duration_minutes || 30;
    
    this.logger.log(`Date range in ${timezone}: ${startDateStr} to ${dto.end_date}`);
    this.logger.log(`Date range in UTC: ${startDate.toISOString()} to ${endDate.toISOString()}`);

    if (startDate > endDate) {
      const message = this.messageService.get(
        'availability.invalid_date_range',
      );
      throw new InvalidDateRangeException(message);
    }

    const daysDiff = Math.ceil(
      (endDate.getTime() - startDate.getTime()) /
        TIME_CONSTANTS.BOOKING.MILLISECONDS_PER_DAY,
    );
    if (daysDiff > TIME_CONSTANTS.BOOKING.MAX_DATE_RANGE_DAYS) {
      const message = this.messageService.get(
        'availability.invalid_date_range',
      );
      throw new InvalidDateRangeException(message);
    }

    const availabilityRules =
      await this.availabilityRepository.findActiveByUserId(userId);

    if (availabilityRules.length === 0) {
      this.logger.log(
        `No availability rules found for user ${userId}. Returning empty slots (availability not configured).`,
      );
      return [];
    }

    const slots: TimeSlot[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay() as DayOfWeek;
      const dayRules = availabilityRules.filter(
        (rule) => rule.day_of_week === dayOfWeek,
      );

      for (const rule of dayRules) {
        // Convert currentDate to user's timezone for slot generation
        const currentDateInTz = toZonedTime(currentDate, timezone);
        
        const daySlots = await this.generateSlotsForDay(
          currentDateInTz,
          rule,
          durationMinutes,
          userId,
          timezone,
        );
        slots.push(...daySlots);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return slots;
  }

  /**
   * Creates default availability rules for a user (Monday-Friday, 9 AM - 5 PM)
   */
  async createDefaultAvailabilityRules(
    userId: string,
    timezone: string = 'UTC',
  ): Promise<void> {
    const defaultRules = [
      { day_of_week: 1, start_time: '09:00:00', end_time: '17:00:00' }, // Monday
      { day_of_week: 2, start_time: '09:00:00', end_time: '17:00:00' }, // Tuesday
      { day_of_week: 3, start_time: '09:00:00', end_time: '17:00:00' }, // Wednesday
      { day_of_week: 4, start_time: '09:00:00', end_time: '17:00:00' }, // Thursday
      { day_of_week: 5, start_time: '09:00:00', end_time: '17:00:00' }, // Friday
    ];

    try {
      for (const rule of defaultRules) {
        await this.availabilityRepository.create({
          user_id: userId,
          day_of_week: rule.day_of_week as DayOfWeek,
          start_time: rule.start_time,
          end_time: rule.end_time,
          timezone: timezone, // Use provided timezone
          is_active: true,
        });
      }
      this.logger.log(`Created default availability rules for user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to create default availability rules for user ${userId}:`, error);
      throw error;
    }
  }

  private async generateSlotsForDay(
    date: Date,
    rule: Availability,
    durationMinutes: number,
    userId: string,
    timezone: string = 'UTC',
  ): Promise<TimeSlot[]> {
    const slots: TimeSlot[] = [];
    
    // Parse availability rule times
    const [startHour, startMinute] = rule.start_time.split(':').map(Number);
    const [endHour, endMinute] = rule.end_time.split(':').map(Number);

    // Create slot times in the user's timezone
    const slotStartInTz = new Date(date);
    slotStartInTz.setHours(startHour, startMinute, 0, 0);

    const dayEndInTz = new Date(date);
    dayEndInTz.setHours(endHour, endMinute, 0, 0);

    // Convert to UTC for database comparison
    let currentSlotUtc = fromZonedTime(slotStartInTz, timezone);
    const dayEndUtc = fromZonedTime(dayEndInTz, timezone);

    while (currentSlotUtc < dayEndUtc) {
      const slotEndUtc = new Date(currentSlotUtc);
      slotEndUtc.setMinutes(slotEndUtc.getMinutes() + durationMinutes);

      if (slotEndUtc <= dayEndUtc) {
        // Check conflicts in UTC (events are stored in UTC)
        const conflicts = await this.getEventConflicts(
          userId,
          currentSlotUtc,
          slotEndUtc,
        );

        // Store slots in UTC (ISO format)
        slots.push({
          start_time: currentSlotUtc.toISOString(),
          end_time: slotEndUtc.toISOString(),
          available: conflicts.length === 0,
        });
      }

      // Move to next slot
      currentSlotUtc = new Date(currentSlotUtc);
      currentSlotUtc.setMinutes(currentSlotUtc.getMinutes() + durationMinutes);
    }

    return slots;
  }

  private async getEventConflicts(
    userId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<AvailabilityCheck['conflicts']> {
    const query = `
      SELECT e.id as event_id, e.title, e.start_time, e.end_time
      FROM events e
      JOIN calendars c ON e.calendar_id = c.id
      WHERE c.user_id = $1
        AND e.status != 'cancelled'
        AND (
          (e.start_time < $3 AND e.end_time > $2)
        )
      ORDER BY e.start_time ASC
    `;

    const result = await this.databaseService.query(query, [
      userId,
      startTime.toISOString(),
      endTime.toISOString(),
    ]);

    return result.rows.map((row) => ({
      event_id: row.event_id,
      title: row.title,
      start_time: row.start_time,
      end_time: row.end_time,
    }));
  }

  private async suggestAlternativeTimes(
    userId: string,
    originalStart: Date,
    originalEnd: Date,
  ): Promise<Date[]> {
    const duration = originalEnd.getTime() - originalStart.getTime();
    const suggestions: Date[] = [];
    const dayOfWeek = originalStart.getDay() as DayOfWeek;

    const availabilityRules =
      await this.availabilityRepository.findByUserIdAndDay(userId, dayOfWeek);

    for (const rule of availabilityRules) {
      const [hour, minute] = rule.start_time.split(':').map(Number);
      const candidate = new Date(originalStart);
      candidate.setHours(hour, minute, 0, 0);

      const candidateEnd = new Date(candidate.getTime() + duration);
      const conflicts = await this.getEventConflicts(
        userId,
        candidate,
        candidateEnd,
      );

      if (conflicts.length === 0) {
        suggestions.push(candidate);
        if (suggestions.length >= 3) break;
      }
    }

    return suggestions;
  }

  private validateTimeRange(startTime: string, endTime: string): void {
    if (startTime >= endTime) {
      const message = this.messageService.get(
        'availability.invalid_time_range',
        undefined,
        {
          startTime,
          endTime,
        },
      );
      throw new InvalidTimeRangeException(message);
    }
  }

  private formatTime(date: Date): string {
    return date.toTimeString().split(' ')[0];
  }

  async getWeeklySchedule(
    userId: string,
  ): Promise<{ [key: number]: Availability[] }> {
    const availabilities =
      await this.availabilityRepository.findActiveByUserId(userId);

    const schedule: { [key: number]: Availability[] } = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
    };

    availabilities.forEach((availability) => {
      schedule[availability.day_of_week].push(availability);
    });

    return schedule;
  }

  async hasAvailability(userId: string): Promise<boolean> {
    const count = await this.availabilityRepository.countByUserId(userId);
    return count > 0;
  }
}
