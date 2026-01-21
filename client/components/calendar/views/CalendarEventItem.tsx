'use client';

 import React from 'react';
import { EventHoverCard } from '../shared/EventHoverCard';
import type { Event } from '@/interface';
import { CalendarEvent } from './FullCalendar';

 type ClickableChildProps = {
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
 };

interface CalendarEventItemProps {
  event: CalendarEvent;
  children: React.ReactNode;
  onClick?: () => void;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  enableHover?: boolean;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
}

export function CalendarEventItem({
  event,
  children,
  onClick,
  onEdit,
  onDelete,
  enableHover = true,
  side = 'bottom',
  align = 'center',
}: CalendarEventItemProps) {
  const childWithClickHandler = (() => {
    if (React.isValidElement(children)) {
      const child = children as React.ReactElement<ClickableChildProps>;
      const existingOnClick = child.props?.onClick;
      const existingStyle = child.props?.style;

      return React.cloneElement(child, {
        onClick: (e: React.MouseEvent) => {
          existingOnClick?.(e);
          onClick?.();
        },
        style: {
          ...existingStyle,
          cursor: existingStyle?.cursor ?? 'pointer',
        },
      });
    }

    return (
      <span onClick={onClick} style={{ cursor: 'pointer' }}>
        {children}
      </span>
    );
  })();

  const fullEvent: Event = {
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

  if (!enableHover) {
    return <div onClick={onClick}>{children}</div>;
  }

  return (
    <EventHoverCard
      event={fullEvent}
      side={side}
      align={align}
      onEdit={() => onEdit?.(fullEvent)}
      onDelete={() => onDelete?.(event.id)}
    >
      {childWithClickHandler}
    </EventHoverCard>
  );
}
