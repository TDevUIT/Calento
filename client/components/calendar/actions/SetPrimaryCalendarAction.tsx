'use client';

import { toast } from 'sonner';
import { Star } from 'lucide-react';
import { useUpdateCalendar } from '@/hook/calendar';
import { Calendar } from '@/interface/calendar.interface';

interface SetPrimaryCalendarActionProps {
  calendar: Calendar;
  onSuccess?: () => void;
}

export function SetPrimaryCalendarAction({ calendar, onSuccess }: SetPrimaryCalendarActionProps) {
  const { mutate: updateCalendar, isPending } = useUpdateCalendar();

  const handleSetPrimary = () => {
    if (calendar.is_primary) {
      toast.info('This calendar is already your primary calendar');
      return;
    }

    updateCalendar(
      {
        id: calendar.id,
        data: { is_primary: true },
      },
      {
        onSuccess: () => {
          toast.success('Primary calendar updated!', {
            description: `"${calendar.name}" is now your primary calendar`,
          });
          onSuccess?.();
        },
        onError: (error: Error) => {
          toast.error('Failed to set primary calendar', {
            description: error.message,
          });
        },
      }
    );
  };

  return (
    <button
      onClick={handleSetPrimary}
      disabled={isPending || calendar.is_primary}
      className="flex items-center gap-2 text-sm hover:text-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title={calendar.is_primary ? 'Already primary' : 'Set as primary calendar'}
    >
      <Star
        className={`h-4 w-4 ${
          calendar.is_primary ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'
        }`}
      />
      {isPending ? 'Setting...' : calendar.is_primary ? 'Primary' : 'Set as primary'}
    </button>
  );
}
