'use client'

import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar1 } from 'lucide-react';
import { WEEK_CALENDAR_EVENTS, DAYS_OF_WEEK, type CalendarEvent } from '@/constants/dashboard.constants';

interface CalendarPreviewProps {
  currentDate?: Date;
}

const CalendarPreview: React.FC<CalendarPreviewProps> = ({ currentDate = new Date() }) => {
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      const displayHour = hour > 12 ? hour - 12 : hour;
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHourStr = displayHour === 0 ? 12 : displayHour;
      slots.push({
        hour,
        label: `${displayHourStr}${period}`,
      });
    }
    return slots;
  }, []);

  const weekDates = useMemo(() => {
    const dates = [];
    const today = new Date(currentDate);
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [currentDate]);

  const weekRange = useMemo(() => {
    const start = weekDates[0];
    const end = weekDates[4];
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${startStr} - ${endStr}`;
  }, [weekDates]);

  const calculateEventStyle = (event: CalendarEvent) => {
    const startMinutes = event.startHour * 60 + event.startMinute;
    const baseMinutes = 9 * 60; 
    const relativeMinutes = startMinutes - baseMinutes;
    const hourHeight = 48; 
    
    const top = (relativeMinutes / 60) * hourHeight;
    const height = (event.duration / 60) * hourHeight;
    
    return {
      top: `${top}px`,
      height: `${Math.max(height - 1, 18)}px`,
    };
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-950">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Calendar1 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="text-sm font-semibold text-slate-900 dark:text-white">Week View</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 min-w-[140px] text-center">
            {weekRange}
          </span>
          <button 
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors"
            aria-label="Next week"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          <div className="flex-shrink-0 w-12 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
            <div className="h-10 border-b border-slate-200 dark:border-slate-800" />
            {timeSlots.map((slot) => (
              <div 
                key={slot.hour} 
                className="h-12 border-b border-slate-200 dark:border-slate-800 flex items-center justify-center"
              >
                <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">
                  {slot.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex-1 grid grid-cols-5">
            {weekDates.map((date, dayIndex) => {
              const isToday = date.toDateString() === new Date().toDateString();
              const dayOfWeek = date.getDay();
              const events = WEEK_CALENDAR_EVENTS[dayOfWeek] || [];
              
              return (
                <div 
                  key={dayIndex} 
                  className={`border-r border-slate-200 dark:border-slate-800 last:border-r-0 ${
                    isToday ? 'bg-blue-50/50 dark:bg-blue-950/10' : 'bg-white dark:bg-slate-950'
                  }`}
                >
                  <div className={`h-10 border-b border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center ${
                    isToday ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                  }`}>
                    <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                      {DAYS_OF_WEEK[dayOfWeek]}
                    </span>
                    <span className={`text-xs font-bold ${
                      isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-slate-200'
                    }`}>
                      {date.getDate()}
                    </span>
                  </div>

                  <div className="relative">
                    {timeSlots.map((slot) => (
                      <div 
                        key={slot.hour} 
                        className="h-12 border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer"
                      />
                    ))}

                    {events.map((event, eventIndex) => {
                      const style = calculateEventStyle(event);
                      return (
                        <div
                          key={eventIndex}
                          className="absolute left-1 right-1 rounded bg-blue-600 dark:bg-blue-700 text-white px-1.5 py-1 overflow-hidden cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors border-l-2 border-blue-400 dark:border-blue-500"
                          style={style}
                          title={`${event.title} - ${event.time}`}
                        >
                          <div className="text-[9px] font-semibold leading-tight line-clamp-1">
                            {event.title}
                          </div>
                          {parseInt(style.height) > 30 && (
                            <div className="text-[8px] opacity-80 mt-0.5">
                              {event.time.split(' ')[0]}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-2 border-t border-slate-200 dark:border-slate-800">
        <span className="text-[10px] text-slate-400 dark:text-slate-500">Work hours: 9 AM - 5 PM</span>
      </div>
    </div>
  );
};

export default CalendarPreview;
