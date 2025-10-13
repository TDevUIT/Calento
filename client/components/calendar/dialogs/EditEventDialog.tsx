'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);
  const { data: eventResponse, isLoading } = useEventById(eventId);
  const event = eventResponse?.data;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!open) return null;
  if (!mounted) return null;

  if (isLoading || !event) {
    const loadingContent = (
      <>
        <div 
          className="fixed inset-0 bg-black/50 z-[9998] animate-in fade-in duration-200"
          style={{ zIndex: 999999 }}
          onClick={() => onOpenChange(false)}
        />

        <div 
          className="fixed inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 9999999 }}
        >
          <div className="w-full h-full bg-background pointer-events-auto animate-in zoom-in-95 fade-in duration-200 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Đang tải sự kiện...</p>
            </div>
          </div>
        </div>
      </>
    );

    return createPortal(loadingContent, document.body);
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
