'use client';

import React, { useState, useEffect } from 'react';
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
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <HoverCard open={open && !isClicking} onOpenChange={setOpen} openDelay={500} closeDelay={100}>
      <HoverCardTrigger 
        asChild
        onPointerDown={(e) => {
          setIsClicking(true);
          setOpen(false);
        }}
        onPointerUp={(e) => {
          setTimeout(() => setIsClicking(false), 300);
        }}
        onClick={(e) => {
          setOpen(false);
        }}
      >
        {children}
      </HoverCardTrigger>
      <HoverCardContent 
        side={side} 
        align={align}
        className="w-auto p-0 border-0 bg-transparent shadow-none event-hover-card pointer-events-auto"
        sideOffset={8}
        style={{ zIndex: 999999, pointerEvents: 'auto' }}
        onPointerDownOutside={(e) => {
          setOpen(false);
        }}
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
