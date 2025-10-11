'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  color: string;
  attendees?: number;
}

export const CalendarPreview: React.FC = () => {
  const events: CalendarEvent[] = [
    { id: '1', title: 'Team Standup', time: '9:00 AM', color: 'bg-blue-500', attendees: 8 },
    { id: '2', title: 'Design Review', time: '11:00 AM', color: 'bg-purple-500', attendees: 4 },
    { id: '3', title: 'Client Meeting', time: '2:00 PM', color: 'bg-green-500', attendees: 3 },
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const today = 2; // Wednesday

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">December 2024</h3>
          <p className="text-sm text-gray-500">This week</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path d="M12 5l-5 5 5 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path d="M8 5l5 5-5 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {days.map((day, index) => (
          <div
            key={day}
            className={cn(
              'text-center py-2 rounded-lg text-sm font-medium',
              index === today ? 'bg-violet-500 text-white' : 'text-gray-600'
            )}
          >
            <div className="text-xs opacity-75">{day}</div>
            <div className="text-lg font-semibold">{18 + index}</div>
          </div>
        ))}
      </div>

      {/* Events list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-700">Today&apos;s Schedule</h4>
          <span className="text-xs text-gray-500">{events.length} events</span>
        </div>
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className={cn('w-1 h-12 rounded-full', event.color)}></div>
            <div className="flex-1">
              <h5 className="text-sm font-medium text-gray-900">{event.title}</h5>
              <p className="text-xs text-gray-500">{event.time}</p>
            </div>
            {event.attendees && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                  <path d="M11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM13 13v-1a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{event.attendees}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* AI Suggestion Badge */}
      <div className="mt-4 p-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-200">
        <div className="flex items-start gap-2">
          <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-violet-900">AI Suggestion</h5>
            <p className="text-xs text-violet-700 mt-1">
              You have 30 min free slot before lunch. Perfect time for a quick sync!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
