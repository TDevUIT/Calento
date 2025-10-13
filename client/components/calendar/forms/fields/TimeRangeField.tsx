'use client';

import { UseFormReturn } from 'react-hook-form';
import { Clock } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { EventFormData } from '../event-form.schema';

interface TimeRangeFieldProps {
  form: UseFormReturn<EventFormData>;
}

export function TimeRangeField({ form }: TimeRangeFieldProps) {
  return (
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
                  type="datetime-local" 
                  className="h-9 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <span className="text-muted-foreground text-sm">tới</span>
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
      </div>
    </div>
  );
}
