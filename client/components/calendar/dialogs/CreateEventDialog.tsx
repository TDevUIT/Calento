'use client';

import { EventFormModal } from '@/components/calendar/forms/EventFormModal';

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCalendarId?: string;
  defaultStartTime?: Date;
  defaultEndTime?: Date;
}

export function CreateEventDialog({
  open,
  onOpenChange,
  defaultCalendarId,
  defaultStartTime,
  defaultEndTime,
}: CreateEventDialogProps) {
  return (
    <EventFormModal
      open={open}
      onOpenChange={onOpenChange}
      mode="create"
      defaultCalendarId={defaultCalendarId}
      defaultStartTime={defaultStartTime}
      defaultEndTime={defaultEndTime}
    />
  );
}
