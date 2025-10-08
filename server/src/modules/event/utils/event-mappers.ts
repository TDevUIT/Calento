import { CreateEventDto } from '../dto/events.dto';
import { Event } from '../event';
import { GoogleEventInput } from '../../google/types/google-calendar.types';

export class EventMappers {
  static googleEventToDto(googleEvent: any): CreateEventDto {
    return {
      title: googleEvent.summary || 'Untitled Event',
      description: googleEvent.description ?? undefined,
      start_time: new Date(googleEvent.start.dateTime).toISOString(),
      end_time: new Date(googleEvent.end.dateTime).toISOString(),
      location: googleEvent.location ?? undefined,
      is_all_day: false,
      recurrence_rule: googleEvent.recurrence?.[0] ?? undefined,
    };
  }

  static tempraEventToGoogleInput(
    event: Event | CreateEventDto,
  ): GoogleEventInput {
    return {
      summary: 'title' in event ? event.title : (event as any).title,
      description: event.description,
      start:
        'start_time' in event
          ? new Date(event.start_time)
          : (event as any).start_time,
      end:
        'end_time' in event
          ? new Date(event.end_time)
          : (event as any).end_time,
      location: event.location,
    };
  }

  static isValidGoogleEvent(googleEvent: any): boolean {
    return !!(googleEvent.start?.dateTime && googleEvent.end?.dateTime);
  }

  static nullToUndefined<T>(value: T | null): T | undefined {
    return value === null ? undefined : value;
  }
}
