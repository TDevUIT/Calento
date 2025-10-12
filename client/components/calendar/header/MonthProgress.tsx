'use client';

import { differenceInMinutes, isSameMonth } from 'date-fns';
import { useCalendar } from '../views/FullCalendar';

export function MonthProgress() {
  const { events, date } = useCalendar();
  const monthEvents = events.filter((e) => isSameMonth(e.start, date));
  const totalHours = monthEvents.reduce((acc, e) => acc + differenceInMinutes(e.end, e.start) / 60, 0);
  const blueHours = monthEvents
    .filter((e) => e.color === 'blue')
    .reduce((acc, e) => acc + differenceInMinutes(e.end, e.start) / 60, 0);
  const otherHours = Math.max(totalHours - blueHours, 0);

  const bluePct = totalHours > 0 ? (blueHours / totalHours) * 100 : 7;
  const greenPct = Math.max(100 - bluePct, 0);

  const fmt = (h: number) => `${h.toFixed(1)}h`;

  return (
    <div className="w-full">
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex">
        <div className="h-full bg-blue-500" style={{ width: `${bluePct}%` }} />
        <div className="h-full bg-green-500" style={{ width: `${greenPct}%` }} />
      </div>
      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="inline-block size-2 rounded-full bg-blue-500" />
          Team meetings {fmt(blueHours)}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-2 rounded-full bg-green-500" />
          Other work {fmt(otherHours)}
        </span>
      </div>
    </div>
  );
}
