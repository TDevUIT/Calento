import { Injectable } from '@nestjs/common';
import { z, ZodObject, ZodRawShape } from 'zod';
import { BaseTool } from './base-tool';
import { AgentContext } from '../agents/base/agent.interface';
import { EventService } from '../../event/event.service';
import { CalendarService } from '../../calendar/calendar.service';
import { FUNCTION_DESCRIPTIONS } from '../prompts/function-prompts';

@Injectable()
export class CreateEventTool extends BaseTool {
  constructor(
    private readonly eventService: EventService,
    private readonly calendarService: CalendarService
  ) {
    const funcDef = FUNCTION_DESCRIPTIONS.CREATE_EVENT;
    super(funcDef.name, funcDef.description, funcDef.category as 'calendar', funcDef.parameters);
  }

  getZodSchema(): ZodObject<ZodRawShape> {
    return z.object({
      title: z.string().describe('Event title'),
      start_time: z.string().describe('Start time in ISO format'),
      end_time: z.string().describe('End time in ISO format'),
      description: z.string().optional().describe('Event description'),
      location: z.string().optional().describe('Event location'),
      timezone: z.string().optional().describe('Timezone'),
      attendees: z.array(z.string()).optional().describe('List of attendee emails'),
    });
  }

  protected async run(args: any, context: AgentContext): Promise<any> {
    const primaryCalendar = await this.calendarService.getPrimaryCalendar(context.userId);
    if (!primaryCalendar) {
      throw new Error('You do not have a calendar yet. Please connect Google Calendar first.');
    }

    const event = await this.eventService.createEvent(
      {
        calendar_id: primaryCalendar.id,
        title: args.title,
        start_time: args.start_time,
        end_time: args.end_time,
        description: args.description,
        location: args.location,
        timezone: args.timezone,
        attendees: args.attendees?.map((email: string) => ({
          email,
          response_status: 'needsAction',
        })),
      },
      context.userId
    );

    return {
      event_id: event.id,
      title: event.title,
      start_time: event.start_time,
      end_time: event.end_time,
      message: `Created event "${event.title}"`,
    };
  }
}

/**
 * Check Availability Tool
 */
@Injectable()
export class CheckAvailabilityTool extends BaseTool {
  constructor(private readonly eventService: EventService) {
    const funcDef = FUNCTION_DESCRIPTIONS.CHECK_AVAILABILITY;
    super(funcDef.name, funcDef.description, funcDef.category as 'calendar', funcDef.parameters);
  }

  getZodSchema(): ZodObject<ZodRawShape> {
    return z.object({
      start_date: z.string().describe('Start date in ISO format'),
      end_date: z.string().describe('End date in ISO format'),
      duration_minutes: z.number().optional().describe('Duration in minutes'),
    });
  }

  protected async run(args: any, context: AgentContext): Promise<any> {
    const startDate = new Date(args.start_date);
    const endDate = new Date(args.end_date);
    const durationMinutes = args.duration_minutes || 60;

    const eventsResult = await this.eventService.getEventsByDateRange(
      context.userId,
      startDate,
      endDate,
      { page: 1, limit: 1000 }
    );

    const events = eventsResult.data;
    const freeSlots = this.calculateFreeSlots(events, startDate, endDate, durationMinutes);

    return {
      total_events: events.length,
      free_slots_count: freeSlots.length,
      free_slots: freeSlots.slice(0, 10),
      message: `Found ${freeSlots.length} free time slot(s)`,
    };
  }

