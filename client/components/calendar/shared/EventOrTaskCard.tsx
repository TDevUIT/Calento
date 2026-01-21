'use client';

import React from 'react';
import { EventHoverCard } from './EventHoverCard';
import { TaskHoverCard } from './TaskHoverCard';
import type { Event } from '@/interface';
import type { Task } from '@/interface';
import type { CalendarEvent } from '../views/FullCalendar';

interface EventOrTaskCardProps {
  event: CalendarEvent;
  fullEvent?: Event;
  fullTask?: Task;
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
}

export function EventOrTaskCard({
  event,
  fullEvent,
  fullTask,
  children,
  onEdit,
  onDelete,
  side = 'bottom',
  align = 'center',
}: EventOrTaskCardProps) {
  if (event.type === 'task' && fullTask) {
    return (
      <TaskHoverCard
        task={fullTask}
        side={side}
        align={align}
        onEdit={onEdit}
      >
        <div onClick={onEdit} style={{ cursor: 'pointer' }}>
          {children}
        </div>
      </TaskHoverCard>
    );
  }

  const eventData: Event = fullEvent || {
    id: event.id,
    user_id: '',
    calendar_id: event.calendarId || '',
    title: event.title,
    start_time: event.start,
    end_time: event.end,
    description: event.description,
    color: event.color,
    is_all_day: false,
    created_at: new Date(),
    updated_at: new Date(),
    creator: event.creator,
  };

  return (
    <EventHoverCard
      event={eventData}
      side={side}
      align={align}
      onEdit={onEdit}
      onDelete={onDelete}
    >
      <div onClick={onEdit} style={{ cursor: 'pointer' }}>
        {children}
      </div>
    </EventHoverCard>
  );
}
