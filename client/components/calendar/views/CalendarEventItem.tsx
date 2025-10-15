'use client';

import { EventHoverCard } from '../shared/EventHoverCard';
import type { Event } from '@/interface/event.interface';
import { CalendarEvent } from './FullCalendar';

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
  side = 'right',
  align = 'start',
}: CalendarEventItemProps) {
  // Convert CalendarEvent to Event for EventHoverCard
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

  // If hover is disabled, just render children
  if (!enableHover) {
    return <div onClick={onClick}>{children}</div>;
  }

  // Wrap with EventHoverCard
  return (
    <EventHoverCard
      event={fullEvent}
      side={side}
      align={align}
      onEdit={() => onEdit?.(fullEvent)}
      onDelete={() => onDelete?.(event.id)}
    >
      <div onClick={onClick} style={{ cursor: 'pointer' }}>
        {children}
      </div>
    </EventHoverCard>
  );
}
