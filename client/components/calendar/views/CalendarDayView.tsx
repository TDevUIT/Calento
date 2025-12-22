'use client';

import { setHours } from 'date-fns';

import { HourEvents, TimeTable, useCalendar } from './CalendarCore';

const CalendarDayView = () => {
  const { view, events, date } = useCalendar();

  if (view !== 'day') return null;

  const hours = [...Array(24)].map((_, i) => setHours(date, i));

  return (
    <div className="flex flex-col relative h-full border bg-[#F7F8FC] shadow-sm">
      <div className="flex flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin">
        <TimeTable />
        <div className="flex-1 min-w-0">
          {hours.map((hour) => (
            <HourEvents key={hour.toString()} hour={hour} events={events} />
          ))}
        </div>
      </div>
    </div>
  );
};

export { CalendarDayView };
