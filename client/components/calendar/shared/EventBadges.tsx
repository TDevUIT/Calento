'use client';

import { Video, Users, Bell, Repeat, Eye, EyeOff, Lock } from 'lucide-react';
import type { Event } from '@/interface/event.interface';

interface EventBadgesProps {
  event: Event;
  size?: 'sm' | 'md';
}

export function EventBadges({ event, size = 'sm' }: EventBadgesProps) {
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5';
  
  const badges = [];

  // Conference badge
  if (event.conference_data) {
    const conferenceColors = {
      google_meet: 'text-blue-500',
      zoom: 'text-sky-500',
      ms_teams: 'text-purple-500',
      custom: 'text-gray-500',
    };
    
    badges.push({
      key: 'conference',
      icon: <Video className={`${iconSize} ${conferenceColors[event.conference_data.type] || 'text-gray-500'}`} />,
      tooltip: event.conference_data.type === 'google_meet' ? 'Google Meet' :
               event.conference_data.type === 'zoom' ? 'Zoom' :
               event.conference_data.type === 'ms_teams' ? 'MS Teams' : 'Video Call',
    });
  }

  // Attendees badge
  if (event.attendees && event.attendees.length > 0) {
    badges.push({
      key: 'attendees',
      icon: <Users className={`${iconSize} text-green-500`} />,
      tooltip: `${event.attendees.length} người tham gia`,
    });
  }

  // Recurring badge
  if (event.recurrence_rule) {
    badges.push({
      key: 'recurring',
      icon: <Repeat className={`${iconSize} text-orange-500`} />,
      tooltip: 'Sự kiện lặp lại',
    });
  }

  // Reminders badge
  if (event.reminders && event.reminders.length > 0) {
    badges.push({
      key: 'reminders',
      icon: <Bell className={`${iconSize} text-yellow-500`} />,
      tooltip: `${event.reminders.length} nhắc nhở`,
    });
  }

  // Visibility badge
  if (event.visibility && event.visibility !== 'default') {
    const visibilityIcons = {
      public: { icon: <Eye className={`${iconSize} text-gray-500`} />, tooltip: 'Công khai' },
      private: { icon: <EyeOff className={`${iconSize} text-gray-500`} />, tooltip: 'Riêng tư' },
      confidential: { icon: <Lock className={`${iconSize} text-red-500`} />, tooltip: 'Bảo mật' },
    };
    
    const visibilityData = visibilityIcons[event.visibility as keyof typeof visibilityIcons];
    if (visibilityData) {
      badges.push({
        key: 'visibility',
        icon: visibilityData.icon,
        tooltip: visibilityData.tooltip,
      });
    }
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {badges.map((badge) => (
        <span 
          key={badge.key}
          className="inline-flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
          title={badge.tooltip}
        >
          {badge.icon}
        </span>
      ))}
    </div>
  );
}
