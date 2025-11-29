import { CreateEventDto } from '../dto/events.dto';
import { Event } from '../event';
import { GoogleEventInput } from '../../google/types/google-calendar.types';

export class EventMappers {
  static googleEventToDto(googleEvent: any, calendarId: string): CreateEventDto {
    const isAllDay = !!googleEvent.start.date && !googleEvent.start.dateTime;

    let startTime: string;
    let endTime: string;

    if (isAllDay) {
      startTime = googleEvent.start.date;
      endTime = googleEvent.end.date;
    } else {
      startTime = googleEvent.start.dateTime || googleEvent.start.date || new Date().toISOString();
      endTime = googleEvent.end.dateTime || googleEvent.end.date || new Date().toISOString();
    }

    return {
      calendar_id: calendarId,
      title: googleEvent.summary || 'Untitled Event',
      description: googleEvent.description ?? undefined,
      start_time: startTime,
      end_time: endTime,
      location: googleEvent.location ?? undefined,
      timezone: googleEvent.start?.timeZone ?? googleEvent.end?.timeZone ?? undefined,
      is_all_day: isAllDay,
      recurrence_rule: googleEvent.recurrence?.[0] ?? undefined,
    };
  }

  static calentoEventToGoogleInput(
    event: Event | CreateEventDto,
  ): GoogleEventInput {
    const title = 'title' in event ? event.title : (event as any).title;
    const description = event.description;
    const conferenceData = (event as any).conference_data;

    let enhancedDescription = description || '';
    if (enhancedDescription) {
      enhancedDescription += '\n\n';
    }
    enhancedDescription += '────────────────────\n';
    enhancedDescription += '📅 Created with Calento\n';
    enhancedDescription += 'View source: https://calento.space\n';

    if (conferenceData?.url) {
      enhancedDescription += '\n🎥 Video Conference:\n';
      enhancedDescription += `${conferenceData.url}\n`;
    }

    const isAllDay = 'is_all_day' in event ? event.is_all_day : false;

    const googleEvent: GoogleEventInput = {
      summary: title,
      description: enhancedDescription,
      start:
        'start_time' in event
          ? new Date(event.start_time)
          : (event as any).start_time,
      end:
        'end_time' in event
          ? new Date(event.end_time)
          : (event as any).end_time,
      location: event.location,
      is_all_day: isAllDay,
      source: {
        title: 'Calento',
        url: 'https://calento.space',
      },
    };

    if (conferenceData?.url) {
      googleEvent.hangoutLink = conferenceData.url;
    }

    return googleEvent;
  }

  static isValidGoogleEvent(googleEvent: any): boolean {
    const hasDateTime = !!(googleEvent.start?.dateTime && googleEvent.end?.dateTime);
    const hasDate = !!(googleEvent.start?.date && googleEvent.end?.date);
    return hasDateTime || hasDate;
  }

  static nullToUndefined<T>(value: T | null): T | undefined {
    return value === null ? undefined : value;
  }
}
