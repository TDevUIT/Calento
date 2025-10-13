'use client';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  Clock, 
  MapPin, 
  Video,
  Users,
  Bell,
  Repeat,
  Eye,
  EyeOff,
  Lock,
  User as UserIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Event } from '@/interface/event.interface';

interface EventQuickPreviewProps {
  event: Event;
}

export function EventQuickPreview({ event }: EventQuickPreviewProps) {
  const startDate = new Date(event.start_time);
  const endDate = new Date(event.end_time);

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    pink: 'bg-pink-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  };

  const conferenceIcons = {
    google_meet: { name: 'Google Meet', color: 'text-blue-500' },
    zoom: { name: 'Zoom', color: 'text-sky-500' },
    ms_teams: { name: 'MS Teams', color: 'text-purple-500' },
    custom: { name: 'Video Call', color: 'text-gray-500' },
  };

  const visibilityIcons = {
    public: { icon: <Eye className="h-3 w-3" />, label: 'Public' },
    private: { icon: <EyeOff className="h-3 w-3" />, label: 'Private' },
    confidential: { icon: <Lock className="h-3 w-3" />, label: 'Confidential' },
  };

  const formatTimeRange = () => {
    if (event.is_all_day) {
      return 'Cả ngày';
    }
    const startTime = format(startDate, 'HH:mm');
    const endTime = format(endDate, 'HH:mm');
    return `${startTime} - ${endTime}`;
  };

  const acceptedCount = event.attendees?.filter(a => a.response_status === 'accepted').length || 0;
  const totalAttendees = event.attendees?.length || 0;

  return (
    <div className="w-80 bg-background border rounded-lg shadow-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${colorClasses[event.color || 'blue']}`} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base leading-tight line-clamp-2">
            {event.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {format(startDate, 'EEEE, d MMMM', { locale: vi })}
          </p>
        </div>
        {event.visibility && event.visibility !== 'default' && (
          <Badge variant="outline" className="flex-shrink-0 text-xs px-1.5 py-0.5">
            {visibilityIcons[event.visibility as keyof typeof visibilityIcons]?.icon}
          </Badge>
        )}
      </div>

      {/* Quick Info Grid */}
      <div className="space-y-2">
        {/* Time */}
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span>{formatTimeRange()}</span>
          {event.recurrence_rule && (
            <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0">
              <Repeat className="h-3 w-3 mr-1" />
              Lặp lại
            </Badge>
          )}
        </div>

        {/* Conference */}
        {event.conference_data && (
          <div className="flex items-center gap-2 text-sm">
            <Video className={`h-4 w-4 flex-shrink-0 ${conferenceIcons[event.conference_data.type]?.color || 'text-gray-500'}`} />
            <span className="font-medium">
              {conferenceIcons[event.conference_data.type]?.name || 'Video Conference'}
            </span>
            <Badge variant="outline" className="ml-auto text-xs px-1.5 py-0">
              Có link
            </Badge>
          </div>
        )}

        {/* Location (physical) */}
        {event.location && !event.conference_data && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        )}

        {/* Organizer */}
        {event.organizer_name && (
          <div className="flex items-center gap-2 text-sm">
            <UserIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{event.organizer_name}</span>
          </div>
        )}

        {/* Attendees */}
        {event.attendees && event.attendees.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span>{totalAttendees} người tham gia</span>
            <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0">
              {acceptedCount} chấp nhận
            </Badge>
          </div>
        )}

        {/* Reminders */}
        {event.reminders && event.reminders.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Bell className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span>{event.reminders.length} nhắc nhở</span>
          </div>
        )}
      </div>

      {/* Description Preview */}
      {event.description && (
        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>
      )}

      {/* Footer hint */}
      <div className="pt-2 border-t">
        <p className="text-xs text-muted-foreground text-center">
          Click để xem chi tiết đầy đủ
        </p>
      </div>
    </div>
  );
}
