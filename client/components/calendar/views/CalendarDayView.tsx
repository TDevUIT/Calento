'use client';

import { setHours } from 'date-fns';

import { DayTimelineEvents, TimeTable, useCalendar } from './CalendarCore';

const HOUR_HEIGHT = 80; // pixels per hour

const CalendarDayView = () => {
  const { view, events, date } = useCalendar();

  if (view !== 'day') return null;

  const hours = [...Array(24)].map((_, i) => setHours(date, i));

  return (
    <div className="flex flex-col relative h-full border bg-[#F7F8FC] shadow-sm">
      <div className="flex flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin">
        <TimeTable />
        <div className="flex-1 min-w-0 relative">
          {/* Hour grid lines */}
          {hours.map((hour) => (
            <div
              key={hour.toString()}
              className="h-20 border-b border-border/50 hover:bg-accent/5 transition-colors"
            />
          ))}
          {/* Events overlay */}
          <DayTimelineEvents events={events} dayDate={date} hourHeight={HOUR_HEIGHT} />
        </div>
      </div>
    </div>
  );
};

export { CalendarDayView };
