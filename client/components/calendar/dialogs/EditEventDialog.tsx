'use client';

import { useEventById } from '@/hook/event/use-event-by-id';
import { EventFormModal } from '@/components/calendar/forms/EventFormModal';
import { Loader2 } from 'lucide-react';

interface EditEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  onDelete?: () => void;
}

export function EditEventDialog({ open, onOpenChange, eventId }: EditEventDialogProps) {
  const { data: eventResponse, isLoading } = useEventById(eventId);
  const event = eventResponse?.data;

  if (!open) return null;

  if (isLoading || !event) {
    return (
      <>
        {/* Backdrop Overlay */}
        <div 
          className="fixed inset-0 bg-black/50 z-[100] animate-in fade-in duration-200"
          onClick={() => onOpenChange(false)}
        />

        {/* Loading State */}
        <div className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none">
          <div className="w-full h-full bg-background pointer-events-auto animate-in zoom-in-95 fade-in duration-200 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Đang tải sự kiện...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <EventFormModal
      open={open}
      onOpenChange={onOpenChange}
      mode="edit"
      event={event}
    />
  );
}
