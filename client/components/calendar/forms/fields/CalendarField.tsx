'use client';

import { useEffect, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form';
import { CustomSelect, SelectOption } from '@/components/ui/custom-select';
import { useCalendars } from '@/hook/calendar/use-calendars';
import type { EventFormData } from '../event-form.schema';

interface CalendarFieldProps {
  form: UseFormReturn<EventFormData>;
}
export function CalendarField({ form }: CalendarFieldProps) {
  const { data: calendarsData, isLoading, isError } = useCalendars({ limit: 100 });

  const calendars = useMemo(() => calendarsData?.data?.items || [], [calendarsData]);

  useEffect(() => {
    if (calendars.length > 0 && !form.getValues('calendar_id')) {
      form.setValue('calendar_id', calendars[0].id);
    }
  }, [calendars, form]);

  const options: SelectOption[] = calendars.map((calendar) => {
    return {
      value: calendar?.id,
      label: calendar?.name || calendar?.google_calendar_id || 'Unnamed Calendar',
    };
  });
  return (
    <FormField
      control={form.control}
      name="calendar_id"
      render={({ field, fieldState }) => (
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
            ) : calendars.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No calendars available. Please create a calendar first.
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
          {fieldState.error && (
            <p className="text-sm text-destructive pl-8 -mt-2 mb-2">{fieldState.error.message}</p>
          )}
        </FormItem>
      )}
    />
  );
}
