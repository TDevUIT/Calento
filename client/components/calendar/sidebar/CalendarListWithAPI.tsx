'use client';

import React, { useState } from 'react';
import { useCalendars } from '@/hook/calendar';
import { useApiData } from '@/hook';
import { Calendar } from '@/interface';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, User, Briefcase, Users, Calendar as CalendarIcon, Star, Loader2, Search, X, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CreateCalendarDialog } from '@/components/calendar/dialogs/CreateCalendarDialog';
import { EditCalendarDialog } from '@/components/calendar/dialogs/EditCalendarDialog';

interface CalendarListWithAPIProps {
  onCreateCalendar?: () => void;
  visibleCalendarIds?: Set<string>;
  onVisibleCalendarIdsChange?: (ids: Set<string>) => void;
}
export function CalendarListWithAPI({
  visibleCalendarIds: externalVisibleIds,
  onVisibleCalendarIdsChange: onExternalIdsChange
}: CalendarListWithAPIProps) {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy] = useState('created_at');
  const [sortOrder] = useState<'ASC' | 'DESC'>('DESC');

  const queryResult = useCalendars({
    page,
    limit,
    search: searchQuery || undefined,
    sortBy,
    sortOrder
  });
  const { items: calendars, meta, isLoading, error } = useApiData<Calendar>(queryResult);

  const [localVisibleIds, setLocalVisibleIds] = useState<Set<string>>(new Set());
  const visibleCalendarIds = externalVisibleIds || localVisibleIds;
  const setVisibleCalendarIds = onExternalIdsChange || setLocalVisibleIds;

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState<Calendar | null>(null);

  const toggleCalendar = (id: string) => {
    const base = visibleCalendarIds.size === 0
      ? new Set(calendars.map((cal: Calendar) => cal.id))
      : new Set(visibleCalendarIds);

    if (base.has(id)) base.delete(id);
    else base.add(id);

    setVisibleCalendarIds(base);
  };
  const getCalendarIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('personal')) return User;
    if (lowerName.includes('work')) return Briefcase;
    if (lowerName.includes('team')) return Users;
    return CalendarIcon;
  };
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleEditCalendar = (calendar: Calendar) => {
    setSelectedCalendar(calendar);
    setShowEditDialog(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700">My Calendars</h3>
        </div>
        <div className="text-center py-4">
          <Loader2 className="h-6 w-6 mx-auto animate-spin text-blue-600" />
          <p className="text-xs text-gray-500 mt-2">Loading calendars...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700">My Calendars</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-red-500">Failed to load calendars</p>
          <p className="text-xs text-gray-500 mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  if (calendars.length === 0) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700">My Calendars</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCreateDialog(true)}
            className="h-6 px-2 hover:bg-gray-100"
            title="Create new calendar"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <CalendarIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">No calendars yet</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreateDialog(true)}
            className="mt-2"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Create Calendar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">
          My Calendars
          {meta && (
            <span className="ml-2 text-xs text-gray-500 font-normal">
              ({meta.total})
            </span>
          )}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowCreateDialog(true)}
          className="h-6 px-2 hover:bg-gray-100"
          title="Create new calendar"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search calendars..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-8 pl-8 pr-8 text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => handleSearch('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-1">
        {calendars.map((calendar: Calendar) => {
          const Icon = getCalendarIcon(calendar.name || 'Calendar');
          const isVisible = visibleCalendarIds.size === 0 || visibleCalendarIds.has(calendar.id);

          return (
            <div
              key={calendar.id}
              className="group flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Checkbox
                id={`calendar-${calendar.id}`}
                checked={isVisible}
                onCheckedChange={() => toggleCalendar(calendar.id)}
                className="data-[state=checked]:bg-blue-600"
              />

              <Icon className="h-4 w-4 text-gray-600 shrink-0" />

              <div className="flex-1 flex items-center justify-between">
                <label
                  htmlFor={`calendar-${calendar.id}`}
                  className="flex items-center gap-2 text-sm cursor-pointer select-none flex-1"
                >
                  <span className={cn(
                    "truncate transition-colors",
                    isVisible ? "text-gray-900 font-medium" : "text-gray-500"
                  )}>
                    {calendar.name || calendar.google_calendar_id}
                  </span>
                </label>

                {calendar.is_primary && (
                  <span title="Primary calendar">
                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 shrink-0" />
                  </span>
                )}
              </div>

              <span className="text-xs text-gray-400 tabular-nums shrink-0">
                0
              </span>

              {/* Edit Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditCalendar(calendar)}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Edit calendar"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-gray-100 space-y-2">
        {/* Primary Calendar Info */}
        <p className="text-xs text-gray-500 text-center">
          Primary:{' '}
          <span className="font-medium text-gray-700">
            {calendars.find((c: Calendar) => c.is_primary)?.name || 'None'}
          </span>
        </p>

        {/* Pagination Controls */}
        {meta && meta.total > 0 && (
          <div className="space-y-1.5">
            {/* Items Count */}
            <div className="text-xs text-gray-500 text-center">
              {searchQuery ? (
                <span>Found {meta.total} calendar{meta.total !== 1 ? 's' : ''}</span>
              ) : (
                <span>Showing {(page - 1) * limit + 1}-{Math.min(page * limit, meta.total)} of {meta.total}</span>
              )}
            </div>

            {/* Pagination Buttons */}
            {meta.totalPages > 1 && (
              <div className="flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!meta.hasPreviousPage}
                  className="h-7 px-2 flex-1"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span className="text-xs">Prev</span>
                </Button>

                <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
                  {page} / {meta.totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!meta.hasNextPage}
                  className="h-7 px-2 flex-1"
                >
                  <span className="text-xs">Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <CreateCalendarDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />

      <EditCalendarDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        calendar={selectedCalendar}
      />
    </div>
  );
}
