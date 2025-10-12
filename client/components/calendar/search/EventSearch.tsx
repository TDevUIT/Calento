'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Search, Filter, X } from 'lucide-react';
import { SearchFilters } from './SearchFilters';

export interface EventSearchFilters {
  calendars: string[];
  colors: string[];
  hasAttendees: boolean;
  hasLocation: boolean;
}

interface EventSearchProps {
  onSearch?: (query: string, filters: EventSearchFilters) => void;
}

export function EventSearch({ onSearch }: EventSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<EventSearchFilters>({
    calendars: [],
    colors: [],
    hasAttendees: false,
    hasLocation: false,
  });

  const activeFilterCount = 
    filters.calendars.length + 
    filters.colors.length + 
    (filters.hasAttendees ? 1 : 0) + 
    (filters.hasLocation ? 1 : 0);

  const clearFilters = () => {
    const newFilters: EventSearchFilters = {
      calendars: [],
      colors: [],
      hasAttendees: false,
      hasLocation: false,
    };
    setFilters(newFilters);
    onSearch?.(searchQuery, newFilters);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onSearch?.(e.target.value, filters);
          }}
          className="pl-9 pr-4"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => {
              setSearchQuery('');
              onSearch?.('', filters);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 relative">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <SearchFilters 
            filters={filters} 
            setFilters={setFilters}
            activeFilterCount={activeFilterCount}
            onClearFilters={clearFilters}
            onApplyFilters={() => onSearch?.(searchQuery, filters)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
