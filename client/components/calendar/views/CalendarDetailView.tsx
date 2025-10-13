'use client';

import { useCalendarDetail } from '@/hook/calendar';
import { Loader2, Star, Clock, MapPin, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CalendarDetailViewProps {
  calendarId: string;
  onEdit?: () => void;
  onClose?: () => void;
}

export function CalendarDetailView({ calendarId, onEdit, onClose }: CalendarDetailViewProps) {
  const { data: response, isLoading, error } = useCalendarDetail(calendarId);
  
  const calendar = response?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Calendar</h3>
        <p className="text-sm text-gray-600 mb-4">{error.message}</p>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    );
  }

  if (!calendar) {
    return (
      <div className="p-6 text-center">
        <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Calendar Not Found</h3>
        <p className="text-sm text-gray-600 mb-4">This calendar does not exist or has been deleted.</p>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">
              {calendar.name || calendar.google_calendar_id}
            </h2>
            {calendar.is_primary && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                Primary
              </Badge>
            )}
          </div>
          {calendar.description && (
            <p className="text-sm text-gray-600">{calendar.description}</p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={onEdit}>
          Edit
        </Button>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Timezone */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <Clock className="h-5 w-5 text-gray-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-700">Timezone</p>
            <p className="text-sm text-gray-900">{calendar.timezone || 'Not set'}</p>
          </div>
        </div>

        {/* Google Calendar ID */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CalendarIcon className="h-5 w-5 text-gray-600 mt-0.5" />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-gray-700">Google Calendar ID</p>
            <p className="text-xs text-gray-900 font-mono truncate" title={calendar.google_calendar_id}>
              {calendar.google_calendar_id}
            </p>
          </div>
        </div>

        {/* Created At */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-700">Created</p>
            <p className="text-sm text-gray-900">
              {new Date(calendar.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Updated At */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-700">Last Updated</p>
            <p className="text-sm text-gray-900">
              {new Date(calendar.updated_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${calendar.is_primary ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="text-sm text-gray-600">
            {calendar.is_primary ? 'Primary Calendar' : 'Secondary Calendar'}
          </span>
        </div>
        
        <div className="text-xs text-gray-500">
          ID: {calendar.id.substring(0, 8)}...
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Close
        </Button>
        <Button className="flex-1" onClick={onEdit}>
          Edit Calendar
        </Button>
      </div>
    </div>
  );
}
