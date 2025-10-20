'use client';

import { usePrimaryCalendar } from '@/hook/calendar';
import { Calendar, Star, Loader2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PrimaryCalendarCardProps {
  onViewDetails?: (calendarId: string) => void;
  onCreateEvent?: () => void;
}

export function PrimaryCalendarCard({ onViewDetails, onCreateEvent }: PrimaryCalendarCardProps) {
  const { data: response, isLoading, error } = usePrimaryCalendar();
  
  const calendar = response?.data;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-sm text-gray-600">Loading primary calendar...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Error Loading Primary Calendar</h3>
            <p className="text-sm text-gray-600 mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!calendar) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-start gap-3">
          <Calendar className="h-6 w-6 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">No Primary Calendar</h3>
            <p className="text-sm text-gray-600 mb-4">
              Set a primary calendar to manage your events more easily. Events will be created here by default.
            </p>
            <Button size="sm" variant="outline" className="border-blue-300 hover:bg-blue-100">
              Set Primary Calendar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg border border-amber-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-600 fill-yellow-500" />
          <h3 className="font-semibold text-gray-900">Primary Calendar</h3>
        </div>
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Active
        </Badge>
      </div>

      <div className="space-y-3">
        {/* Calendar Name */}
        <div>
          <h4 className="font-medium text-lg text-gray-900">
            {calendar.name || calendar.google_calendar_id}
          </h4>
          {calendar.description && (
            <p className="text-sm text-gray-600 mt-1">{calendar.description}</p>
          )}
        </div>

        {/* Timezone */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{calendar.timezone || 'Not set'}</span>
        </div>

        {/* Info Box */}
        <div className="bg-white/70 rounded-md p-3 text-sm">
          <p className="text-gray-700">
            <span className="font-medium">New events</span> will be automatically created in this calendar
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(calendar.id)}
              className="flex-1 border-amber-300 hover:bg-amber-100"
            >
              View Details
            </Button>
          )}
          {onCreateEvent && (
            <Button
              size="sm"
              onClick={onCreateEvent}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
