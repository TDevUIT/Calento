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
  const withClickHandler = (handler?: () => void) => {
    if (React.isValidElement(children)) {
      const child = children as React.ReactElement<any>;
      const existingOnClick = child.props?.onClick as
        | ((e: React.MouseEvent) => void)
        | undefined;
      const existingStyle = child.props?.style as React.CSSProperties | undefined;

      return React.cloneElement(child, {
        onClick: (e: React.MouseEvent) => {
          existingOnClick?.(e);
          handler?.();
        },
        style: {
          ...existingStyle,
          cursor: existingStyle?.cursor ?? 'pointer',
        },
      });
    }

    return (
      <span onClick={handler} style={{ cursor: 'pointer' }}>
        {children}
      </span>
    );
  };

  if (event.type === 'task' && fullTask) {
    return (
      <TaskHoverCard
        task={fullTask}
        side={side}
        align={align}
        onEdit={onEdit}
      >
        {withClickHandler(onEdit)}
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
      {withClickHandler(onEdit)}
    </EventHoverCard>
  );
}
