'use client';

import React, { useState, useEffect } from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import type { Event } from '@/interface';
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
  autoPosition?: boolean;
}

export function EventHoverCard({
  event,
  children,
  onEdit,
  onDelete,
  side: defaultSide = 'bottom',
  align: defaultAlign = 'center',
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

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <HoverCard open={open && !isClicking} onOpenChange={handleOpenChange} openDelay={500} closeDelay={100}>
      <HoverCardTrigger
        asChild
        onPointerDown={() => {
          setIsClicking(true);
          setOpen(false);
        }}
        onPointerUp={() => {
          setTimeout(() => setIsClicking(false), 300);
        }}
        onClick={() => {
          setOpen(false);
        }}
      >
        {children}
      </HoverCardTrigger>
      <HoverCardContent
        side={defaultSide}
        align={defaultAlign}
        className="w-auto p-0 border-0 bg-transparent shadow-none event-hover-card pointer-events-auto z-[9999]"
        sideOffset={8}
        alignOffset={0}
        style={{ pointerEvents: 'auto' }}
        onPointerDownOutside={() => {
          setOpen(false);
        }}
        collisionPadding={20}
        avoidCollisions={true}
      >
        {mode === 'quick' ? (
          <EventQuickPreview
            event={event}
            onEdit={() => {
              setOpen(false);
              onEdit?.();
            }}
            onDelete={() => {
              setOpen(false);
              onDelete?.();
            }}
          />
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
