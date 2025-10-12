'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, CalendarRange, Calendar as CalendarIcon } from 'lucide-react';
import { useCalendar } from '../views/FullCalendar';

export function ViewSelector() {
  const { view, setView, onChangeView } = useCalendar();
  
  const getViewIcon = (v: string) => {
    switch (v) {
      case 'day': return <CalendarDays className="size-4" />;
      case 'week': return <CalendarRange className="size-4" />;
      case 'month': return <CalendarIcon className="size-4" />;
      case 'year': return <CalendarIcon className="size-4" />;
      default: return null;
    }
  };

  return (
    <Select
      value={view}
      onValueChange={(v: 'day' | 'week' | 'month' | 'year') => {
        setView(v);
        onChangeView?.(v);
      }}
    >
      <SelectTrigger className="w-[140px] h-9">
        <div className="flex items-center gap-2">
          {getViewIcon(view)}
          <SelectValue placeholder="Select view" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="day">Day</SelectItem>
        <SelectItem value="week">Week</SelectItem>
        <SelectItem value="month">Month</SelectItem>
        <SelectItem value="year">Year</SelectItem>
      </SelectContent>
    </Select>
  );
}
