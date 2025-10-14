'use client';

import { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useEventById } from '@/hook/event/use-event-by-id';
import { EventFormModal } from '@/components/calendar/forms/EventFormModal';
import { Loader2, AlertCircle } from 'lucide-react';
import { getOriginalEventId } from '@/utils/recurring-events.utils';

interface EditEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  onDelete?: () => void;
}

export function EditEventDialog({ open, onOpenChange, eventId }: EditEventDialogProps) {
  const [mounted, setMounted] = useState(false);
  
  const { originalId, isOccurrence, occurrenceIndex } = useMemo(
    () => getOriginalEventId(eventId),
    [eventId]
  );
  
  const { data: eventResponse, isLoading, error } = useEventById(originalId);
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
          className="fixed inset-0 bg-black/50 animate-in fade-in duration-200"
          style={{ zIndex: 10000 }}
          onClick={() => onOpenChange(false)}
        />

        <div 
          className="fixed inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 10001 }}
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
    <>
      {isOccurrence && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 max-w-md" style={{ zIndex: 10050 }}>
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg shadow-lg p-4 flex items-start gap-3 animate-in slide-in-from-top duration-300">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900 dark:text-amber-100 text-sm">
                Editing Recurring Event Series
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                You're editing occurrence #{occurrenceIndex! + 1}. Changes will apply to the entire recurring event series, not just this instance.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <EventFormModal
        open={open}
        onOpenChange={onOpenChange}
        mode="edit"
        event={event}
      />
    </>
  );
}
