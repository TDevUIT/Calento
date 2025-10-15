'use client';

import { format } from 'date-fns';
import { Clock, MapPin, Users, Video, Bell, Repeat, ExternalLink, User } from 'lucide-react';
import { useCalendarSettings } from '../shared/CalendarSettingsProvider';
import { formatTimeWithSettings, formatDateWithSettings } from '@/utils/calendar-format';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Event } from '@/interface/event.interface';
interface EventPreviewProps {
  event: Event;
}

export function EventPreview({ event }: EventPreviewProps) {
  const { timeFormat, dateFormat } = useCalendarSettings();
  
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    pink: 'bg-pink-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  const startDate = typeof event.start_time === 'string' ? new Date(event.start_time) : event.start_time;
  const endDate = typeof event.end_time === 'string' ? new Date(event.end_time) : event.end_time;

  return (
    <div className="w-80 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base leading-tight truncate">
            {event.title}
          </h3>
        </div>
      </div>

      <div className="flex items-start gap-2 text-sm">
        <Clock className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
        <div>
          <p className="font-medium">
            {formatDateWithSettings(startDate, dateFormat)}
          </p>
          <p className="text-muted-foreground">
            {event.is_all_day ? 'Cả ngày' : `${formatTimeWithSettings(startDate, timeFormat)} - ${formatTimeWithSettings(endDate, timeFormat)}`}
          </p>
        </div>
      </div>

      {event.creator && (
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Avatar className="h-6 w-6">
              <AvatarImage src={event.creator.avatar} alt={event.creator.name || 'Creator'} />
              <AvatarFallback className="text-xs">
                {event.creator.name ? event.creator.name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium">
                {event.creator.name || 'Unknown'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                Người tổ chức
              </p>
            </div>
          </div>
        </div>
      )}

      {event.description && (
        <>
          <Separator />
          <p className="text-sm text-muted-foreground line-clamp-3">
            {event.description}
          </p>
        </>
      )}

      {event.location && (
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="truncate">{event.location}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      )}

      {event.conference_data && (
        <div className="flex items-center gap-2">
          <Video className="h-4 w-4 text-muted-foreground" />
          <Button variant="link" className="h-auto p-0 text-sm text-primary">
            Join Meeting
          </Button>
        </div>
      )}

      {event.attendees && event.attendees.length > 0 && (
        <div className="flex items-start gap-2 text-sm">
          <Users className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1">
              {event.attendees.slice(0, 3).map((attendee, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {attendee.name || attendee.email}
                </Badge>
              ))}
              {event.attendees.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{event.attendees.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {event.reminders && event.reminders.length > 0 && (
          <div className="flex items-center gap-1">
            <Bell className="h-3 w-3" />
            <span>{event.reminders[0].minutes} min before</span>
          </div>
        )}
        {event.recurrence_rule && (
          <div className="flex items-center gap-1">
            <Repeat className="h-3 w-3" />
            <span>Recurring</span>
          </div>
        )}
      </div>

      <Separator />
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          Edit
        </Button>
        <Button size="sm" className="flex-1">
          Open
        </Button>
      </div>
    </div>
  );
}
