'use client';

import { format } from 'date-fns';
import { Clock, MapPin, Users, Video, Bell, Repeat, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface EventPreviewProps {
  event: {
    id: string;
    title: string;
    start: Date;
    end: Date;
    description?: string;
    location?: string;
    attendees?: string[];
    videoLink?: string;
    reminder?: string;
    recurrence?: string;
    color?: string;
  };
}

export function EventPreview({ event }: EventPreviewProps) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    pink: 'bg-pink-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <div className="w-80 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className={`h-2 w-2 rounded-full mt-2 ${colorClasses[event.color || 'blue']}`} />
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
            {format(event.start, 'EEEE, MMMM d, yyyy')}
          </p>
          <p className="text-muted-foreground">
            {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
          </p>
        </div>
      </div>

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

      {event.videoLink && (
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
                  {attendee}
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
        {event.reminder && (
          <div className="flex items-center gap-1">
            <Bell className="h-3 w-3" />
            <span>{event.reminder}</span>
          </div>
        )}
        {event.recurrence && (
          <div className="flex items-center gap-1">
            <Repeat className="h-3 w-3" />
            <span>{event.recurrence}</span>
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
