'use client';

import { ConferenceData } from '@/interface/event.interface';
import { Video, Copy, Phone, Lock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ConferenceInfoProps {
  conference: ConferenceData;
}

const conferenceConfigs = {
  google_meet: {
    name: 'Google Meet',
    color: 'bg-blue-100 dark:bg-blue-900',
    iconColor: 'text-blue-600 dark:text-blue-400',
    textColor: 'text-blue-600 dark:text-blue-400',
  },
  zoom: {
    name: 'Zoom',
    color: 'bg-sky-100 dark:bg-sky-900',
    iconColor: 'text-sky-600 dark:text-sky-400',
    textColor: 'text-sky-600 dark:text-sky-400',
  },
  ms_teams: {
    name: 'Microsoft Teams',
    color: 'bg-purple-100 dark:bg-purple-900',
    iconColor: 'text-purple-600 dark:text-purple-400',
    textColor: 'text-purple-600 dark:text-purple-400',
  },
  custom: {
    name: 'Video Conference',
    color: 'bg-gray-100 dark:bg-gray-800',
    iconColor: 'text-gray-600 dark:text-gray-400',
    textColor: 'text-gray-600 dark:text-gray-400',
  },
};

export function ConferenceInfo({ conference }: ConferenceInfoProps) {
  const config = conferenceConfigs[conference.type];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(conference.url);
    toast.success('ÄÃ£ sao chÃ©p liÃªn káº¿t');
  };

  const handleCopyMeetingId = () => {
    if (conference.id) {
      navigator.clipboard.writeText(conference.id);
      toast.success('ÄÃ£ sao chÃ©p Meeting ID');
    }
  };

  const handleCopyPassword = () => {
    if (conference.password) {
      navigator.clipboard.writeText(conference.password);
      toast.success('ÄÃ£ sao chÃ©p máº­t kháº©u');
    }
  };

  const handleJoinMeeting = () => {
    window.open(conference.url, '_blank');
  };

  return (
    <div className="space-y-3">
      {/* Header with icon and name */}
      <div className="flex items-center gap-3">
        <div className={`${config.color} rounded-lg p-2`}>
          <Video className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{config.name}</p>
          <Button
            variant="link"
            className={`h-auto p-0 ${config.textColor} font-medium text-sm`}
            onClick={handleJoinMeeting}
          >
            Tham gia cuá»™c há»p
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          onClick={handleCopyLink}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>

      {/* Meeting details */}
      <div className="space-y-2 pl-11">
        {/* Meeting URL */}
        <div className="text-xs text-muted-foreground truncate">
          {conference.url}
        </div>

        {/* Meeting ID */}
        {conference.id && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Meeting ID
            </Badge>
            <span className="text-xs font-mono">{conference.id}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleCopyMeetingId}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Password */}
        {conference.password && (
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
            <Badge variant="outline" className="text-xs">
              Máº­t kháº©u
            </Badge>
            <span className="text-xs font-mono">{'â€¢'.repeat(conference.password.length)}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleCopyPassword}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Phone dial-in */}
        {conference.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs">{conference.phone}</span>
            {conference.pin && (
              <>
                <span className="text-xs text-muted-foreground">â€¢</span>
                <span className="text-xs">PIN: {conference.pin}</span>
              </>
            )}
          </div>
        )}

        {/* Additional notes */}
        {conference.notes && (
          <div className="flex items-start gap-2 pt-1">
            <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {conference.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
