'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface Attendee {
  name: string;
  avatar?: string;
  color: string;
}

interface MeetingCardProps {
  title: string;
  time: string;
  duration: string;
  attendees: Attendee[];
  status?: 'upcoming' | 'in-progress' | 'completed';
}

export const MeetingCard: React.FC<MeetingCardProps> = ({
  title,
  time,
  duration,
  attendees,
  status = 'upcoming'
}) => {
  const statusColors = {
    upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
    'in-progress': 'bg-green-50 text-green-700 border-green-200',
    completed: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
              <circle cx="8" cy="8" r="6" strokeWidth="1.5"/>
              <path d="M8 4v4l3 2" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>{time}</span>
            <span className="text-gray-400">â€¢</span>
            <span>{duration}</span>
          </div>
        </div>
        <span className={cn('px-3 py-1 rounded-full text-xs font-medium border', statusColors[status])}>
          {status === 'in-progress' ? 'Live' : status === 'completed' ? 'Done' : 'Upcoming'}
        </span>
      </div>

      {/* Attendees */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {attendees.slice(0, 4).map((attendee, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                style={{ backgroundColor: attendee.color }}
                title={attendee.name}
              >
                {attendee.name.charAt(0)}
              </div>
            ))}
          </div>
          {attendees.length > 4 && (
            <span className="text-xs text-gray-500">+{attendees.length - 4} more</span>
          )}
        </div>

        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Join meeting">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor">
              <rect x="2" y="2" width="14" height="10" rx="2" strokeWidth="1.5"/>
              <path d="M16 6l2-1v8l-2-1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="More options">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
              <circle cx="9" cy="3" r="1.5"/>
              <circle cx="9" cy="9" r="1.5"/>
              <circle cx="9" cy="15" r="1.5"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
