'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MiniCalendarProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
  eventsCount?: Record<string, number>;
}

export function MiniCalendar({ onDateSelect, selectedDate = new Date(), eventsCount = {} }: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, 'yyyy-MM-dd');
      const dayNumber = format(day, dateFormat);
      const cloneDay = day;
      
      days.push(
        <button
          key={day.toString()}
          className={cn(
            'relative h-10 w-full text-sm font-medium transition-colors hover:bg-accent rounded-md',
            !isSameMonth(day, monthStart) && 'text-muted-foreground/40',
            isSameDay(day, selectedDate) && 'bg-primary text-primary-foreground hover:bg-primary',
            isSameDay(day, new Date()) && !isSameDay(day, selectedDate) && 'bg-accent font-bold'
          )}
          onClick={() => onDateSelect?.(cloneDay)}
        >
          <span>{dayNumber}</span>
          {eventsCount[formattedDate] && (
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
              {Array.from({ length: Math.min(eventsCount[formattedDate], 3) }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'h-1 w-1 rounded-full',
                    isSameDay(day, selectedDate) ? 'bg-primary-foreground' : 'bg-primary'
                  )}
                />
              ))}
            </span>
          )}
        </button>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7 gap-1" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="w-full space-y-2 p-3 rounded-lg border bg-card">
      <div className="flex items-center justify-between mb-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h2 className="text-sm font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      <div className="space-y-1">
        {rows}
      </div>

      <div className="pt-2 border-t mt-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 text-xs"
          onClick={() => {
            setCurrentMonth(new Date());
            onDateSelect?.(new Date());
          }}
        >
          Today
        </Button>
      </div>
    </div>
  );
}
