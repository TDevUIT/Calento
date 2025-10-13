'use client';

import { useState } from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import type { Event } from '@/interface/event.interface';
import { EventDetailView } from '../views';
import { EventQuickPreview } from '.';

interface EventHoverCardProps {
  event: Event;
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  /** Show quick preview (default) or full detail view */
  mode?: 'quick' | 'full';
}

export function EventHoverCard({
  event,
  children,
  onEdit,
  onDelete,
  side = 'right',
  align = 'start',
  mode = 'quick',
}: EventHoverCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <HoverCard open={open} onOpenChange={setOpen} openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent 
        side={side} 
        align={align}
        className="w-auto p-0 border-0 bg-transparent shadow-none z-[1000] event-hover-card"
        sideOffset={8}
      >
        {mode === 'quick' ? (
          <EventQuickPreview event={event} />
        ) : (
          <EventDetailView
            event={event}
            onEdit={() => {
              setOpen(false);
              onEdit?.();
            }}
            onDelete={() => {
              setOpen(false);
              onDelete?.();
            }}
            onClose={() => setOpen(false)}
          />
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
