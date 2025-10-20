'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar, User, MapPin } from 'lucide-react';
import { EventSearchFilters } from './EventSearch';

interface SearchFiltersProps {
  filters: EventSearchFilters;
  setFilters: (filters: EventSearchFilters | ((prev: EventSearchFilters) => EventSearchFilters)) => void;
  activeFilterCount: number;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

const calendars = [
  { id: 'personal', name: 'Personal', color: 'blue' },
  { id: 'work', name: 'Work', color: 'green' },
  { id: 'team', name: 'Team', color: 'purple' },
];

const colors = [
  { id: 'blue', name: 'Blue', hex: 'bg-blue-500' },
  { id: 'green', name: 'Green', hex: 'bg-green-500' },
  { id: 'pink', name: 'Pink', hex: 'bg-pink-500' },
  { id: 'purple', name: 'Purple', hex: 'bg-purple-500' },
];

export function SearchFilters({
  filters,
  setFilters,
  activeFilterCount,
  onClearFilters,
}: SearchFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">Filters</h4>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 px-2 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Calendars Filter */}
      <div className="space-y-2">
        <Label className="text-xs font-medium flex items-center gap-2">
          <Calendar className="h-3 w-3" />
          Calendars
        </Label>
        <div className="space-y-2">
          {calendars.map((calendar) => (
            <div key={calendar.id} className="flex items-center space-x-2">
              <Checkbox
                id={`calendar-${calendar.id}`}
                checked={filters.calendars.includes(calendar.id)}
                onCheckedChange={(checked) => {
                  setFilters((prev) => ({
                    ...prev,
                    calendars: checked
                      ? [...prev.calendars, calendar.id]
                      : prev.calendars.filter((id) => id !== calendar.id),
                  }));
                }}
              />
              <Label
                htmlFor={`calendar-${calendar.id}`}
                className="text-sm font-normal cursor-pointer flex items-center gap-2"
              >
                <span className={`h-2 w-2 rounded-full ${calendar.color === 'blue' ? 'bg-blue-500' : calendar.color === 'green' ? 'bg-green-500' : 'bg-purple-500'}`} />
                {calendar.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Colors Filter */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Event Colors</Label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  colors: prev.colors.includes(color.id)
                    ? prev.colors.filter((id) => id !== color.id)
                    : [...prev.colors, color.id],
                }));
              }}
              className={`h-8 w-8 rounded-full ${color.hex} border-2 ${
                filters.colors.includes(color.id)
                  ? 'border-foreground scale-110'
                  : 'border-transparent'
              } transition-all`}
              aria-label={`Filter by ${color.name}`}
            />
          ))}
        </div>
      </div>

      {/* Additional Filters */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Additional</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="has-attendees"
              checked={filters.hasAttendees}
              onCheckedChange={(checked) => {
                setFilters((prev) => ({
                  ...prev,
                  hasAttendees: checked as boolean,
                }));
              }}
            />
            <Label
              htmlFor="has-attendees"
              className="text-sm font-normal cursor-pointer flex items-center gap-2"
            >
              <User className="h-3 w-3" />
              Has attendees
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="has-location"
              checked={filters.hasLocation}
              onCheckedChange={(checked) => {
                setFilters((prev) => ({
                  ...prev,
                  hasLocation: checked as boolean,
                }));
              }}
            />
            <Label
              htmlFor="has-location"
              className="text-sm font-normal cursor-pointer flex items-center gap-2"
            >
              <MapPin className="h-3 w-3" />
              Has location
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
