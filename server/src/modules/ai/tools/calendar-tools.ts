import { Injectable } from '@nestjs/common';
import { BaseTool } from './base-tool';
import { AgentContext } from '../agents/base/agent.interface';
import { EventService } from '../../event/event.service';
import { CalendarService } from '../../calendar/calendar.service';
import { FUNCTION_DESCRIPTIONS } from '../prompts/function-prompts';

/**
 * Create Event Tool
 */
@Injectable()
export class CreateEventTool extends BaseTool {
  constructor(
    private readonly eventService: EventService,
    private readonly calendarService: CalendarService
  ) {
    const funcDef = FUNCTION_DESCRIPTIONS.CREATE_EVENT;
    super(funcDef.name, funcDef.description, funcDef.category as 'calendar', funcDef.parameters);
  }

  protected async run(args: any, context: AgentContext): Promise<any> {
    // Get primary calendar
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

/**
 * Search Events Tool
 */
@Injectable()
export class SearchEventsTool extends BaseTool {
  constructor(private readonly eventService: EventService) {
    const funcDef = FUNCTION_DESCRIPTIONS.SEARCH_EVENTS;
    super(funcDef.name, funcDef.description, funcDef.category as 'calendar', funcDef.parameters);
  }

  protected async run(args: any, context: AgentContext): Promise<any> {
    const params: any = { query: args.query };

    if (args.start_date) params.start_date = new Date(args.start_date);
    if (args.end_date) params.end_date = new Date(args.end_date);

    const eventsResult = await this.eventService.searchEvents(context.userId, params, {
      page: 1,
      limit: 20,
    });

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

  protected async run(args: any, context: AgentContext): Promise<any> {
    const event = await this.eventService.updateEvent(
      args.event_id,
      args.updates,
      context.userId
    );

    return {
      event_id: event.id,
      title: event.title,
      message: `Updated event "${event.title}"`,
    };
  }
}

/**
 * Delete Event Tool
 */
@Injectable()
export class DeleteEventTool extends BaseTool {
  constructor(private readonly eventService: EventService) {
    const funcDef = FUNCTION_DESCRIPTIONS.DELETE_EVENT;
    super(funcDef.name, funcDef.description, funcDef.category as 'calendar', funcDef.parameters);
  }

  protected async run(args: any, context: AgentContext): Promise<any> {
    await this.eventService.deleteEvent(args.event_id, context.userId);

    return {
      event_id: args.event_id,
      message: `Deleted event`,
    };
  }
}
