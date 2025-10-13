'use client';

import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { CustomSelect, SelectOption } from '@/components/ui/custom-select';
import { useCalendars } from '@/hook/calendar/use-calendars';
import type { EventFormData } from '../event-form.schema';

interface CalendarFieldProps {
  form: UseFormReturn<EventFormData>;
}

const CALENDAR_COLORS = [
  { name: 'blue', bg: 'bg-blue-500' },
  { name: 'red', bg: 'bg-red-500' },
  { name: 'green', bg: 'bg-green-500' },
  { name: 'yellow', bg: 'bg-yellow-500' },
  { name: 'purple', bg: 'bg-purple-500' },
  { name: 'pink', bg: 'bg-pink-500' },
  { name: 'indigo', bg: 'bg-indigo-500' },
  { name: 'orange', bg: 'bg-orange-500' },
];

const getCalendarColor = (index: number) => {
  return CALENDAR_COLORS[index % CALENDAR_COLORS.length];
};

export function CalendarField({ form }: CalendarFieldProps) {
  const { data: calendarsData, isLoading, isError } = useCalendars({ limit: 100 });

  const calendars = calendarsData?.data?.items || [];

  // Auto-select first calendar if no calendar is selected
  useEffect(() => {
    if (calendars.length > 0 && !form.getValues('calendar_id')) {
      form.setValue('calendar_id', calendars[0].id, { shouldValidate: true });
    }
  }, [calendars, form]);

  const options: SelectOption[] = calendars.map((calendar, index) => {
    const color = getCalendarColor(index);
    return {
      value: calendar.id,
      label: calendar.name || calendar.google_calendar_id || 'Unnamed Calendar',
      icon: (
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${color.bg}`} />
        </div>
      ),
    };
  });

  return (
    <FormField
      control={form.control}
      name="calendar_id"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-3 py-3 border-b border-border/40">
            <CalendarIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading calendars...</span>
              </div>
            ) : isError ? (
              <div className="text-sm text-destructive">
                Error loading calendars
              </div>
            ) : (
              <FormControl>
                <CustomSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={options}
                  placeholder="Select calendar"
                  className="flex-1 border-0"
                />
              </FormControl>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
