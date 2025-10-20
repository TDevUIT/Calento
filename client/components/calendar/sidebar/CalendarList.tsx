'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CalendarItem } from '../shared/types';

interface CalendarListProps {
  calendars: CalendarItem[];
  onToggle: (id: string) => void;
}

export function CalendarList({ calendars, onToggle }: CalendarListProps) {
  return (
    <div className="space-y-2">
      {calendars.map((calendar) => {
        const Icon = calendar.icon;
        return (
          <div
            key={calendar.id}
            className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all cursor-pointer border border-transparent hover:border-gray-200"
            onClick={() => onToggle(calendar.id)}
          >
            <Checkbox 
              checked={calendar.visible}
              onCheckedChange={() => onToggle(calendar.id)}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <Icon className="h-4 w-4 text-gray-600" />
            <div className="flex-1 flex items-center justify-between min-w-0">
              <span className="text-sm font-medium text-gray-900 truncate">
                {calendar.name}
              </span>
              <Badge 
                variant="secondary" 
                className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {calendar.count}
              </Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
}