  private calculateFreeSlots(
    events: any[],
    startDate: Date,
    endDate: Date,
    durationMinutes: number
  ) {
    const freeSlots: Array<{ start: Date; end: Date }> = [];
    const workStart = 9;
    const workEnd = 18;

    const sortedEvents = events.sort(
      (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      const dayStart = new Date(currentDate);
      dayStart.setHours(workStart, 0, 0, 0);

      const dayEnd = new Date(currentDate);
      dayEnd.setHours(workEnd, 0, 0, 0);

      let currentTime = new Date(dayStart);

      while (currentTime.getTime() + durationMinutes * 60000 <= dayEnd.getTime()) {
        const slotEnd = new Date(currentTime.getTime() + durationMinutes * 60000);

        const hasConflict = sortedEvents.some((event) => {
          const eventStart = new Date(event.start_time);
          const eventEnd = new Date(event.end_time);
          return (
            (currentTime >= eventStart && currentTime < eventEnd) ||
            (slotEnd > eventStart && slotEnd <= eventEnd) ||
            (currentTime <= eventStart && slotEnd >= eventEnd)
          );
        });

        if (!hasConflict) {
          freeSlots.push({
            start: new Date(currentTime),
            end: new Date(slotEnd),
          });
        }

        currentTime.setMinutes(currentTime.getMinutes() + 30);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return freeSlots;
  }
}


@Injectable()
export class SearchEventsTool extends BaseTool {
  constructor(private readonly eventService: EventService) {
    const funcDef = FUNCTION_DESCRIPTIONS.SEARCH_EVENTS;
    super(funcDef.name, funcDef.description, funcDef.category as 'calendar', funcDef.parameters);
  }

  private inferDateRangeFromQuery(query: string): { start: Date; end: Date } | null {
    const match = query.match(/\b(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{2,4}))?\b/);
    if (!match) return null;

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    if (!Number.isFinite(day) || !Number.isFinite(month)) return null;
    if (day < 1 || day > 31 || month < 1 || month > 12) return null;

    const now = new Date();
    let year = now.getFullYear();
    if (match[3]) {
      const yRaw = parseInt(match[3], 10);
      if (!Number.isFinite(yRaw)) return null;
      year = yRaw < 100 ? 2000 + yRaw : yRaw;
    }

    const start = new Date(year, month - 1, day, 0, 0, 0, 0);
    const end = new Date(year, month - 1, day, 23, 59, 59, 999);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
    return { start, end };
  }

  getZodSchema(): ZodObject<ZodRawShape> {
    return z.object({
      query: z.string().describe('Search query'),
      start_date: z.string().optional().describe('Start date filter'),
      end_date: z.string().optional().describe('End date filter'),
    });
  }

  protected async run(args: any, context: AgentContext): Promise<any> {
    const query = String(args.query ?? '').trim();
    if (!query) {
      throw new Error('Missing required parameter: query');
    }

    const options = { page: 1, limit: 20 };

    const startDate = args.start_date ? new Date(args.start_date) : undefined;
    const endDate = args.end_date ? new Date(args.end_date) : undefined;

    const inferred = !startDate && !endDate ? this.inferDateRangeFromQuery(query) : null;

    const eventsResult = (startDate && endDate)
      ? await this.eventService.searchEventsByDateRange(context.userId, startDate, endDate, query, options)
      : inferred
        ? await this.eventService.searchEventsByDateRange(context.userId, inferred.start, inferred.end, query, options)
        : await this.eventService.searchEvents(context.userId, query, options);

    return {
      total_found: eventsResult.data.length,
      events: eventsResult.data.map((e) => ({
        id: e.id,
        title: e.title,
        start_time: e.start_time,
        end_time: e.end_time,
        location: e.location,
      })),
      message: `Found ${eventsResult.data.length} event(s)`,
    };
  }
}

/**
 * Update Event Tool
 */
@Injectable()
export class UpdateEventTool extends BaseTool {
  constructor(private readonly eventService: EventService) {
    const funcDef = FUNCTION_DESCRIPTIONS.UPDATE_EVENT;
    super(funcDef.name, funcDef.description, funcDef.category as 'calendar', funcDef.parameters);
  }

  getZodSchema(): ZodObject<ZodRawShape> {
    return z.object({
      event_id: z.string().describe('Event ID to update'),
      updates: z.object({
        title: z.string().optional(),
        start_time: z.string().optional(),
        end_time: z.string().optional(),
        description: z.string().optional(),
        note: z.string().optional().describe('Alias for description'),
        location: z.string().optional(),
        timezone: z.string().optional(),
        attendees: z.array(z.string()).optional().describe('List of attendee emails'),
      }).describe('Fields to update'),
    });
  }

  protected async run(args: any, context: AgentContext): Promise<any> {
    const updates = { ...(args.updates || {}) };

    if (updates.note !== undefined && updates.description === undefined) {
      updates.description = updates.note;
    }

    if (Array.isArray(updates.attendees)) {
      updates.attendees = updates.attendees.map((email: string) => ({
        email,
        response_status: 'needsAction',
      }));
    }

    const event = await this.eventService.updateEvent(
      args.event_id,
      updates,
      context.userId
    );

    return {
      event_id: event.id,
      title: event.title,
      message: `Updated event "${event.title}"`,
    };
  }
}

@Injectable()
export class DeleteEventTool extends BaseTool {
  constructor(private readonly eventService: EventService) {
    const funcDef = FUNCTION_DESCRIPTIONS.DELETE_EVENT;
    super(funcDef.name, funcDef.description, funcDef.category as 'calendar', funcDef.parameters);
  }

  getZodSchema(): ZodObject<ZodRawShape> {
    return z.object({
      event_id: z.string().describe('Event ID to delete'),
    });
  }

  protected async run(args: any, context: AgentContext): Promise<any> {
    await this.eventService.deleteEvent(args.event_id, context.userId);

    return {
      event_id: args.event_id,
      message: `Deleted event`,
    };
  }
}
