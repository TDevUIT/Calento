'use client';

import { differenceInMinutes, isSameMonth } from 'date-fns';
import { useCalendar } from '../views/FullCalendar';
import { Clock, Calendar } from 'lucide-react';
import { useMemo } from 'react';
import { EVENT_COLOR_OPTIONS } from '@/utils/colors';

interface ColorStats {
  color: string;
  hours: number;
  percentage: number;
  count: number;
  label: string;
}

const getColorLabel = (hexColor: string): string => {
  const colorOption = EVENT_COLOR_OPTIONS.find(
    (option) => option.hex.toLowerCase() === hexColor.toLowerCase()
  );
  return colorOption?.name || 'Other';
};

export function MonthProgress() {
  const { events, date } = useCalendar();
  
  const monthEvents = useMemo(
    () => events.filter((e) => isSameMonth(e.start, date)),
    [events, date]
  );

  const stats = useMemo(() => {
    const totalHours = monthEvents.reduce(
      (acc, e) => acc + differenceInMinutes(e.end, e.start) / 60,
      0
    );

    if (totalHours === 0) {
      return { colorStats: [], totalHours: 0, totalEvents: 0 };
    }

    const colorMap = new Map<string, { hours: number; count: number }>();

    monthEvents.forEach((event) => {
      const color = event.color || '#6b7280';
      const hours = differenceInMinutes(event.end, event.start) / 60;
      const existing = colorMap.get(color) || { hours: 0, count: 0 };
      colorMap.set(color, {
        hours: existing.hours + hours,
        count: existing.count + 1,
      });
    });

    const colorStats: ColorStats[] = Array.from(colorMap.entries())
      .map(([color, data]) => ({
        color,
        hours: data.hours,
        count: data.count,
        percentage: (data.hours / totalHours) * 100,
        label: getColorLabel(color),
      }))
      .sort((a, b) => b.hours - a.hours);

    return {
      colorStats,
      totalHours,
      totalEvents: monthEvents.length,
    };
  }, [monthEvents]);

  const fmt = (h: number) => `${h.toFixed(1)}h`;

  if (stats.totalEvents === 0) {
    return (
      <div className="w-full p-4 rounded-lg border border-dashed border-muted-foreground/20 bg-muted/5">
        <p className="text-sm text-muted-foreground text-center">
          No events this month
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Calendar className="h-4 w-4 text-primary" />
          <span>Monthly Overview</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {fmt(stats.totalHours)} total
          </span>
          <span>{stats.totalEvents} events</span>
        </div>
      </div>

      <div className="relative">
        <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex shadow-inner">
          {stats.colorStats.map((stat, index) => (
            <div
              key={`${stat.color}-${index}`}
              className="h-full transition-all duration-500 hover:opacity-80 cursor-pointer relative group"
              style={{
                width: `${stat.percentage}%`,
                backgroundColor: stat.color,
              }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-lg text-xs whitespace-nowrap border">
                  <div className="font-semibold">{stat.label}</div>
                  <div className="text-muted-foreground">
                    {fmt(stat.hours)} • {stat.count} events • {stat.percentage.toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="absolute inset-0 h-3 w-full rounded-full overflow-hidden pointer-events-none">
          <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
