'use client';

import { useCalendarSettings } from './CalendarSettingsProvider';
import { formatTimeWithSettings, formatDateWithSettings } from '@/utils';
import { 
  MapPin, 
  Video,
  Users,
  Bell,
  Repeat,
  Eye,
  EyeOff,
  Lock,
  ExternalLink,
  Calendar,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock3
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import type { Event } from '@/interface';

interface EventQuickPreviewProps {
  event: Event;
}

export function EventQuickPreview({ event }: EventQuickPreviewProps) {
  const startDate = new Date(event.start_time);
  const endDate = new Date(event.end_time);
  const { timeFormat, dateFormat } = useCalendarSettings();
  
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
      return 'All day';
    }
    const startTime = formatTimeWithSettings(startDate, timeFormat);
    const endTime = formatTimeWithSettings(endDate, timeFormat);
    return `${startTime} – ${endTime}`;
  };

  const formatReminderTime = () => {
    if (!event.reminders || event.reminders.length === 0) return '';
    const firstReminder = event.reminders[0];
    if (firstReminder.minutes === 0) return 'At event time';
    if (firstReminder.minutes < 60) return `${firstReminder.minutes} minutes before`;
    if (firstReminder.minutes === 60) return '1 hour before';
    const hours = Math.floor(firstReminder.minutes / 60);
    return `${hours} hours before`;
  };

  const getResponseStatusIcon = (status?: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />;
      case 'declined': return <XCircle className="h-3.5 w-3.5 text-red-500" />;
      case 'tentative': return <HelpCircle className="h-3.5 w-3.5 text-yellow-500" />;
      default: return <Clock3 className="h-3.5 w-3.5 text-gray-400" />;
    }
  };

  const acceptedCount = event.attendees?.filter(a => a.response_status === 'accepted').length || 0;
  const totalAttendees = event.attendees?.length || 0;
  const organizerAttendee = event.attendees?.find(a => a.is_organizer);
  
  const organizerName = event.creator?.name || event.organizer_name || organizerAttendee?.name;
  const organizerEmail = event.creator?.email || event.organizer_email || organizerAttendee?.email;
  const organizerAvatar = event.creator?.avatar || event.organizer_avatar;
  
  
  const displayRole = event.creator?.name 
    ? 'Creator' 
    : event.organizer_name 
      ? 'Organizer' 
      : organizerAttendee?.name
        ? 'Organizer'
        : 'Organizer';
  
  const getOrganizerInitials = () => {
    const name = organizerName?.trim();
    if (!name || name === '') return '?';
    const words = name.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return '?';
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };
  
  const organizerInitials = getOrganizerInitials();
  const displayOrganizerName = organizerName || organizerEmail || 'Unknown';

  return (
    <div 
      className="w-96 bg-white rounded-lg overflow-hidden relative event-quick-preview" 
      style={{ 
        zIndex: 999999, 
        pointerEvents: 'auto',
        position: 'relative',
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${colorClasses[event.color || 'blue']}`} />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base leading-tight">
              {event.title}
            </h3>
          </div>
          {event.visibility && event.visibility !== 'default' && (
            <Badge variant="outline" className="flex-shrink-0 text-xs px-1.5 py-0.5 gap-1">
              {visibilityIcons[event.visibility as keyof typeof visibilityIcons]?.icon}
              <span className="capitalize">{event.visibility}</span>
            </Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span>{formatDateWithSettings(startDate, dateFormat)}</span>
            <span className="text-muted-foreground">⋅</span>
            <span>{formatTimeRange()}</span>
          </div>

          {event.team?.id && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5 gap-1">
              <Users className="h-3 w-3" />
              {event.team.name || 'Team'}
            </Badge>
          )}

          {event.recurrence_rule && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5 gap-1">
              <Repeat className="h-3 w-3" />
              Recurring
            </Badge>
          )}
        </div>

        {event.conference_data && (
          <div className="flex items-center gap-2 text-sm">
            <Video className={`h-4 w-4 flex-shrink-0 ${conferenceIcons[event.conference_data.type]?.color || 'text-gray-500'}`} />
            <a 
              href={event.conference_data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              {conferenceIcons[event.conference_data.type]?.name || 'Video Conference'}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
        {event.location && !event.conference_data && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        )}

        {event.attendees && event.attendees.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span>{totalAttendees} guests</span>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-green-600 font-medium">{acceptedCount} accepted</span>
          </div>
        )}

        {event.reminders && event.reminders.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bell className="h-4 w-4 flex-shrink-0" />
            <span>{formatReminderTime()}</span>
          </div>
        )}
      </div>

      <Separator />
      <div className="px-4 py-3 bg-muted/30">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 border-2 border-background">
            <AvatarImage src={organizerAvatar} alt={displayOrganizerName} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">
              {organizerInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm">{displayOrganizerName}</p>
              {event.response_status && getResponseStatusIcon(event.response_status)}
            </div>
            <p className="text-xs text-muted-foreground">{displayRole}</p>
            {organizerEmail && organizerName && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">{organizerEmail}</p>
            )}
          </div>
        </div>
      </div>

      {event.description && event.description.trim() && (
        <>
          <Separator />
          <div className="px-4 py-3 max-h-32 overflow-y-auto">
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">
              {event.description.trim()}
            </p>
          </div>
        </>
      )}

      {event.source && (
        <>
          <Separator />
          <div className="px-4 py-3 bg-muted/20">
            <p className="text-xs text-muted-foreground">
              This event was created by{' '}
              {event.source_url ? (
                <a
                  href={event.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {event.source}
                </a>
              ) : (
                <span className="font-semibold">{event.source}</span>
              )}
              .
            </p>
          </div>
        </>
      )}

      {event.google_calendar_url && (
        <>
          <Separator />
          <div className="px-4 py-2">
            <a
              href={event.google_calendar_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <Calendar className="h-4 w-4" />
              View in Google Calendar
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </>
      )}

      <Separator />
      <div className="px-4 py-2 bg-muted/10">
        <p className="text-xs text-muted-foreground text-center">
          Click to view and edit full details
        </p>
      </div>
    </div>
  );
}
