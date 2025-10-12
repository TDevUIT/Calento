'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface CalendarFiltersProps {
  onSearch?: (query: string) => void;
  onFilterPrimary?: (isPrimary: boolean | undefined) => void;
  onFilterTimezone?: (timezone: string | undefined) => void;
  onSort?: (sortBy: string, sortOrder: 'ASC' | 'DESC') => void;
}

const TIMEZONES = [
  { value: 'Asia/Ho_Chi_Minh', label: 'Ho Chi Minh (GMT+7)' },
  { value: 'Asia/Bangkok', label: 'Bangkok (GMT+7)' },
  { value: 'Asia/Singapore', label: 'Singapore (GMT+8)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)' },
  { value: 'America/New_York', label: 'New York (GMT-5)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8)' },
  { value: 'Europe/London', label: 'London (GMT+0)' },
  { value: 'Europe/Paris', label: 'Paris (GMT+1)' },
];

export function CalendarFilters({
  onSearch,
  onFilterPrimary,
  onFilterTimezone,
  onSort,
}: CalendarFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [primaryFilter, setPrimaryFilter] = useState<string>('all');
  const [timezoneFilter, setTimezoneFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handlePrimaryFilter = (value: string) => {
    setPrimaryFilter(value);
    const isPrimary = value === 'primary' ? true : value === 'non-primary' ? false : undefined;
    onFilterPrimary?.(isPrimary);
  };

  const handleTimezoneFilter = (value: string) => {
    setTimezoneFilter(value);
    onFilterTimezone?.(value === 'all' ? undefined : value);
  };

  const handleSort = (field: string) => {
    setSortBy(field);
    onSort?.(field, sortOrder);
  };

  const handleSortOrder = (order: 'ASC' | 'DESC') => {
    setSortOrder(order);
    onSort?.(sortBy, order);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPrimaryFilter('all');
    setTimezoneFilter('all');
    onSearch?.('');
    onFilterPrimary?.(undefined);
    onFilterTimezone?.(undefined);
  };

  const activeFiltersCount = 
    (primaryFilter !== 'all' ? 1 : 0) +
    (timezoneFilter !== 'all' ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search calendars..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={() => handleSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="space-y-3 p-3 bg-gray-50 rounded-lg border">
          {/* Primary Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Calendar Type</label>
            <Select value={primaryFilter} onValueChange={handlePrimaryFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All calendars" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All calendars</SelectItem>
                <SelectItem value="primary">Primary only</SelectItem>
                <SelectItem value="non-primary">Non-primary only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timezone Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Timezone</label>
            <Select value={timezoneFilter} onValueChange={handleTimezoneFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All timezones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All timezones</SelectItem>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Options */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Sort By</label>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={handleSort}>
                <SelectTrigger className="h-9 flex-1">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Date created</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="is_primary">Primary first</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={(v) => handleSortOrder(v as 'ASC' | 'DESC')}>
                <SelectTrigger className="h-9 w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ASC">A-Z</SelectItem>
                  <SelectItem value="DESC">Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
