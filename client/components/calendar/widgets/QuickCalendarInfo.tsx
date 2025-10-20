'use client';

import { usePrimaryCalendar } from '@/hook/calendar';
import { Star, Calendar } from 'lucide-react';

export function QuickCalendarInfo() {
  const { data: response, isLoading } = usePrimaryCalendar();
  
  const calendar = response?.data;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="h-4 w-4 rounded-full bg-gray-200 animate-pulse" />
        <span>Loading...</span>
      </div>
    );
  }

  if (!calendar) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Calendar className="h-4 w-4" />
        <span>No primary calendar</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
      <span className="text-gray-700">
        <span className="font-medium">{calendar.name || 'Primary Calendar'}</span>
        {calendar.timezone && (
          <span className="text-gray-500 ml-2">
            ({calendar.timezone})
          </span>
        )}
      </span>
    </div>
  );
}
