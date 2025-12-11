'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, FileText } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location?: string;
  description?: string;
}

interface EventsListProps {
  events: Event[];
  total?: number;
  dateRange?: {
    start: string;
    end: string;
  };
  message?: string;
}

export const EventsList = ({ events, message }: EventsListProps) => {
  if (events.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Calendar className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">No Events Found</p>
          <p className="text-xs text-gray-500">
            {message || 'You have no events scheduled in this period'}
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const minutes = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60));

    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const groupEventsByDate = (events: Event[]) => {
    const groups: Record<string, Event[]> = {};

    events.forEach(event => {
      const date = new Date(event.start_time).toLocaleDateString('en-US');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
    });

    return Object.entries(groups).map(([date, dateEvents]) => ({
      date,
      dateFormatted: formatDate(dateEvents[0].start_time),
      events: dateEvents.sort((a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      ),
    }));
  };

  const groupedEvents = groupEventsByDate(events);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden w-full">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3.5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-white shadow-sm flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-gray-900">Your Calendar</h4>
              <p className="text-xs text-gray-600">
                {message || `${events.length} event${events.length > 1 ? 's' : ''} found`}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white px-3 py-1">
            {events.length} events
          </Badge>
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {groupedEvents.map((group, groupIdx) => (
          <div key={group.date} className={groupIdx > 0 ? 'border-t border-gray-100' : ''}>
            <div className="sticky top-0 bg-gray-50 px-4 py-2.5 border-b border-gray-100 z-10">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                <span className="text-sm font-semibold text-gray-700">
                  {group.dateFormatted}
                </span>
                <span className="text-xs text-gray-500">• {group.events.length} events</span>
              </div>
            </div>

            <div className="p-3 space-y-2">
              {group.events.map((event) => (
                <div
                  key={event.id}
                  className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors cursor-pointer border-2 border-transparent hover:border-blue-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 text-center min-w-[60px]">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatTime(event.start_time)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getDuration(event.start_time, event.end_time)}
                      </p>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h5 className="text-base font-semibold text-gray-900 mb-1.5">
                        {event.title}
                      </h5>

                      <div className="space-y-1">
                        {event.description && (
                          <div className="flex items-start gap-2">
                            <FileText className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {event.description}
                            </p>
                          </div>
                        )}

                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                            <p className="text-sm text-gray-600">
                              {event.location}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {formatTime(event.start_time)} - {formatTime(event.end_time)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
