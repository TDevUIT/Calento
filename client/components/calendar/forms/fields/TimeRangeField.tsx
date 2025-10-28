'use client';

import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Clock } from 'lucide-react';
import { format, addMinutes } from 'date-fns';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { EventFormData } from '../event-form.schema';
import { DurationField } from './DurationField';

interface TimeRangeFieldProps {
  form: UseFormReturn<EventFormData>;
}

export function TimeRangeField({ form }: TimeRangeFieldProps) {
  const [duration, setDuration] = useState<number>(60); // Default 1 hour
  const startTime = form.watch('start_time');
  const endTime = form.watch('end_time');
  const isAllDay = form.watch('is_all_day');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      if (startTime && endTime && !isAllDay) {
        try {
          const startDate = new Date(startTime);
          const endDate = new Date(endTime);
          
          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            const diffMinutes = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
            if (diffMinutes > 0 && diffMinutes < 1440) { // Less than 24 hours
              setDuration(diffMinutes);
            }
          }
        } catch (error) {
          console.error('Error calculating initial duration:', error);
        }
      }
      setIsInitialized(true);
    }
  }, [startTime, endTime, isAllDay, isInitialized]);

  useEffect(() => {
    if (startTime && duration && isInitialized && !isAllDay) {
      try {
        const startDate = new Date(startTime);
        if (!isNaN(startDate.getTime())) {
          const endDate = addMinutes(startDate, duration);
          const formattedEndTime = format(endDate, "yyyy-MM-dd'T'HH:mm");
          
          const currentEndTime = form.getValues('end_time');
          if (currentEndTime !== formattedEndTime) {
            form.setValue('end_time', formattedEndTime, { 
              shouldValidate: true,
              shouldDirty: true 
            });
          }
        }
      } catch (error) {
        console.error('Error calculating end time:', error);
      }
    }
  }, [startTime, duration, form, isInitialized, isAllDay]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-2" />
        <div className="flex items-center gap-2 flex-1">
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input 
                    type={isAllDay ? "date" : "datetime-local"}
                    className="h-9 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                    value={isAllDay && field.value ? field.value.split('T')[0] : field.value}
                    onChange={(e) => {
                      if (isAllDay) {
                        field.onChange(e.target.value + 'T00:00');
                      } else {
                        field.onChange(e.target.value);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {!isAllDay && (
            <>
              <span className="text-muted-foreground text-sm">to</span>
              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        className="h-9 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
      </div>
      
      {!isAllDay && (
        <div className="pl-8">
          <DurationField 
            value={duration} 
            onChange={setDuration} 
          />
        </div>
      )}
    </div>
  );
}
