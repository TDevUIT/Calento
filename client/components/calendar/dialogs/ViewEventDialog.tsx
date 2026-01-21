'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { EventDetailView } from '../views/EventDetailView';
import type { Event } from '@/interface';

interface ViewEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ViewEventDialog({
  open,
  onOpenChange,
  event,
  onEdit,
  onDelete
}: ViewEventDialogProps) {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-md border-0 bg-transparent shadow-none" showCloseButton={false}>
        <DialogTitle className="sr-only">{event.title || 'Event Details'}</DialogTitle>
        <EventDetailView
          event={event}
          onEdit={onEdit}
          onDelete={onDelete}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
