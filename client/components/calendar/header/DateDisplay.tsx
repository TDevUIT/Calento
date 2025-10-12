 'use client';

import { Badge } from '@/components/ui/badge';
import { CalendarCurrentDate, useCalendar } from '../views/FullCalendar';
import { isThisWeek } from 'date-fns';

export function DateDisplay() {
  const { date, view } = useCalendar();
  const showThisWeek = view === 'week' && isThisWeek(date);

  return (
    <div className="flex items-center gap-2">
      <div className="font-semibold text-lg">
        <CalendarCurrentDate />
      </div>
      {showThisWeek && (
        <Badge variant="secondary" className="text-xs font-normal">
          This week
        </Badge>
      )}
    </div>
  );
}
