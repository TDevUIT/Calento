'use client';

import { EventAttendee } from '@/interface/event.interface';
import { User, Check, X, Clock, HelpCircle, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AttendeesListProps {
  attendees: EventAttendee[];
  organizerEmail?: string;
}

const responseStatusConfig = {
  accepted: {
    icon: Check,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950',
    label: 'Đã chấp nhận',
  },
  declined: {
    icon: X,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950',
    label: 'Đã từ chối',
  },
  tentative: {
    icon: HelpCircle,
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    label: 'Chưa chắc chắn',
  },
  needsAction: {
    icon: Clock,
    color: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-50 dark:bg-gray-900',
    label: 'Chưa phản hồi',
  },
};

function getInitials(name?: string, email?: string): string {
  if (name) {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return 'U';
}

export function AttendeesList({ attendees, organizerEmail }: AttendeesListProps) {
  if (!attendees || attendees.length === 0) {
    return null;
  }

  // Sort: organizer first, then by response status
  const sortedAttendees = [...attendees].sort((a, b) => {
    if (a.is_organizer) return -1;
    if (b.is_organizer) return 1;
    if (a.email === organizerEmail) return -1;
    if (b.email === organizerEmail) return 1;
    
    const statusOrder = { accepted: 0, tentative: 1, needsAction: 2, declined: 3 };
    const aStatus = a.response_status || 'needsAction';
    const bStatus = b.response_status || 'needsAction';
    return statusOrder[aStatus] - statusOrder[bStatus];
  });

  const acceptedCount = attendees.filter(a => a.response_status === 'accepted').length;
  const totalCount = attendees.length;

  return (
    <div className="space-y-3">
      {/* Header with summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {totalCount} người tham gia
          </span>
        </div>
        <Badge variant="secondary" className="text-xs">
          {acceptedCount} đã chấp nhận
        </Badge>
      </div>

      {/* Attendees list */}
      <div className="space-y-2">
        {sortedAttendees.map((attendee, index) => {
          const status = attendee.response_status || 'needsAction';
          const config = responseStatusConfig[status];
          const StatusIcon = config.icon;
          const isOrganizer = attendee.is_organizer || attendee.email === organizerEmail;

          return (
            <TooltipProvider key={`${attendee.email}-${index}`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
                    {/* Avatar */}
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className={`text-xs ${isOrganizer ? 'bg-primary text-primary-foreground' : ''}`}>
                        {getInitials(attendee.name, attendee.email)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">
                          {attendee.name || attendee.email}
                        </p>
                        {isOrganizer && (
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                        )}
                        {attendee.is_optional && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                            Tùy chọn
                          </Badge>
                        )}
                      </div>
                      {attendee.name && (
                        <p className="text-xs text-muted-foreground truncate">
                          {attendee.email}
                        </p>
                      )}
                    </div>

                    {/* Status indicator */}
                    <div className={`${config.bg} rounded-full p-1.5 flex-shrink-0`}>
                      <StatusIcon className={`h-3.5 w-3.5 ${config.color}`} />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-medium">{attendee.name || attendee.email}</p>
                    {attendee.name && (
                      <p className="text-xs text-muted-foreground">{attendee.email}</p>
                    )}
                    <p className="text-xs">
                      <span className="font-medium">Trạng thái:</span> {config.label}
                    </p>
                    {isOrganizer && (
                      <p className="text-xs font-medium text-yellow-600">
                        Người tổ chức
                      </p>
                    )}
                    {attendee.comment && (
                      <p className="text-xs italic">&quot;{attendee.comment}&quot;</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
}
