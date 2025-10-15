import { CreateEventDto } from '../dto/events.dto';
import { Event } from '../event';
import { GoogleEventInput } from '../../google/types/google-calendar.types';

export class EventMappers {
  static googleEventToDto(googleEvent: any, calendarId: string): CreateEventDto {
    return {
      calendar_id: calendarId,
      title: googleEvent.summary || 'Untitled Event',
      description: googleEvent.description ?? undefined,
      start_time:
        googleEvent.start.dateTime || googleEvent.start.date || new Date(),
      end_time: googleEvent.end.dateTime || googleEvent.end.date || new Date(),
      location: googleEvent.location ?? undefined,
      is_all_day: false,
      recurrence_rule: googleEvent.recurrence?.[0] ?? undefined,
    };
  }

  static calentoEventToGoogleInput(
    event: Event | CreateEventDto,
  ): GoogleEventInput {
    const title = 'title' in event ? event.title : (event as any).title;
    const description = event.description;
    const conferenceData = (event as any).conference_data;

    // Build enhanced description with source attribution
    let enhancedDescription = description || '';
    if (enhancedDescription) {
      enhancedDescription += '\n\n';
    }
    enhancedDescription += '━━━━━━━━━━━━━━━━━━━━\n';
    enhancedDescription += '📅 Created with Tempra\n';
    enhancedDescription += 'View source: https://tempra.app\n';

    // Add Google Meet info if exists
    if (conferenceData?.url) {
      enhancedDescription += '\n🎥 Video Conference:\n';
      enhancedDescription += `${conferenceData.url}\n`;
    }

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
      source: {
        title: 'Tempra',
        url: 'https://tempra.app',
      },
    };

    // If there's existing conference data from Tempra, include it
    if (conferenceData?.url) {
      // Don't create new conference, just preserve the URL in description
      // Google Calendar will show the URL as clickable link
      googleEvent.hangoutLink = conferenceData.url;
    }

    return googleEvent;
  }

  static isValidGoogleEvent(googleEvent: any): boolean {
    return !!(googleEvent.start?.dateTime && googleEvent.end?.dateTime);
  }

  static nullToUndefined<T>(value: T | null): T | undefined {
    return value === null ? undefined : value;
  }
}
