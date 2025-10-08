import { Injectable, Logger } from '@nestjs/common';
import { AvailabilityRepository } from '../repositories/availability.repository';
import { DatabaseService } from '../../../database/database.service';
import { MessageService } from '../../../common/message/message.service';
import { TIME_CONSTANTS } from '../../../common/constants';
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

    if (startDate >= endDate) {
      const message = this.messageService.get(
        'availability.invalid_date_range',
      );
      throw new InvalidDateRangeException(message);
    }

    const dayOfWeek = startDate.getDay() as DayOfWeek;
    const availabilityRules =
      await this.availabilityRepository.findByUserIdAndDay(userId, dayOfWeek);

    if (availabilityRules.length === 0) {
      return {
        available: false,
        conflicts: [],
      };
    }

    const startTime = this.formatTime(startDate);
    const endTime = this.formatTime(endDate);

    const isWithinAvailability = availabilityRules.some((rule) => {
      return startTime >= rule.start_time && endTime <= rule.end_time;
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
    const startDate = new Date(dto.start_date);
    const endDate = new Date(dto.end_date);
    const durationMinutes = dto.duration_minutes || 30;

    if (startDate >= endDate) {
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
      const message = this.messageService.get(
        'availability.no_rules_found',
        undefined,
        { userId },
      );
      throw new NoAvailabilityFoundException(message);
    }

    const slots: TimeSlot[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay() as DayOfWeek;
      const dayRules = availabilityRules.filter(
        (rule) => rule.day_of_week === dayOfWeek,
      );

      for (const rule of dayRules) {
        const daySlots = await this.generateSlotsForDay(
          currentDate,
          rule,
          durationMinutes,
          userId,
        );
        slots.push(...daySlots);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return slots;
  }

  private async generateSlotsForDay(
    date: Date,
    rule: Availability,
    durationMinutes: number,
    userId: string,
  ): Promise<TimeSlot[]> {
    const slots: TimeSlot[] = [];
    const [startHour, startMinute] = rule.start_time.split(':').map(Number);
    const [endHour, endMinute] = rule.end_time.split(':').map(Number);

    const slotStart = new Date(date);
    slotStart.setHours(startHour, startMinute, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(endHour, endMinute, 0, 0);

    while (slotStart < dayEnd) {
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + durationMinutes);

      if (slotEnd <= dayEnd) {
        const conflicts = await this.getEventConflicts(
          userId,
          slotStart,
          slotEnd,
        );

        slots.push({
          start: new Date(slotStart),
          end: new Date(slotEnd),
          available: conflicts.length === 0,
        });
      }

      slotStart.setMinutes(slotStart.getMinutes() + durationMinutes);
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
